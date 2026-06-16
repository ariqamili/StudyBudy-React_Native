import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  ClockIcon,
  HomeIcon,
  ViewColumnsIcon,
} from "react-native-heroicons/outline";

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick = () => {} }: SidebarProps) {
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", route: "/" },
    { name: "Eisenhower Matrix", route: "/matrix" },
    { name: "Pomodoro Timer", route: "/timer" },
  ];

  const handleNav = (route: string) => {
    router.push(route as any);
    onNavClick();
  };

  return (
    <View style={[styles.sidebar]}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.link}
          onPress={() => handleNav(item.route)}
        >
          {item.name === "Dashboard" && (
            <HomeIcon size={20} color="#fff" style={styles.icon} />
          )}
          {item.name === "Eisenhower Matrix" && (
            <ViewColumnsIcon size={20} color="#fff" style={styles.icon} />
          )}
          {item.name === "Pomodoro Timer" && (
            <ClockIcon size={20} color="#fff" style={styles.icon} />
          )}
          <Text style={styles.linkText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    paddingVertical: 16,
    backgroundColor: "#6B21A8",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  icon: {
    marginRight: 12,
  },
  linkText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
