import {
    ActivityIndicator,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useThemePalette } from "./theme-provider";

type FocusBlockCardProps = {
  title: string;
  description: string;
  startTime?: string;
  endTime?: string;
  actionLabel: string;
  onPress: () => void;
  loading?: boolean;
  backgroundImage?: string;
};

export const FocusBlockCard = ({
  title,
  description,
  startTime,
  endTime,
  actionLabel,
  onPress,
  loading,
  backgroundImage,
}: FocusBlockCardProps) => {
  const theme = useThemePalette();
  const content = (
    <>
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: backgroundImage ? "#fff" : theme.textPrimary }]}>
          {title}
        </Text>
        <Text
          style={[
            styles.description,
            { color: backgroundImage ? "#e5e8ff" : theme.textSecondary },
          ]}
        >
          {description}
        </Text>
        {(startTime || endTime) && (
          <Text
            style={[
              styles.timeText,
              { color: backgroundImage ? "#d7dbff" : theme.textSecondary },
            ]}
          >
            {startTime} – {endTime}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: backgroundImage ? "rgba(255,255,255,0.25)" : "#5C6EF8",
          },
        ]}
        onPress={onPress}
        activeOpacity={0.85}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={backgroundImage ? "#fff" : "#fff"} />
        ) : (
          <Text style={styles.buttonText}>{actionLabel}</Text>
        )}
      </TouchableOpacity>
    </>
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={{ uri: backgroundImage }}
        imageStyle={styles.imageBackground}
        style={styles.backgroundCard}
      >
        <View style={styles.overlay} />
        {content}
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  backgroundCard: {
    width: 220,
    borderRadius: 24,
    padding: 18,
    justifyContent: "space-between",
    overflow: "hidden",
    marginRight: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  imageBackground: {
    borderRadius: 24,
  },
  textWrap: {
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    letterSpacing: 0.4,
  },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});


