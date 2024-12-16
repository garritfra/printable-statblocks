import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MonsterSelector = ({ monsters, loading, error, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = async (monsterUrl) => {
    await onSelect(monsterUrl);
    setIsOpen(false);
    setSearchTerm("");
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="max-h-96 overflow-y-auto space-y-1">
            {filteredMonsters.map((monster) => (
              <Button
                key={monster.url}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleSelect(monster.url)}
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

export default MonsterSelector;