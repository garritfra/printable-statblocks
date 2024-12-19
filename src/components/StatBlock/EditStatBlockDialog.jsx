import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import yaml from 'js-yaml';
import { FormatNotice } from '../FormatNotice';

const EditStatBlockDialog = ({ originalYaml, parsedCreature, onUpdate }) => {
  const [yamlContent, setYamlContent] = useState(originalYaml);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = () => {
    try {
      // Verify the YAML is valid by attempting to parse it
      yaml.load(yamlContent);
      
      // If parsing succeeds, pass the raw YAML string to the update handler
      onUpdate(yamlContent);
      setError(null);
      setIsOpen(false);
    } catch (e) {
      setError('Invalid YAML format: ' + e.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="print:hidden"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Edit Statblock: {parsedCreature.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormatNotice />
          <Textarea
            className="font-mono h-96"
            rows={25}
            value={yamlContent}
            onChange={(e) => setYamlContent(e.target.value)}
          />
          {error && (
            <Textarea 
              className="font-mono"
              value={error}
              readOnly
            />
          )}
          <Button onClick={handleUpdate}>Update Statblock</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatBlockDialog;