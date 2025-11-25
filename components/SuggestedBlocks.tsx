import { ScrollView, StyleSheet, View } from "react-native";
import { FocusBlockCard } from "./FocusBlockCard";

export type SuggestedBlock = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  image: string;
  apps?: string[];
};

type SuggestedBlocksProps = {
  blocks: SuggestedBlock[];
  onAdd: (block: SuggestedBlock) => void;
};

export const SuggestedBlocks = ({ blocks, onAdd }: SuggestedBlocksProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {blocks.map((block) => (
        <View key={block.id} style={styles.item}>
          <FocusBlockCard
            title={block.title}
            description={block.description}
            startTime={block.startTime}
            endTime={block.endTime}
            actionLabel="Add"
            onPress={() => onAdd(block)}
            backgroundImage={block.image}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    paddingRight: 4,
  },
  item: {
    marginRight: 16,
  },
});


