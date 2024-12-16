import React from "react";
import StatBlockDisplay from "./StatBlockDisplay";

const StatBlockGrid = ({ statblocks, layout, onRemove }) => {
  return (
    <div
      className={`
      grid gap-4 print:m-4
      ${
        layout === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 auto-rows-min"
          : "grid-cols-1"
      }
    `}
    >
      {statblocks.map((statblock, index) => (
        <StatBlockDisplay
          key={index}
          creature={statblock}
          onRemove={() => onRemove(index)}
        />
      ))}
    </div>
  );
};

export default StatBlockGrid;