import React, { useState } from "react";
import yaml from "js-yaml";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const CustomStatBlockDialog = ({ onStatBlockAdd }) => {
  const [yamlContent, setYamlContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    try {
      // Remove ```statblock and ``` wrapper if present
      const cleanedContent = yamlContent
        .replace(/```statblock\n/, "")
        .replace(/```\n?$/, "");

      const parsed = yaml.load(cleanedContent);
      
      // Save to localStorage
      const savedStatBlocks = JSON.parse(localStorage.getItem("customStatBlocks") || "[]");
      savedStatBlocks.push(parsed);
      localStorage.setItem("customStatBlocks", JSON.stringify(savedStatBlocks));
      
      // Call parent handler
      onStatBlockAdd(parsed);
      
      // Clear input and show success message
      setYamlContent("");
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Custom Statblock</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Custom Statblock hinzufügen</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Fügen Sie hier Ihren YAML Statblock ein..."
            value={yamlContent}
            rows={25}
            onChange={(e) => setYamlContent(e.target.value)}
            className="font-mono h-[400px]"
          />
          <Button onClick={handleSubmit}>Hinzufügen</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomStatBlockDialog;