import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import EditStatBlockDialog from "@/components/StatBlock/EditStatBlockDialog";

const StatblockDisplay = ({ creature, onRemove, onEdit, index }) => {
  const getModifier = (stat) => {
    const mod = Math.floor((stat - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod.toString();
  };

  const attributes = ["STR", "DEX", "CON", "INT", "WIS", "CHA"].map(
    (attr, index) => ({
      class: attr,
      value: creature.stats[index],
      modifier: getModifier(creature.stats[index]),
    })
  );

  // Function to format specific patterns in the text
  const formatText = (text) => {
    if (!text) return text;

    // Replace patterns for attack modifiers like "+9 auf Treffer"
    text = text.replace(
      /([+-]\d+) auf Treffer/g,
      "<strong>$1 auf Treffer</strong>"
    );

    // Replace patterns for damage rolls like "Treffer: 14 (3W6+4)"
    text = text.replace(
      /(\d+ \(\d+W\d+(?:[+-]\d+)?\) \w+schaden)/g,
      "<strong>$1</strong>"
    );

    // Replace patterns for saving throws like "SG-16-Weisheitsrettungswurf"
    text = text.replace(
      /(SG-\d+)-(\w+rettungswurf)/g,
      "<strong>$1-$2</strong>"
    );

    // Additional common patterns
    text = text.replace(
      /([+-]\d+) zu treffen/g,
      "<strong>$1 zu treffen</strong>"
    );
    text = text.replace(/(DC \d+)/gi, "<strong>$1</strong>");
    text = text.replace(/(\d+d\d+[+-]\d+)/g, "<strong>$1</strong>");

    return text;
  };

  return (
    <Card className="bg-stone-100 p-2 relative break-inside-avoid print:break-inside-avoid">
      <div className="absolute top-1 right-1 flex space-x-1 print:hidden">
        <EditStatBlockDialog
          creature={creature}
          onUpdate={(updatedCreature) => onEdit(index, updatedCreature)}
        />
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <CardContent className="p-0">
        <h2 className="text-base font-bold mb-1">{creature.name}</h2>
        <p className="text-xs italic mb-1">
          {creature.size} {creature.type}, {creature.alignment}
        </p>

        <div className="border-t border-b border-gray-300 py-1 my-1 text-xs">
          <p>
            <strong>Rüstungsklasse</strong> {creature.ac}
          </p>
          <p>
            <strong>Trefferpunkte</strong> {creature.hp}
          </p>
          <p>
            <strong>Bewegungsrate</strong> {creature.speed}
          </p>
        </div>

        <div className="grid grid-cols-6 gap-1 text-center my-1">
          {attributes.map((attr) => (
            <div key={attr.class} className="text-xs">
              <div className="text-2xs uppercase font-bold">{attr.class}</div>
              <div>
                {attr.value} (<span>{attr.modifier}</span>)
              </div>
            </div>
          ))}
        </div>

        <div className="my-1 space-y-0.5 text-xs">
          {creature.damage_vulnerabilities && (
            <p>
              <strong>Verwundbarkeiten</strong> {creature.damage_vulnerabilities}
            </p>
          )}
          {creature.damage_immunities && (
            <p>
              <strong>Immunitäten</strong> {creature.damage_immunities}
            </p>
          )}
          {creature.condition_immunities && (
            <p>
              <strong>Zustandsimmunitäten</strong> {creature.condition_immunities}
            </p>
          )}
          {creature.skillsaves && Object.entries(creature.skillsaves).length > 0 && (
            <p>
              <strong>Fertigkeiten</strong>{" "}
              {Object.entries(creature.skillsaves)
                .map(([_, skillObj]) =>
                  Object.entries(skillObj).map(
                    ([skill, value]) => `${skill} ${value >= 0 ? "+" : ""}${value}`
                  )
                )
                .join(", ")}
            </p>
          )}
          {creature.senses && (
            <p>
              <strong>Sinne</strong> {creature.senses}
            </p>
          )}
          {creature.languages && (
            <p>
              <strong>Sprachen</strong> {creature.languages}
            </p>
          )}
          <p>
            <strong>Herausforderungsgrad</strong> {creature.cr}
          </p>
        </div>

        {creature.spells && (
          <div className="border-t border-gray-300 pt-1 my-1">
            <h3 className="font-bold text-xs mb-1">Zauberwirken</h3>
            {creature.spells.map((spell, index) => {
              if (typeof spell === "object") {
                return (
                  <div key={index} className="mb-1 text-xs">
                    <span className="font-bold">{Object.keys(spell)[0]}: </span>
                    <span className="whitespace-pre-wrap">
                      {Object.values(spell)[0]}
                    </span>
                  </div>
                );
              } else {
                return (
                  <p key={index} className="text-xs whitespace-pre-wrap">
                    {spell.toString()}
                  </p>
                );
              }
            })}
          </div>
        )}

        {creature.traits && (
          <div className="border-t border-gray-300 pt-1 my-1">
            <h3 className="font-bold text-xs mb-1">Eigenschaften</h3>
            {creature.traits.map((trait, index) => (
              <div key={index} className="mb-1 text-xs">
                <p className="font-bold">{trait.name}</p>
                <p className="whitespace-pre-wrap">{trait.desc}</p>
              </div>
            ))}
          </div>
        )}

        {creature.actions && (
          <div className="border-t border-gray-300 pt-1">
            <h3 className="font-bold text-xs mb-1">Aktionen</h3>
            {creature.actions.map((action, index) => (
              <div key={index} className="mb-1 text-xs">
                <p className="font-bold">{action.name}</p>
                <p
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: formatText(action.desc),
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {creature.legendary_actions && (
          <div className="border-t border-gray-300 pt-1">
            <h3 className="font-bold text-xs mb-1">Legendäre Aktionen</h3>
            {creature.legendary_actions.map((action, index) => (
              <div key={index} className="mb-1 text-xs">
                <p className="font-bold">{action.name}</p>
                <p
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: formatText(action.desc),
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatblockDisplay;