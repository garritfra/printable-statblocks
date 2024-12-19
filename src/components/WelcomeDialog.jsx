import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Bug } from "lucide-react";

const WelcomeDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Willkommen beim Statblock Layout Tool</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div>
            <h3 className="mb-2 font-semibold">Mit dieser App kannst du:</h3>
            <ul className="space-y-2 list-disc pl-6">
              <li>Monster aus dem deutschen OpenRPG SRD durchsuchen und hinzufügen</li>
              <li>Die Ansicht druckerfreundlich formatieren und ausdrucken</li>
              <li>Monster anpassen und eigene Monster erstellen</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Erste Schritte:</h3>
            <ol className="space-y-2 list-decimal pl-6">
              <li>Klicken Sie auf "Monster hinzufügen" oder nutzen Sie die Tastenkombination</li>
              <li>Durchsuchen Sie die Monster-Datenbank mit der Suchfunktion</li>
              <li>Wählen Sie ein oder mehrere Monster aus</li>
              <li>Drucken Sie die Ansicht mit dem Drucken-Button</li>
            </ol>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Tastaturkürzel:</h3>
            <ul className="space-y-2 list-disc pl-6">
              <li>
                <kbd className="kbd">/</kbd> = Monster-Auswahl öffnen
              </li>
              <li>
                <kbd className="kbd">Esc</kbd> = Dialog schließen
              </li>
            </ul>
          </div>
        </div>
        <a
          href="https://github.com/garritfra/printable-statblocks/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-grow sm:flex-grow-0"
        >
          <Button variant="outline" className="w-full">
            <Bug className="w-4 h-4 mr-2" />
            Problem melden
          </Button>
        </a>
        <Button onClick={onOpenChange}>Schließen</Button>
        <p className="text-muted-foreground text-xs">
          Diese Nachricht wird nur beim ersten Besuch angezeigt. Das Tool verwendet die OpenRPG DE API für Monsterdaten.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;