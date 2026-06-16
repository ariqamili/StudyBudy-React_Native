import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Spinner } from "../components/Spinner";
import { usePomodoro } from "../context/PomodoroContext";
import { useFetch } from "../hooks/useFetch";

export default function Dashboard() {
  const { data: todos, loading } = useFetch("/todos");
  const { getTodaySessions } = usePomodoro();
  const sessions = getTodaySessions();
  const pending = todos.filter((t) => !t.completed).slice(6, 14);

  if (loading) return <Spinner />;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { flexGrow: 1, justifyContent: "space-between" },
      ]}
    >
      <Text style={styles.title}>Welcome back to StudyBudy! 🎉</Text>

      <View style={styles.cardsRow}>
        {[
          {
            label: "Sessions",
            value: sessions.length,
            icon: "⏰",
            bg: ["#3B82F6", "#06B6D4"],
          },
          {
            label: "Tasks",
            value: pending.length,
            icon: "📝",
            bg: ["#10B981", "#059669"],
          },
          {
            label: "Focus Time",
            value: `${sessions.length * 25}m`,
            icon: "🎯",
            bg: ["#EF4444", "#EC4899"],
          },
        ].map((c) => (
          <View
            key={c.label}
            style={[styles.card, { backgroundColor: c.bg[0] }]}
          >
            <Text style={styles.cardLabel}>
              {c.icon} {c.label}
            </Text>
            <Text style={styles.cardValue}>{c.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📋 Recent Tasks</Text>
          <Link href="/matrix" style={styles.sectionLink}>
            View All →
          </Link>
        </View>
        {pending.map((t) => (
          <View key={t.id} style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>{t.title}</Text>
          </View>
        ))}
        {!pending.length && (
          <Text style={styles.emptyText}>No pending tasks</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🍅 Today&#39;s Sessions</Text>
          <Link href="/timer" style={styles.sectionLink}>
            Start Timer →
          </Link>
        </View>
        {sessions.map((s) => (
          <View key={s.id} style={styles.listItem}>
            <Text style={styles.listText}>{s.type} Session</Text>
            <Text style={styles.listText}>{s.duration}m</Text>
          </View>
        ))}
        {!sessions.length && (
          <Text style={styles.emptyText}>No sessions today</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#F5F3FF" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLabel: { color: "#fff", fontWeight: "600" },
  cardValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600" },
  sectionLink: { color: "#6B21A8", fontWeight: "500" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 4,
  },
  listBullet: { marginRight: 8, color: "#6B21A8" },
  listText: { flex: 1, color: "#374151" },
  emptyText: { textAlign: "center", color: "#6B7280", marginTop: 8 },
});
