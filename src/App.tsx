import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle, Printer } from "lucide-react";
import WelcomeDialog from "@/components/WelcomeDialog";
import MonsterSelector from "@/components/StatBlock/MonsterSelector";
import yaml from "js-yaml";
import StatBlockDisplay from "@/components/StatBlock/StatBlockDisplay";

const STANDARD_STORAGE_KEY = "standardStatblocksYaml";
const CUSTOM_STORAGE_KEY = "customStatBlocksYaml";

const StatblockLayoutApp = () => {
  const [standardStatblocks, setStandardStatblocks] = useState(() => {
    const saved = localStorage.getItem(STANDARD_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [customStatblocks, setCustomStatblocks] = useState(() => {
    const saved = localStorage.getItem(CUSTOM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

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

  const extractYamlContent = (content: string) => {
    const match = content.match(/```statblock\n([\s\S]*?)```/);
    if (!match) {
      throw new Error("Could not find statblock content");
    }
    return match[1].trim();
  };

  const handleMonsterSelect = async (
    monsterUrl: string,
    customStatBlock = null
  ) => {
    if (customStatBlock) {
      // For custom statblocks, store the YAML directly
      setCustomStatblocks((prev: string[]) => [...prev, customStatBlock]);
      return;
    }

    // For standard monsters, fetch and store the YAML
    try {
      const response = await fetch(monsterUrl);
      const textData = await response.text();
      const yamlContent = extractYamlContent(textData);
      if (yamlContent) {
        setStandardStatblocks((prev: string[]) => [...prev, yamlContent]);
      }
    } catch (error) {
      console.error("Error fetching monster data:", error);
    }
  };

  const removeStatblock = (index) => {
    if (index < standardStatblocks.length) {
      setStandardStatblocks((prev) => prev.filter((_, i) => i !== index));
    } else {
      const customIndex = index - standardStatblocks.length;
      setCustomStatblocks((prev) => prev.filter((_, i) => i !== customIndex));
    }
  };

  const handleStatBlockEdit = (index, updatedYaml) => {
    if (index < standardStatblocks.length) {
      setStandardStatblocks((prev) =>
        prev.map((block, i) => (i === index ? updatedYaml : block))
      );
    } else {
      const customIndex = index - standardStatblocks.length;
      setCustomStatblocks((prev) =>
        prev.map((block, i) => (i === customIndex ? updatedYaml : block))
      );
    }
  };

  // Combine and parse YAML only when needed for rendering
  const parseStatblock = (yamlContent) => {
    try {
      return yaml.load(yamlContent);
    } catch (error) {
      console.error("Error parsing YAML:", error);
      return null;
    }
  };

  const getAllStatblocks = () => {
    return [...standardStatblocks, ...customStatblocks].map((yamlContent) => ({
      yaml: yamlContent,
      parsed: parseStatblock(yamlContent),
    }));
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
        {getAllStatblocks().map(({ yaml, parsed }, index) => (
          <div key={index} className="break-inside-avoid-page">
            <StatBlockDisplay
              creature={parsed}
              originalYaml={yaml}
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
