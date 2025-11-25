import { db } from "@/firebase/firebase";
import { Timestamp, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

type SessionDoc = {
  id: string;
  startTime: Timestamp | Date | string;
  endTime: Timestamp | Date | string;
  focusMinutes?: number;
  totalMinutes?: number;
  blockType?: string;
};

const minutesBetween = (start: Timestamp | Date | string, end: Timestamp | Date | string) => {
  const startDate = start instanceof Timestamp ? start.toDate() : new Date(start);
  const endDate = end instanceof Timestamp ? end.toDate() : new Date(end);
  return Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / 60000));
};

const hourLabel = (value: Timestamp | Date | string) => {
  const date = value instanceof Timestamp ? value.toDate() : new Date(value);
  const hour = date.getHours();
  const suffix = hour >= 12 ? "p" : "a";
  const normalized = ((hour + 11) % 12) + 1;
  return `${normalized}${suffix}`;
};

export const useUserStats = (uid?: string | null) => {
  const [sessions, setSessions] = useState<SessionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setSessions([]);
      setLoading(false);
      return;
    }
    const ref = collection(db, "users", uid, "focusSessions");
    const q = query(ref, orderBy("startTime", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data: SessionDoc[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as SessionDoc[];
        setSessions(data);
        setLoading(false);
      },
      () => {
        setSessions([]);
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  const stats = useMemo(() => {
    if (!sessions.length) {
      return {
        focusPercent: 0,
        screenTimeMinutes: 0,
        culprits: [],
        hourly: [],
        streak: 0,
      };
    }

    let focusMinutes = 0;
    let totalMinutes = 0;
    const culpritMap = new Map<string, number>();
    const hourlyMap = new Map<string, number>();
    const daySet = new Set<string>();

    sessions.forEach((session) => {
      const duration = minutesBetween(session.startTime, session.endTime);
      const focus = Math.min(session.focusMinutes ?? duration, duration);
      focusMinutes += focus;
      totalMinutes += session.totalMinutes ?? duration;

      if (session.blockType) {
        culpritMap.set(session.blockType, (culpritMap.get(session.blockType) ?? 0) + duration);
      }

      const label = hourLabel(session.startTime);
      hourlyMap.set(label, (hourlyMap.get(label) ?? 0) + focus);
      const startDay =
        session.startTime instanceof Timestamp
          ? session.startTime.toDate().toDateString()
          : new Date(session.startTime).toDateString();
      daySet.add(startDay);
    });

    const culprits = Array.from(culpritMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    const hourly = Array.from(hourlyMap.entries()).map(([hour, minutes]) => ({ hour, minutes }));

    const focusPercent = totalMinutes ? Math.round((focusMinutes / totalMinutes) * 100) : 0;

    return {
      focusPercent,
      screenTimeMinutes: totalMinutes,
      culprits,
      hourly,
      streak: daySet.size,
    };
  }, [sessions]);

  return {
    loading,
    sessions,
    stats,
  };
};


