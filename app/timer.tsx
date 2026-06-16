import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Bars3Icon } from "react-native-heroicons/outline";
import { usePomodoro } from "../context/PomodoroContext";

export default function PomodoroTimer() {
  const { settings, setSettings, addSession } = usePomodoro();
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<"work" | "break">(
    "work"
  );
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!isActive) {
      const base =
        currentSession === "work" ? settings.workTime : settings.breakTime;
      setTimeLeft(base * 60);
    }
  }, [settings.workTime, settings.breakTime, currentSession, isActive]);

  const handleSessionComplete = () => {
    setIsActive(false);
    addSession({
      type: currentSession,
      duration:
        currentSession === "work" ? settings.workTime : settings.breakTime,
    });
    if (currentSession === "work") {
      setCurrentSession("break");
      setTimeLeft(settings.breakTime * 60);
    } else {
      setCurrentSession("work");
      setTimeLeft(settings.workTime * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pomodoro Timer</Text>

      <View style={styles.timerContainer}>
        <Text style={styles.sessionLabel}>
          {currentSession === "work" ? "🔥 Work Session" : "☕ Break Time"}
        </Text>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => setIsActive((p) => !p)}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>
            {isActive ? "Pause" : "Start"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsActive(false);
            setCurrentSession("work");
            setTimeLeft(settings.workTime * 60);
          }}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setShowSettings((s) => !s)}
        style={styles.settingsToggle}
      >
        <Bars3Icon size={20} color="#7C3AED" />
        <Text style={styles.settingsToggleText}>Settings</Text>
      </TouchableOpacity>

      {showSettings && (
        <View style={styles.settingsPanel}>
          <Text style={styles.settingsHeader}>Timer Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Work Time (min)</Text>
            <TextInput
              style={styles.settingInput}
              keyboardType="numeric"
              value={String(settings.workTime)}
              onChangeText={(val) =>
                setSettings((prev) => ({
                  ...prev,
                  workTime: parseInt(val, 10) || prev.workTime,
                }))
              }
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { marginTop: 12 }]}>
              Break Time (min)
            </Text>
            <TextInput
              style={styles.settingInput}
              keyboardType="numeric"
              value={String(settings.breakTime)}
              onChangeText={(val) =>
                setSettings((prev) => ({
                  ...prev,
                  breakTime: parseInt(val, 10) || prev.breakTime,
                }))
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    marginTop: 25,
  },
  timerContainer: {
    alignItems: "center",
    marginTop: 72,
    marginBottom: 16,
  },
  sessionLabel: {
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 24,
  },
  controlButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  controlButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  settingsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  settingsToggleText: {
    color: "#7C3AED",
    fontSize: 16,
    marginLeft: 8,
  },
  settingsPanel: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  settingsHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
  },
  settingInput: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    textAlign: "center",
  },
});
