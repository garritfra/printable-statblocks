import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
              <li>Monster aus dem deutschen SRD hinzufügen und anzeigen</li>
              <li>Alle Statblöcke drucken</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Erste Schritte:</h3>
            <ol className="space-y-2 list-decimal pl-6">
              <li>Klicken Sie auf "Monster hinzufügen"</li>
              <li>
                Wählen Sie ein Monster aus der Liste oder nutzen Sie die Suche
              </li>
              <li>Passen Sie das Layout mit "Layout wechseln" an</li>
              <li>Drucken Sie die Ansicht mit dem Drucken-Button</li>
            </ol>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Tastaturkürzel:</h3>
            <ul className="space-y-2 list-disc pl-6">
              <li>
                <kbd className="kbd">/</kbd> = Monster-Auswahl öffnen
              </li>
            </ul>
          </div>
        </div>
        <p className="text-muted-foreground">
          Diese Nachricht wird nur einmal angezeigt.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;