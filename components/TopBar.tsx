import { Feather } from "@expo/vector-icons";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemePalette } from "./theme-provider";

type TopBarProps = {
  streak: number;
};

export const TopBar = ({ streak }: TopBarProps) => {
  const theme = useThemePalette();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I'm on a ${streak}-day focus streak with Unwatch. Join me and reclaim your attention!`,
      });
    } catch {
      // no-op
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.logo, { color: theme.textPrimary }]}>Unwatch</Text>
      <View style={styles.actions}>
        <View style={[styles.streakBadge, { borderColor: theme.border, backgroundColor: theme.surface }]}>
          <Feather name="activity" size={16} color="#f2b705" />
          <Text style={[styles.streakText, { color: theme.textPrimary }]}>{streak}</Text>
        </View>
        <TouchableOpacity
          style={[styles.iconButton, { borderColor: theme.border }]}
          activeOpacity={0.8}
          onPress={handleShare}
        >
          <Feather name="share-2" size={16} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "600",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});


