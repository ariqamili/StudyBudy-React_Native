import React, { createContext, ReactNode, useContext, useState } from "react";

interface Session {
  id: number;
  type: string;
  duration: number;
  date: string;
}

interface PomodoroContextType {
  settings: {
    workTime: number;
    breakTime: number;
    longBreakTime: number;
  };
  setSettings: React.Dispatch<
    React.SetStateAction<{
      workTime: number;
      breakTime: number;
      longBreakTime: number;
    }>
  >;
  sessions: Session[];
  addSession: (s: Omit<Session, "id" | "date">) => void;
  getTodaySessions: () => Session[];
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined
);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
  });
  const [sessions, setSessions] = useState<Session[]>([]);

  const addSession = (s: Omit<Session, "id" | "date">) => {
    const newSession: Session = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...s,
    };
    setSessions((prev) => [...prev, newSession]);
  };

  const getTodaySessions = () => {
    const today = new Date().toISOString().split("T")[0];
    return sessions.filter((sess) => sess.date === today);
  };

  return (
    <PomodoroContext.Provider
      value={{ settings, setSettings, sessions, addSession, getTodaySessions }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) {
    throw new Error("usePomodoro must be used within PomodoroProvider");
  }
  return ctx;
}
