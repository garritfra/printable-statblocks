import React, { useState, useEffect, useRef } from "react";
import yaml from "js-yaml";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

const MonsterSelector = ({ onMonsterSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogSearchTerm, setDialogSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [yamlContent, setYamlContent] = useState("");
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const { toast } = useToast();

  useKeyboardShortcut({
    key: "/",
    onKeyPressed: () => setIsOpen(true),
  });

  useEffect(() => {
    const fetchMonsters = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://openrpg.de/srd/5e/de/api/monster"
        );
        const data = await response.json();
        if (data.result?.objects) {
          const monsterList = data.result.objects.map((url) => {
            const name = url.split("/monster/")[1].split("/")[0];
            const displayName = name
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
      } finally {
        setLoading(false);
      }
    };

    fetchMonsters();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50); // TODO: Remove. Delay to ensure the dialog is rendered
    }
  }, [isOpen]);

  const filteredMonsterList = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(dialogSearchTerm.toLowerCase())
  );

  const handleMonsterSelect = async (monsterUrl) => {
    await onMonsterSelect(monsterUrl);
    setIsOpen(false);
    setDialogSearchTerm("");
    setSelectedIndex(0);
  };

  const handleCustomStatBlock = () => {
    try {
      const cleanedContent = yamlContent
        .replace(/```statblock\n/, "")
        .replace(/```\n?$/, "");

      const parsed = yaml.load(cleanedContent);
      onMonsterSelect(null, parsed); // Pass the parsed YAML directly
      setYamlContent("");
      setIsOpen(false);
      toast({
        title: "Statblock hinzugefügt",
        description: `${parsed.name} wurde erfolgreich hinzugefügt.`,
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ungültiges YAML Format. Bitte überprüfen Sie die Eingabe.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e) => {
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

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [dialogSearchTerm]);

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
      <DialogContent 
        className="sm:max-w-[600px]" 
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>Monster auswählen</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full flex space-x-1 mb-4">
            <TabsTrigger value="list" className="flex-1">Monsterliste</TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Monster suchen..."
                  value={dialogSearchTerm}
                  onChange={(e) => setDialogSearchTerm(e.target.value)}
                  className="flex-1"
                  ref={inputRef}
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
          </TabsContent>
          <TabsContent value="custom">
            <div className="space-y-4">
              <Textarea
                placeholder="Fügen Sie hier Ihren YAML Statblock ein..."
                value={yamlContent}
                onChange={(e) => setYamlContent(e.target.value)}
                className="font-mono h-[400px] w-full"
              />
              <div className="flex justify-end">
                <Button onClick={handleCustomStatBlock}>Hinzufügen</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MonsterSelector;