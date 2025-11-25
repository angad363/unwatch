import SessionModal from "@/components/SessionModal";
import { addFocusSession, auth } from "@/firebase/firebase";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const [showSessionModal, setShowSessionModal] = useState(false);

  const handleSaveSession = async (session: {
    name: string;
    notes: string;
    mood: string;
    category: string;
    startTime: Date;
    endTime: Date;
  }) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Sign in required", "You must be logged in to start a session.");
      return;
    }

    try {
      await addFocusSession(userId, {
        blockType: session.category,
        startTime: session.startTime,
        endTime: session.endTime,
        mood: session.mood,
      });
      Alert.alert("Session Started", `Your session "${session.name}" is now running!`);
      setShowSessionModal(false);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Failed to start session.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#5C6EF8",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
          }}
        />
      </Tabs>

      {/* Floating "+" button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowSessionModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Session Modal */}
      <SessionModal
        visible={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onSave={handleSaveSession}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#5C6EF8",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "700",
  },
});
