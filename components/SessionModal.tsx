import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
    Button,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type SessionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (session: {
    name: string;
    notes: string;
    mood: string;
    category: string;
    startTime: Date;
    endTime: Date;
  }) => void;
};

const moodOptions = ["😃", "😐", "😔", "😡", "😴"];
const categoryOptions = ["Work", "Study", "Exercise", "Meditation", "Other"];

export default function SessionModal({ visible, onClose, onSave }: SessionModalProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date(Date.now() + 60 * 60 * 1000));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.title}>New Focus Session</Text>

          {/* Session Name */}
          <Text style={styles.label}>Session Name</Text>
          <TextInput
            placeholder="Session Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          {/* Notes */}
          <Text style={styles.label}>Notes</Text>
          <TextInput
            placeholder="Optional Notes"
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
          />

          {/* Category Dropdown */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.dropdownContainer}>
            {categoryOptions.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.categoryButton,
                  category === c && styles.categorySelected,
                ]}
                onPress={() => setCategory(c)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === c && styles.categoryTextSelected,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mood Selector */}
          <Text style={styles.label}>Mood</Text>
          <View style={styles.dropdownContainer}>
            {moodOptions.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.moodButton,
                  mood === m && styles.moodSelected,
                ]}
                onPress={() => setMood(m)}
              >
                <Text style={styles.moodText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start/End Time Pickers */}
          <Text style={styles.label}>Start Time</Text>
          <DateTimePicker
            value={startTime}
            mode="time"
            display="spinner"
            onChange={(e, d) => d && setStartTime(d)}
          />

          <Text style={styles.label}>End Time</Text>
          <DateTimePicker
            value={endTime}
            mode="time"
            display="spinner"
            onChange={(e, d) => d && setEndTime(d)}
          />

          {/* Buttons */}
          <Button
            title="Start Session"
            onPress={() => {
              onSave({ name, notes, mood, category, startTime, endTime });
              setName(""); setNotes(""); setMood(""); setCategory(categoryOptions[0]);
            }}
          />
          <Button
            title="Cancel"
            color="red"
            onPress={() => {
              onClose();
              setName(""); setNotes(""); setMood(""); setCategory(categoryOptions[0]);
            }}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  dropdownContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  categorySelected: {
    backgroundColor: "#5C6EF8",
    borderColor: "#5C6EF8",
  },
  categoryText: {
    color: "#333",
  },
  categoryTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  moodButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  moodSelected: {
    borderColor: "#5C6EF8",
    backgroundColor: "#E5EBFF",
  },
  moodText: {
    fontSize: 20,
  },
});
