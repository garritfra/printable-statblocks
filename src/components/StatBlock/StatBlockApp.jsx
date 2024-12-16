import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import MonsterSelector from "./MonsterSelector";
import StatBlockGrid from "./StatBlockGrid";
import { useMonsters } from "@/hooks/useMonsters";

const StatBlockApp = () => {
  const [layout, setLayout] = useState("grid");
  const { monsters, loading, error, fetchMonsterData } = useMonsters();
  const [statblocks, setStatblocks] = useState([]);

  const handleMonsterSelect = async (monsterUrl) => {
    const newStatblock = await fetchMonsterData(monsterUrl);
    if (newStatblock) {
      setStatblocks(prev => [...prev, newStatblock]);
    }
  };

  const removeStatblock = (index) => {
    setStatblocks(prev => prev.filter((_, i) => i !== index));
  };

  const toggleLayout = () => {
    setLayout(layout === "grid" ? "column" : "grid");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <div className="flex items-center">
          <MonsterSelector
            monsters={monsters}
            loading={loading}
            error={error}
            onSelect={handleMonsterSelect}
          />
          <Button onClick={toggleLayout} variant="outline" className="mr-2">
            Layout wechseln
          </Button>
        </div>
        <Button onClick={handlePrint} variant="default">
          <Printer className="w-4 h-4 mr-2" />
          Drucken
        </Button>
      </div>

      <StatBlockGrid
        statblocks={statblocks}
        layout={layout}
        onRemove={removeStatblock}
      />
    </div>
  );
};

export default StatBlockApp;

