import { Slot } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Bars3Icon, XMarkIcon } from "react-native-heroicons/outline";
import { Sidebar } from "../components/Sidebar";
import { PomodoroProvider } from "../context/PomodoroContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MENU_ITEM_HEIGHT = 56;
const MENU_HEADER_HEIGHT = 56;
const MENU_TOTAL_HEIGHT = MENU_ITEM_HEIGHT * 3;

export default function RootLayout() {
  const [open, setOpen] = useState(false);
  const animHeight = useRef(new Animated.Value(0)).current;
  const menuRef = useRef<View>(null);

  useEffect(() => {
    Animated.timing(animHeight, {
      toValue: open ? MENU_TOTAL_HEIGHT : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [open]);

  return (
    <PomodoroProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setOpen((o) => !o)}
            style={styles.burger}
          >
            {open ? (
              <XMarkIcon size={24} color="#fff" />
            ) : (
              <Bars3Icon size={24} color="#fff" />
            )}
          </TouchableOpacity>
          <Text style={styles.title}>StudyBudy</Text>
          <View style={{ width: 24 }} />
        </View>

        <Animated.View
          ref={menuRef}
          style={[styles.menuContainer, { height: animHeight }]}
        >
          <Sidebar onNavClick={() => setOpen(false)} />
        </Animated.View>

        <View style={styles.content}>
          <Slot />
        </View>
      </SafeAreaView>
    </PomodoroProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0E7FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "purple",
    padding: 12,
    justifyContent: "space-between",
  },
  burger: {
    padding: 8,
    backgroundColor: "#7C3AED",
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  menuContainer: {
    overflow: "hidden",
    backgroundColor: "#6B21A8",
  },
  content: {
    flex: 1,
    padding: 12,
  },
});
