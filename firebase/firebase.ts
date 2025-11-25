import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword, getReactNativePersistence, initializeAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

// Auth helpers ---------------------------------------------------------------
export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutUser = () => signOut(auth);

// Firestore helpers ----------------------------------------------------------
export type FocusSessionPayload = {
  startTime: Date | string;
  endTime: Date | string;
  blockType?: string;
  mood?: number; // e.g., 1-5 or use emoji codes
  status?: "in-progress" | "paused" | "completed" | "stopped";
  breakMinutes?: number; // minutes of break taken
};


export type BlockPayload = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  apps?: string[];
};

export const addFocusSession = (uid: string, session: FocusSessionPayload) =>
  addDoc(collection(db, "users", uid, "focusSessions"), {
    ...session,
    startTime: normalizeTimestamp(session.startTime),
    endTime: normalizeTimestamp(session.endTime),
    createdAt: serverTimestamp(),
  });

export const addBlock = (uid: string, block: BlockPayload) =>
  addDoc(collection(db, "users", uid, "blocks"), {
    ...block,
    createdAt: serverTimestamp(),
  });

  export const getUserStats = async (uid: string) => {
    const snapshot = await getDocs(
      query(collection(db, "users", uid, "focusSessions"), orderBy("startTime", "desc"))
    );

    let totalMinutes = 0;
    let totalBreakMinutes = 0;
    let moodSum = 0;
    let moodCount = 0;
    const statusCounts: Record<string, number> = {};
    const culpritMap = new Map<string, number>();

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const minutes = diffInMinutes(data.startTime, data.endTime);
      totalMinutes += minutes;

      if (data.blockType) {
        culpritMap.set(data.blockType, (culpritMap.get(data.blockType) ?? 0) + minutes);
      }

      // Track break minutes
      if (data.breakMinutes) {
        totalBreakMinutes += data.breakMinutes;
      }

      // Track mood
      if (data.mood !== undefined) {
        moodSum += data.mood;
        moodCount += 1;
      }

      // Track session status
      const status = data.status || "unknown";
      statusCounts[status] = (statusCounts[status] ?? 0) + 1;
    });

    const topCategories = Array.from(culpritMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

  return { totalMinutes, topCategories, sessionCount: snapshot.size };


  };

const normalizeTimestamp = (value: Date | string) =>
  value instanceof Date ? Timestamp.fromDate(value) : Timestamp.fromDate(new Date(value));

const diffInMinutes = (start: any, end: any) => {
  const startDate = start instanceof Timestamp ? start.toDate() : new Date(start);
  const endDate = end instanceof Timestamp ? end.toDate() : new Date(end);
  return Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 60000));
};