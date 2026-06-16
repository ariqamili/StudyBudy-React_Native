import Constants from "expo-constants";
import { useEffect, useState } from "react";

const API_BASE = Constants.expoConfig?.extra?.apiUrl ??
  "https://685586301789e182b37b8cfa.mockapi.io/studybudy";

interface FetchResult<T> {
  data: T[];
  loading: boolean;
  loadData: () => Promise<void>;
  createData: (newData: Partial<T>) => Promise<void>;
  updateData: (id: string, updatedData: Partial<T>) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
}

export function useFetch<T = any>(path: string): FetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${path}`);
      const json = await res.json();
      setData(json.todos ?? json); 
    } catch {
      setData([]);
    }
    setLoading(false);
  };

  const createData = async (newData: Partial<T>) => {
    await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    });
    await loadData();
  };

  const updateData = async (id: string, updatedData: Partial<T>) => {
    await fetch(`${API_BASE}${path}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    await loadData();
  };

  const deleteData = async (id: string) => {
    await fetch(`${API_BASE}${path}/${id}`, {
      method: "DELETE",
    });
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return { data, loading, loadData, createData, updateData, deleteData };
}
