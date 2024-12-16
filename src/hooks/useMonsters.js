import { useState, useEffect } from "react";
import { fetchMonsterList, parseStatblock } from "../lib/api";

export const useMonsters = () => {
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMonsters = async () => {
      try {
        const monsterList = await fetchMonsterList();
        setMonsters(monsterList);
      } catch (err) {
        setError("Failed to fetch monster list");
        console.error("Error fetching monsters:", err);
      }
    };

    loadMonsters();
  }, []);

  const fetchMonsterData = async (monsterUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(monsterUrl);
      const textData = await response.text();
      const data = parseStatblock(textData);
      setLoading(false);
      return data;
    } catch (error) {
      setError("Failed to fetch monster data");
      console.error("Error fetching monster data:", error);
      setLoading(false);
      return null;
    }
  };

  return { monsters, loading, error, fetchMonsterData };
};
