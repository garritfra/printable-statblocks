import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Printer, X } from "lucide-react";
import WelcomeDialog from "@/components/WelcomeDialog";
import MonsterSelector from "@/components/StatBlock/MonsterSelector";
import yaml from "js-yaml";

const STANDARD_STORAGE_KEY = "standardStatblocks";
const CUSTOM_STORAGE_KEY = "customStatBlocks";

const StatblockLayoutApp = () => {
  // Separate state for standard and custom statblocks
  const [standardStatblocks, setStandardStatblocks] = useState(() => {
    const saved = localStorage.getItem(STANDARD_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [customStatblocks, setCustomStatblocks] = useState(() => {
    const saved = localStorage.getItem(CUSTOM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Combined statblocks for display
  const statblocks = [...standardStatblocks, ...customStatblocks];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const parseStatblock = (yamlContent) => {
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

  const handleMonsterSelect = async (monsterUrl, customStatBlock = null) => {
    if (customStatBlock) {
      // Handle custom statblock
      setCustomStatblocks((prev) => [...prev, customStatBlock]);
      return;
    }

    // Handle standard monster
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(monsterUrl);
      const textData = await response.text();
      const data = parseStatblock(textData);
      if (data) {
        setStandardStatblocks((prev) => [...prev, data]);
      }
    } catch (error) {
      setError("Failed to fetch monster data");
      console.error("Error fetching monster data:", error);
    }
    setLoading(false);
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

  const StatblockDisplay = ({ creature, onRemove }) => {
    const getModifier = (stat) => {
      const mod = Math.floor((stat - 10) / 2);
      return mod >= 0 ? `+${mod}` : mod.toString();
    };

    const attributes = ["STR", "DEX", "CON", "INT", "WIS", "CHA"].map(
      (attr, index) => ({
        class: attr,
        value: creature.stats[index],
        modifier: getModifier(creature.stats[index]),
      })
    );

    return (
      <Card className="bg-stone-100 p-2 relative break-inside-avoid print:break-inside-avoid">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 print:hidden"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
        <CardContent className="p-0">
          <h2 className="text-base font-bold mb-1">{creature.name}</h2>
          <p className="text-xs italic mb-1">
            {creature.size} {creature.type}, {creature.alignment}
          </p>

          <div className="border-t border-b border-gray-300 py-1 my-1 text-xs">
            <p>
              <strong>Rüstungsklasse</strong> {creature.ac}
            </p>
            <p>
              <strong>Trefferpunkte</strong> {creature.hp}
            </p>
            <p>
              <strong>Bewegungsrate</strong> {creature.speed}
            </p>
          </div>

          <div className="grid grid-cols-6 gap-1 text-center my-1">
            {attributes.map((attr) => (
              <div key={attr.class} className="text-xs">
                <div className="text-2xs uppercase">{attr.class}</div>
                <div className="font-bold">{attr.value}</div>
                <div>{attr.modifier}</div>
              </div>
            ))}
          </div>

          <div className="my-1 space-y-0.5 text-xs">
            {creature.senses && (
              <p>
                <strong>Sinne</strong> {creature.senses}
              </p>
            )}
            {creature.languages && (
              <p>
                <strong>Sprachen</strong> {creature.languages}
              </p>
            )}
            <p>
              <strong>Herausforderungsgrad</strong> {creature.cr}
            </p>
          </div>

          {creature.actions && (
            <div className="border-t border-gray-300 pt-1">
              <h3 className="font-bold text-xs mb-1">Aktionen</h3>
              {creature.actions.map((action, index) => (
                <div key={index} className="mb-1 text-xs">
                  <p className="font-bold">{action.name}</p>
                  <p className="whitespace-pre-wrap">{action.desc}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4">
      <WelcomeDialog open={showWelcome} onOpenChange={handleWelcomeClose} />
      <div className="flex justify-between items-center mb-4 print:hidden">
        <div className="flex items-center">
          <MonsterSelector onMonsterSelect={handleMonsterSelect} />
        </div>
        <div className="flex gap-4">
          <Button onClick={handlePrint} variant="default">
            <Printer className="w-4 h-4 mr-2" />
            Drucken
          </Button>
          <Button onClick={() => setShowWelcome(true)} variant="secondary">
            <HelpCircle className="w-4 h-4 mr-2" />
            Hilfe
          </Button>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 print:columns-2 gap-4 space-y-4 [column-fill:_balance]">
        {statblocks.map((statblock, index) => (
          <div key={index} className="break-inside-avoid-page">
            <StatblockDisplay
              creature={statblock}
              onRemove={() => removeStatblock(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatblockLayoutApp;
