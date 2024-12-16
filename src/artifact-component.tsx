import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Printer, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const StatblockLayoutApp = () => {
  const [statblocks, setStatblocks] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [monsters, setMonsters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract monster name from URL
  const getMonsterNameFromUrl = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 2];
  };

  // Format monster name for display
  const formatMonsterName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch monster list on component mount
  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const response = await fetch(
          "https://openrpg.de/srd/5e/de/api/monster"
        );
        const data = await response.json();
        if (data.result && data.result.objects) {
          // Create an array of monster objects with names and URLs
          const monsterList = data.result.objects.map((url) => {
            const name = url.split("/monster/")[1].split("/")[0];
            const displayName = name
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            return {
              name: displayName,
              url: url,
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

  // Fetch individual monster data
  const fetchMonsterData = async (monsterUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${monsterUrl}/json`);
      const data = await response.json();
      if (data) {
        setStatblocks((prev) => [...prev, data]);
      }
    } catch (error) {
      setError("Failed to fetch monster data");
      console.error("Error fetching monster data:", error);
    }
    setLoading(false);
  };

  // Remove a statblock
  const removeStatblock = (index) => {
    setStatblocks((prev) => prev.filter((_, i) => i !== index));
  };

  // Filter monsters based on search term
  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Component for rendering individual statblock
  const StatblockDisplay = ({ creature, onRemove }) => (
    <Card className="w-full max-w-sm bg-stone-100 p-4 m-2 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 print:hidden"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">{creature.name}</h2>
        <p className="text-sm italic mb-2">
          {creature.size} {creature.type}, {creature.alignment}
        </p>

        <div className="border-t border-b border-gray-300 py-2 my-2">
          <p>
            <strong>Rüstungsklasse</strong> {creature["armor-class"]?.value}{" "}
            {creature["armor-class"]?.info &&
              `(${creature["armor-class"].info})`}
          </p>
          <p>
            <strong>Trefferpunkte</strong> {creature["hit-points"]?.value}{" "}
            {creature["hit-points"]?.formula &&
              `(${creature["hit-points"].formula})`}
          </p>
          <p>
            <strong>Bewegungsrate</strong>{" "}
            {Object.entries(creature.speeds || {})
              .map(([type, speed]) => `${speed}`)
              .join(", ")}
          </p>
        </div>

        <div className="grid grid-cols-6 gap-2 text-center my-2">
          {creature.attributes &&
            creature.attributes.map((attr) => (
              <div key={attr.class}>
                <div className="text-xs uppercase">{attr.class}</div>
                <div className="font-bold">{attr.value}</div>
                <div className="text-sm">{attr.modifier}</div>
              </div>
            ))}
        </div>

        <div className="my-2 space-y-1">
          {creature["damage-resistances"]?.length > 0 && (
            <p>
              <strong>Resistenzen</strong>{" "}
              {creature["damage-resistances"].join(", ")}
            </p>
          )}
          {creature["damage-vulnerabilitys"]?.length > 0 && (
            <p>
              <strong>Anfälligkeiten</strong>{" "}
              {creature["damage-vulnerabilitys"].join(", ")}
            </p>
          )}
          {creature.senses?.length > 0 && (
            <p>
              <strong>Sinne</strong> {creature.senses.join(", ")}
            </p>
          )}
          {creature.languages?.length > 0 && (
            <p>
              <strong>Sprachen</strong> {creature.languages.join(", ")}
            </p>
          )}
          <p>
            <strong>Herausforderungsgrad</strong> {creature.challenge} (
            {creature.xp} EP)
          </p>
        </div>

        {creature.traits && creature.traits.length > 0 && (
          <div className="border-t border-gray-300 pt-2">
            <h3 className="font-bold mb-2">Eigenschaften</h3>
            {creature.traits.map((trait, index) => (
              <div key={index} className="mb-2">
                <p className="font-bold">{trait.name}</p>
                <p className="text-sm">{trait.value}</p>
              </div>
            ))}
          </div>
        )}

        {creature.actions && creature.actions.length > 0 && (
          <div className="border-t border-gray-300 pt-2">
            <h3 className="font-bold mb-2">Aktionen</h3>
            {creature.actions.map((action, index) => (
              <div key={index} className="mb-2">
                <p className="font-bold">{action.name}</p>
                <p className="text-sm">{action.value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const MonsterSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogSearchTerm, setDialogSearchTerm] = useState("");

    // Filter monsters based on search term
    const filteredMonsterList = monsters.filter((monster) =>
      monster.name.toLowerCase().includes(dialogSearchTerm.toLowerCase())
    );

    const handleMonsterSelect = async (monsterUrl) => {
      await fetchMonsterData(monsterUrl);
      setIsOpen(false);
      setDialogSearchTerm("");
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mr-2">
            <PlusCircle className="w-4 h-4 mr-2" />
            Monster hinzufügen
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
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
            <div className="max-h-96 overflow-y-auto space-y-1">
              {filteredMonsterList.map((monster) => (
                <Button
                  key={monster.url}
                  variant="ghost"
                  className="w-full justify-start text-left"
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

  // Toggle layout
  const toggleLayout = () => {
    setLayout(layout === "grid" ? "column" : "grid");
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <div className="flex items-center">
          <MonsterSelector />
          <Button onClick={toggleLayout} variant="outline" className="mr-2">
            Layout wechseln
          </Button>
        </div>
        <Button onClick={handlePrint} variant="default">
          <Printer className="w-4 h-4 mr-2" />
          Drucken
        </Button>
      </div>

      <div
        className={`
        ${
          layout === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col items-center"
        }
      `}
      >
        {statblocks.map((statblock, index) => (
          <StatblockDisplay
            key={index}
            creature={statblock}
            onRemove={() => removeStatblock(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default StatblockLayoutApp;
