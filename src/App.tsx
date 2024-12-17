import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, PlusCircle, Printer, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import WelcomeDialog from "@/components/WelcomeDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import yaml from "js-yaml";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";

const STORAGE_KEY = "statblocks";

const StatblockLayoutApp = () => {
  const [statblocks, setStatblocks] = useState(() => {
    const savedStatblocks = localStorage.getItem(STORAGE_KEY);
    return savedStatblocks ? JSON.parse(savedStatblocks) : [];
  });
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

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

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const response = await fetch(
          "https://openrpg.de/srd/5e/de/api/monster"
        );
        const data = await response.json();
        if (data.result && data.result.objects) {
          const monsterList = data.result.objects.map((url: string) => {
            const name = url.split("/monster/")[1].split("/")[0];
            const displayName = name
              .split("-")
              .map((word: string) => {
                // Ersetze deutsche Umlaute
                word = word.replace(/ae/g, "ä");
                word = word.replace(/oe/g, "ö");
                word = word.replace(/ue/g, "ü");
                word = word.replace(/Ae/g, "Ä");
                word = word.replace(/Oe/g, "Ö");
                word = word.replace(/Ue/g, "Ü");

                // Erster Buchstabe groß, Rest klein
                return word.charAt(0).toUpperCase() + word.slice(1);
              })
              .join(" ");
            return {
              name: displayName,
              url: `https://openrpg.de/srd/5e/de/api/monster/${name}/fantasystatblocks.yaml`,
            };
          });
          setMonsters(monsterList);
        }
      } catch (error) {
        setError("Failed to fetch monster list");
        console.error("Error fetching monsters:", error);
      }
    };

    fetchMonsters();
  }, []);

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statblocks));
  }, [statblocks]);

  const fetchMonsterData = async (monsterUrl: string | URL | Request) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(monsterUrl);
      const textData = await response.text();
      const data = parseStatblock(textData);
      if (data) {
        setStatblocks((prev: any) => [...prev, data]);
      }
    } catch (error) {
      setError("Failed to fetch monster data");
      console.error("Error fetching monster data:", error);
    }
    setLoading(false);
  };

  const removeStatblock = (index: any) => {
    setStatblocks((prev: any[]) =>
      prev.filter((_: any, i: any) => i !== index)
    );
  };

  const StatblockDisplay = ({ creature, onRemove }) => {
    const getModifier = (stat: number) => {
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
              {creature.actions.map(
                (action: unknown, index: React.Key | null | undefined) => (
                  <div key={index} className="mb-1 text-xs">
                    <p className="font-bold">{action.name}</p>
                    <p className="whitespace-pre-wrap">{action.desc}</p>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const MonsterSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogSearchTerm, setDialogSearchTerm] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const listRef = useRef(null);

    useKeyboardShortcut({
      key: "/",
      onKeyPressed: () => setIsOpen(true),
    });

    const filteredMonsterList = monsters.filter((monster) =>
      monster.name.toLowerCase().includes(dialogSearchTerm.toLowerCase())
    );

    const handleMonsterSelect = async (monsterUrl: any) => {
      await fetchMonsterData(monsterUrl);
      setIsOpen(false);
      setDialogSearchTerm("");
      setSelectedIndex(0);
    };

    const handleKeyDown = (e: { key: any; preventDefault: () => void }) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredMonsterList.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredMonsterList[selectedIndex]) {
            handleMonsterSelect(filteredMonsterList[selectedIndex].url);
          }
          break;
      }
    };

    // Scroll selected item into view when using keyboard navigation
    useEffect(() => {
      if (listRef.current) {
        const selectedElement = listRef.current.children[selectedIndex];
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: "nearest" });
        }
      }
    }, [selectedIndex]);

    // Reset selected index when search term changes
    useEffect(() => {
      setSelectedIndex(0);
    }, [dialogSearchTerm]);

    // Reset selected index when dialog opens
    useEffect(() => {
      if (isOpen) {
        setSelectedIndex(0);
      }
    }, [isOpen]);

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mr-2">
            <PlusCircle className="w-4 h-4 mr-2" />
            Monster hinzufügen
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md" onKeyDown={handleKeyDown}>
          <DialogHeader>
            <DialogTitle>Monster auswählen</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Monster suchen..."
                value={dialogSearchTerm}
                onChange={(e) => setDialogSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div ref={listRef} className="max-h-96 overflow-y-auto space-y-1">
              {filteredMonsterList.map((monster, index) => (
                <Button
                  key={monster.url}
                  variant="ghost"
                  className={`w-full justify-start text-left ${
                    index === selectedIndex ? "bg-accent" : ""
                  }`}
                  onClick={() => handleMonsterSelect(monster.url)}
                  disabled={loading}
                >
                  {monster.name}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
          <MonsterSelector />
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
        {statblocks.map(
          (statblock: any, index: React.Key | null | undefined) => (
            <div key={index} className="break-inside-avoid-page">
              <StatblockDisplay
                creature={statblock}
                onRemove={() => removeStatblock(index)}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default StatblockLayoutApp;
