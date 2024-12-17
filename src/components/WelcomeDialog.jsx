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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Willkommen beim Statblock Layout Tool</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>Mit dieser App können Sie:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Monster aus dem deutschen SRD hinzufügen und anzeigen</li>
              <li>Zwischen Raster- und Spaltenlayout wechseln</li>
              <li>Alle Statblöcke drucken</li>
            </ul>
            <p>Erste Schritte:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Klicken Sie auf "Monster hinzufügen"</li>
              <li>
                Wählen Sie ein Monster aus der Liste oder nutzen Sie die Suche
              </li>
              <li>Passen Sie das Layout mit "Layout wechseln" an</li>
              <li>Drucken Sie die Ansicht mit dem Drucken-Button</li>
            </ol>
            <p className="text-muted-foreground mt-4">
              Diese Nachricht wird nur einmal angezeigt.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
};

export default WelcomeDialog;