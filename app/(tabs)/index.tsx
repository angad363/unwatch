import { FocusBlockCard } from "@/components/FocusBlockCard";
import { StatsCard } from "@/components/StatsCard";
import { SuggestedBlock, SuggestedBlocks } from "@/components/SuggestedBlocks";
import { TopBar } from "@/components/TopBar";
import { useThemePalette } from "@/components/theme-provider";
import { addBlock, addFocusSession, auth } from "@/firebase/firebase";
import { useUserStats } from "@/hooks/useUserStats";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const suggestedBlocks: SuggestedBlock[] = [
  {
    id: "laser",
    title: "Laser Focus",
    description: "Daily focus hour from 2-3pm, weekdays.",
    startTime: "14:00",
    endTime: "15:00",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "creative",
    title: "Creative Burst",
    description: "Protect your flow 10-11:30am, weekdays.",
    startTime: "10:00",
    endTime: "11:30",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "night",
    title: "Night Detox",
    description: "Block socials after 9pm, every day.",
    startTime: "21:00",
    endTime: "23:59",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
  },
];

const fallbackHourly = [
  { hour: "6a", minutes: 5 },
  { hour: "9a", minutes: 28 },
  { hour: "12p", minutes: 18 },
  { hour: "3p", minutes: 40 },
  { hour: "6p", minutes: 26 },
];

const formatDuration = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
};

export default function HomeScreen() {
  const theme = useThemePalette();
  const userId = auth.currentUser?.uid ?? null;
  const { stats, loading } = useUserStats(userId);
  const [savingBlock, setSavingBlock] = useState(false);

  const hourly = stats.hourly.length ? stats.hourly : fallbackHourly;
  const maxMinutes = useMemo(
    () => Math.max(...hourly.map((entry) => entry.minutes), 1),
    [hourly]
  );

  const handleAddBlock = async (block: SuggestedBlock) => {
    if (!userId) {
      Alert.alert("Sign in required", "Please sign in to save blocks.");
      return;
    }
    try {
      setSavingBlock(true);
      await addBlock(userId, {
        title: block.title,
        description: block.description,
        startTime: block.startTime,
        endTime: block.endTime,
      });
      await addFocusSession(userId, {
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
        blockType: block.title,
      });
      Alert.alert("Block added", `${block.title} saved to your focus plan.`);
    } catch (error: any) {
      Alert.alert("Failed to add block", error?.message ?? "Please try again.");
    } finally {
      setSavingBlock(false);
    }
  };

  const handleCreateCustomBlock = async () => {
    if (!userId) {
      Alert.alert("Sign in required", "Please sign in to save blocks.");
      return;
    }
    const start = new Date();
    const end = new Date(start.getTime() + 45 * 60 * 1000);
    try {
      setSavingBlock(true);
      await addBlock(userId, {
        title: "Custom Block",
        description: "Your personal deep work session.",
        startTime: start.toTimeString().slice(0, 5),
        endTime: end.toTimeString().slice(0, 5),
      });
      await addFocusSession(userId, {
        startTime: start,
        endTime: end,
        blockType: "Custom Block",
      });
      Alert.alert("Block scheduled", "Custom block saved to your focus plan.");
    } catch (error: any) {
      Alert.alert("Could not save block", error?.message ?? "Please try again.");
    } finally {
      setSavingBlock(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[styles.wrapper, { paddingBottom: 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <TopBar streak={stats.streak || 0} />

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Hourly Focus</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Focus minutes today</Text>
          </View>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.chartContainer}>
              {hourly.map((slot) => (
                <View key={slot.hour} style={styles.chartRow}>
                  <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>{slot.hour}</Text>
                  <View style={styles.chartBarWrapper}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          width: `${(slot.minutes / maxMinutes) * 100}%`,
                          backgroundColor: "#5C6EF8",
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.chartValue, { color: theme.textSecondary }]}>{slot.minutes}m</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <StatsCard
          focusPercent={stats.focusPercent}
          screenTimeLabel={formatDuration(stats.screenTimeMinutes)}
          culprits={stats.culprits}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Create Focus Block</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Define windows where Unwatch guards your attention.</Text>
          <FocusBlockCard
            title="Build your own block"
            description="Pick start/end times and apps to mute."
            actionLabel={savingBlock ? "Saving..." : "Add block"}
            onPress={handleCreateCustomBlock}
            loading={savingBlock}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Suggested Blocks</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Quick presets for productivity, calm, and rest.</Text>
          <SuggestedBlocks blocks={suggestedBlocks} onAdd={handleAddBlock} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  cardHeader: {
    gap: 4,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6a6f82",
  },
  chartContainer: {
    gap: 12,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chartLabel: {
    width: 40,
    fontSize: 12,
  },
  chartBarWrapper: {
    flex: 1,
    backgroundColor: "rgba(92, 110, 248, 0.15)",
    borderRadius: 999,
    overflow: "hidden",
  },
  chartBar: {
    height: 10,
    borderRadius: 999,
  },
  chartValue: {
    width: 40,
    textAlign: "right",
    fontSize: 12,
  },
});

