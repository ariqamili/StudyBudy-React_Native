import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Spinner } from "../components/Spinner";
import { useFetch } from "../hooks/useFetch";

const { width } = Dimensions.get("window");
const MARGIN = 8;
const QUAD_WIDTH = width * 0.9;
const MIN_QUAD_HEIGHT = 220;

const QUADRANTS = [
  {
    key: "urgent_important",
    title: "🔥 Urgent & Important",
    color: "#F87171",
    lightBg: "#FEE2E2",
  },
  {
    key: "not_urgent_important",
    title: "⭐ Not Urgent & Important",
    color: "#60A5FA",
    lightBg: "#DBEAFE",
  },
  {
    key: "urgent_not_important",
    title: "⚡ Urgent & Not Important",
    color: "#FBBF24",
    lightBg: "#FEF3C7",
  },
  {
    key: "not_urgent_not_important",
    title: "📝 Not Urgent & Not Important",
    color: "#9CA3AF",
    lightBg: "#F3F4F6",
  },
];

export default function MatrixPage() {
  const {
    data: todos,
    loading,
    loadData,
    createData,
    updateData,
    deleteData,
  } = useFetch("/todos");

  const [newTask, setNewTask] = useState("");
  const [moveMenu, setMoveMenu] = useState<string | null>(null);

  const handleToggle = async (task) => {
    await updateData(task.id, { ...task, completed: !task.completed });
    loadData();
  };

  const handleMove = async (task, targetQuadrant) => {
    setMoveMenu(null);
    await updateData(task.id, { ...task, quadrant: targetQuadrant });
    loadData();
  };

  if (loading) return <Spinner />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Eisenhower Matrix</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={async () => {
            if (!newTask.trim()) return;
            await createData({
              title: newTask,
              completed: false,
              quadrant: "not_urgent_not_important",
            });
            setNewTask("");
            loadData();
          }}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {QUADRANTS.map((q) => {
        const items = todos.filter(
          (t) => (t.quadrant ?? "not_urgent_not_important") === q.key
        );
        return (
          <View key={q.key} style={styles.quadWrapper}>
            <View
              style={[
                styles.quadBox,
                { backgroundColor: q.lightBg, minHeight: MIN_QUAD_HEIGHT },
                { width: QUAD_WIDTH },
              ]}
            >
              <View style={[styles.quadHeader, { backgroundColor: q.color }]}>
                <Text style={styles.quadHeaderText}>{q.title}</Text>
              </View>
              <View style={styles.taskList}>
                {items.length ? (
                  items.map((task) => (
                    <View
                      key={task.id}
                      style={[
                        styles.taskRow,
                        task.completed && styles.taskCompletedRow,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => handleToggle(task)}
                        style={styles.checkbox}
                      >
                        {task.completed ? (
                          <View style={styles.checkboxChecked} />
                        ) : (
                          <View style={styles.checkboxEmpty} />
                        )}
                      </TouchableOpacity>

                      <Text
                        style={[
                          styles.taskText,
                          task.completed && styles.taskTextCompleted,
                        ]}
                      >
                        {task.title}
                      </Text>

                      <TouchableOpacity
                        onPress={() => setMoveMenu(task.id.toString())}
                      >
                        <Text style={styles.moveText}>⋮</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={async () => {
                          await deleteData(task.id);
                          loadData();
                        }}
                      >
                        <Text style={styles.deleteText}>✕</Text>
                      </TouchableOpacity>

                      {moveMenu === task.id.toString() && (
                        <View style={styles.moveMenu}>
                          {QUADRANTS.map((opt) => (
                            <TouchableOpacity
                              key={opt.key}
                              onPress={() => handleMove(task, opt.key)}
                              style={styles.moveOption}
                            >
                              <Text style={styles.moveOptionText}>
                                {opt.title}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No tasks here</Text>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: MARGIN,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  quadWrapper: {
    marginVertical: MARGIN,
    overflow: "visible",
    zIndex: 1,
  },
  quadBox: {
    borderRadius: 12,
    overflow: "visible",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignSelf: "center",
  },
  quadHeader: {
    padding: 8,
    alignItems: "center",
  },
  quadHeaderText: {
    color: "#FFF",
    fontWeight: "600",
    textAlign: "center",
  },
  taskList: {
    padding: 8,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  taskCompletedRow: {
    backgroundColor: "#E5E7EB",
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxEmpty: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#6B7280",
  },
  checkboxChecked: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  taskText: {
    flex: 1,
    color: "#374151",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  moveText: {
    fontSize: 18,
    color: "#6B7280",
    paddingHorizontal: 8,
  },
  deleteText: {
    color: "#DC2626",
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyText: {
    color: "#6B7280",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 16,
  },
  moveMenu: {
    position: "relative",
    top: 36,
    right: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 4,
    zIndex: 1000,
    elevation: 10,
  },
  moveOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  moveOptionText: {
    color: "#374151",
  },
});
