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

const EditStatBlockDialog = ({ creature, onUpdate }) => {
  const [yamlContent, setYamlContent] = useState(yaml.dump(creature));
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = () => {
    try {
      const updatedCreature = yaml.load(yamlContent);
      onUpdate(updatedCreature);
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
          <DialogTitle>Edit Statblock: {creature.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FormatNotice />
          <Textarea
            className="font-mono h-96"
            rows={25}
            value={yamlContent}
            onChange={(e) => setYamlContent(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleUpdate}>Update Statblock</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatBlockDialog;