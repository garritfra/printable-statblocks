import React from "react";

const StatBlockBasicInfo = ({ creature }) => (
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
);

export default StatBlockBasicInfo;