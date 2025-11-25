import { TopBar } from "@/components/TopBar";
import { useThemePalette } from "@/components/theme-provider";
import { auth, signOutUser } from "@/firebase/firebase";
import { useUserStats } from "@/hooks/useUserStats";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  const theme = useThemePalette();
  const userId = auth.currentUser?.uid ?? null;
  const { stats, loading } = useUserStats(userId);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOutUser();
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Sign out failed", error?.message ?? "Please try again.");
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.wrapper}>
        <TopBar streak={stats.streak || 0} />

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Account</Text>
            <Text style={[styles.value, { color: theme.textPrimary }]}>
                {auth.currentUser?.email || "Unknown User"}
            </Text>
            <Text style={[styles.subValue, { color: theme.textSecondary }]}>
                {auth.currentUser?.email ? "Signed in with email" : "No email detected."}
            </Text>
            </View>


        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.streakRow}>
            <View style={styles.streakIcon}>
              <Feather name="zap" size={20} color="#FF7A45" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Current streak</Text>
              <Text style={[styles.streakValue, { color: theme.textPrimary }]}>
                {loading ? "--" : `${stats.streak || 0} day${(stats.streak || 0) === 1 ? "" : "s"}`}
              </Text>
            </View>
            <View>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Focus %</Text>
              <Text style={[styles.value, { color: theme.textPrimary }]}>{stats.focusPercent || 0}%</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: "#ff4d4f" }]}
          activeOpacity={0.85}
          onPress={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signOutText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 18,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 6,
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
  },
  subValue: {
    fontSize: 14,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  streakIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,122,69,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  streakValue: {
    fontSize: 32,
    fontWeight: "700",
  },
  signOutButton: {
    marginTop: "auto",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

