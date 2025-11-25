import { StyleSheet, Text, View } from "react-native";
import { useThemePalette } from "./theme-provider";

type StatsCardProps = {
  focusPercent: number;
  screenTimeLabel: string;
  culprits: string[];
};

export const StatsCard = ({ focusPercent, screenTimeLabel, culprits }: StatsCardProps) => {
  const theme = useThemePalette();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.stat}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Focus %</Text>
        <Text style={[styles.value, { color: theme.textPrimary }]}>{focusPercent}%</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.stat}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Screen Time</Text>
        <Text style={[styles.value, { color: theme.textPrimary }]}>{screenTimeLabel}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <View style={styles.stat}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Culprits</Text>
        <View style={styles.chipRow}>
          {(culprits.length ? culprits : ["IG", "YT", "TW"]).map((app) => (
            <View key={app} style={[styles.chip, { backgroundColor: theme.card }]}>
              <Text style={[styles.chipText, { color: theme.textPrimary }]}>{app}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 16,
  },
  stat: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
  },
  divider: {
    width: 1,
    borderRadius: 1,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
});


