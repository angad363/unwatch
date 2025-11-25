import { Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { auth } from "../firebase/firebase";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const sub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return sub;
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <Stack>
      {!user ? (
        <Stack.Screen name="login" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
