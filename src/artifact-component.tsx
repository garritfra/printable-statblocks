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
  const StatblockDisplay = ({ creature, onRemove }) => {
    // Calculate if the content is large based on the number of traits and actions
    const isLargeContent =
      (creature.traits?.length || 0) + (creature.actions?.length || 0) > 6 ||
      (creature.actions || []).some((action) => action.value.length > 200);

    return (
      <Card
        className={`
        bg-stone-100 p-2 m-1 relative h-fit 
        break-inside-avoid-page print:break-inside-avoid
        ${isLargeContent ? "col-span-2" : ""}
        ${isLargeContent ? "md:max-w-2xl" : "md:max-w-sm"}
      `}
      >
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

          <div className="grid grid-cols-6 gap-1 text-center my-1">
            {creature.attributes &&
              creature.attributes.map((attr) => (
                <div key={attr.class} className="text-xs">
                  <div className="text-2xs uppercase">{attr.class}</div>
                  <div className="font-bold">{attr.value}</div>
                  <div>{attr.modifier}</div>
                </div>
              ))}
          </div>

          <div className="my-1 space-y-0.5 text-xs">
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
            <div className="border-t border-gray-300 pt-1">
              <h3 className="font-bold text-xs mb-1">Eigenschaften</h3>
              {creature.traits.map((trait, index) => (
                <div key={index} className="mb-1 text-xs">
                  <p className="font-bold">{trait.name}</p>
                  <p className="whitespace-pre-wrap">{trait.value}</p>
                </div>
              ))}
            </div>
          )}

          {creature.actions && creature.actions.length > 0 && (
            <div className="border-t border-gray-300 pt-1">
              <h3 className="font-bold text-xs mb-1">Aktionen</h3>
              {creature.actions.map((action, index) => (
                <div key={index} className="mb-1 text-xs">
                  <p className="font-bold">{action.name}</p>
                  <p className="whitespace-pre-wrap">{action.value}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

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
        grid gap-4 print:m-4
        ${
          layout === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 auto-rows-min"
            : "grid-cols-1"
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
