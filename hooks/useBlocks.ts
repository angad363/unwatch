import { db } from "@/firebase/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export type Block = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  apps?: string[];
};

export const useBlocks = (uid?: string | null) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setBlocks([]);
      setLoading(false);
      return;
    }
    const ref = collection(db, "users", uid, "blocks");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Block[];
        setBlocks(data);
        setLoading(false);
      },
      () => {
        setBlocks([]);
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  return { blocks, loading };
};


