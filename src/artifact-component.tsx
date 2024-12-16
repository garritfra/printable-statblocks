import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Printer, Save, Upload } from "lucide-react";

const StatblockLayoutApp = () => {
  const [statblocks, setStatblocks] = useState([]);
  const [layout, setLayout] = useState("grid"); // grid or column

  // Example statblock for testing
  const exampleStatblock = {
    name: "Bandit",
    size: "Mittelgroß",
    type: "Humanoide (jedes Volk)",
    alignment: "jede nicht-rechtschaffene Gesinnung",
    ac: "12 (Lederrüstung)",
    hp: "11 (2W8+2)",
    speed: "9 m",
    stats: [11, 12, 12, 10, 10, 10],
    senses: "Passive Wahrnehmung 10",
    languages: "Eine beliebige Sprache (normalerweise Gemeinsprache)",
    cr: "1/8",
    actions: [
      {
        name: "Krummsäbel",
        desc: "Nahkampfwaffenangriff: +3 auf Treffer, Reichweite 1,5 m, ein Ziel. Treffer: 4 (1W6+1) Hiebschaden.",
      },
      {
        name: "Leichte Armbrust",
        desc: "Fernkampfwaffenangriff: +3 auf Treffer, Reichweite 24/96 m, ein Ziel. Treffer: 5 (1W8+1) Stichschaden.",
      },
    ],
  };

  // Component for rendering individual statblock
  const StatblockDisplay = ({ creature }) => (
    <Card className="w-full max-w-sm bg-stone-100 p-4 m-2">
      <CardContent>
        <h2 className="text-xl font-bold mb-2">{creature.name}</h2>
        <p className="text-sm italic mb-2">
          {creature.size} {creature.type}, {creature.alignment}
        </p>
        <div className="border-t border-b border-gray-300 py-2 my-2">
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
        <div className="grid grid-cols-6 gap-2 text-center my-2">
          {creature.stats.map((stat, index) => (
            <div key={index}>
              <div className="font-bold">{stat}</div>
              <div className="text-sm">{Math.floor((stat - 10) / 2)}</div>
            </div>
          ))}
        </div>
        <div className="my-2">
          <p>
            <strong>Sinne</strong> {creature.senses}
          </p>
          <p>
            <strong>Sprachen</strong> {creature.languages}
          </p>
          <p>
            <strong>Herausforderungsgrad</strong> {creature.cr}
          </p>
        </div>
        <div className="border-t border-gray-300 pt-2">
          <h3 className="font-bold mb-2">Aktionen</h3>
          {creature.actions.map((action, index) => (
            <div key={index} className="mb-2">
              <p className="font-bold">{action.name}</p>
              <p className="text-sm">{action.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Add a new statblock
  const addStatblock = () => {
    setStatblocks([...statblocks, exampleStatblock]);
  };

  // Toggle layout
  const toggleLayout = () => {
    setLayout(layout === "grid" ? "column" : "grid");
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <div>
          <Button onClick={addStatblock} className="mr-2">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Statblock
          </Button>
          <Button onClick={toggleLayout} variant="outline" className="mr-2">
            Toggle Layout
          </Button>
        </div>
        <Button onClick={handlePrint} variant="default">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      <div
        className={`
        ${
          layout === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col items-center"
        }
      `}
      >
        {statblocks.map((statblock, index) => (
          <StatblockDisplay key={index} creature={statblock} />
        ))}
      </div>
    </div>
  );
};

export default StatblockLayoutApp;
