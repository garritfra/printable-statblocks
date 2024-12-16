import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getModifier } from "@/utils/statblock";
import StatBlockBasicInfo from "./StatBlockBasicInfo"
import StatBlockAttributes from "./StatBlockAttributes"
import StatBlockDetails from "./StatBlockDetails"
import StatBlockActions from "./StatBlockActions"

const StatBlockDisplay = ({ creature, onRemove }) => {
  const attributes = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((attr, index) => ({
    class: attr,
    value: creature.stats[index],
    modifier: getModifier(creature.stats[index])
  }));

  return (
    <Card className="bg-stone-100 p-2 m-1 relative h-fit break-inside-avoid-page print:break-inside-avoid">
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

        <StatBlockBasicInfo creature={creature} />
        <StatBlockAttributes attributes={attributes} />
        <StatBlockDetails creature={creature} />
        <StatBlockActions actions={creature.actions} />
      </CardContent>
    </Card>
  );
};

export default StatBlockDisplay;
