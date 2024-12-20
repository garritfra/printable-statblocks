import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, Printer } from "lucide-react";
import WelcomeDialog from "@/components/WelcomeDialog";
import MonsterSelector from "@/components/StatBlock/MonsterSelector";
import yaml from "js-yaml";
import StatBlockDisplay from "@/components/StatBlock/StatBlockDisplay";

const STANDARD_STORAGE_KEY = "standardStatblocks";
const CUSTOM_STORAGE_KEY = "customStatBlocks";

const StatblockLayoutApp = () => {
  const [standardStatblocks, setStandardStatblocks] = useState(() => {
    const saved = localStorage.getItem(STANDARD_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [customStatblocks, setCustomStatblocks] = useState(() => {
    const saved = localStorage.getItem(CUSTOM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const statblocks = [...standardStatblocks, ...customStatblocks];
  const [showWelcome, setShowWelcome] = useState(false);

  // Save standard statblocks
  useEffect(() => {
    localStorage.setItem(
      STANDARD_STORAGE_KEY,
      JSON.stringify(standardStatblocks)
    );
  }, [standardStatblocks]);

  // Save custom statblocks
  useEffect(() => {
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customStatblocks));
  }, [customStatblocks]);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  const parseStatblock = (yamlContent: string) => {
    try {
      const match = yamlContent.match(/```statblock\n([\s\S]*?)```/);
      if (!match) {
        throw new Error("Could not find statblock content");
      }
      const cleanYaml = match[1].trim();
      return yaml.load(cleanYaml);
    } catch (error) {
      console.error("Error parsing YAML:", error);
      return null;
    }
  };

  const handleMonsterSelect = async (
    monsterUrl: string,
    customStatBlock = null
  ) => {
    if (customStatBlock) {
      // Handle custom statblock
      setCustomStatblocks((prev: unknown[]) => [...prev, customStatBlock]);
      return;
    }

    // Handle standard monster
    try {
      const response = await fetch(monsterUrl);
      const textData = await response.text();
      const data = parseStatblock(textData);
      if (data) {
        setStandardStatblocks((prev: string[]) => [...prev, data]);
      }
    } catch (error) {
      console.error("Error fetching monster data:", error);
    }
  };

  const removeStatblock = (index) => {
    // Determine if we're removing from standard or custom statblocks
    if (index < standardStatblocks.length) {
      setStandardStatblocks((prev) => prev.filter((_, i) => i !== index));
    } else {
      const customIndex = index - standardStatblocks.length;
      setCustomStatblocks((prev) => prev.filter((_, i) => i !== customIndex));
    }
  };

  const handleStatBlockEdit = (index, updatedCreature) => {
    if (index < standardStatblocks.length) {
      setStandardStatblocks((prev) =>
        prev.map((block, i) => (i === index ? updatedCreature : block))
      );
    } else {
      const customIndex = index - standardStatblocks.length;
      setCustomStatblocks((prev) =>
        prev.map((block, i) => (i === customIndex ? updatedCreature : block))
      );
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <WelcomeDialog open={showWelcome} onOpenChange={handleWelcomeClose} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 print:hidden">
        <div className="w-full sm:w-auto">
          <MonsterSelector onMonsterSelect={handleMonsterSelect} />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button
            onClick={window.print}
            variant="secondary"
            className="flex-grow sm:flex-grow-0"
          >
            <Printer className="w-4 h-4 mr-2" />
            Drucken
          </Button>

          <Button
            onClick={() => setShowWelcome(true)}
            variant="ghost"
            className="flex-grow sm:flex-grow-0"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Hilfe
          </Button>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 print:columns-2 gap-2 sm:gap-4 space-y-2 sm:space-y-4 [column-fill:_balance]">
        {statblocks.map((statblock, index) => (
          <div key={index} className="break-inside-avoid-page">
            <StatBlockDisplay
              creature={statblock}
              onRemove={() => removeStatblock(index)}
              onEdit={handleStatBlockEdit}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatblockLayoutApp;
