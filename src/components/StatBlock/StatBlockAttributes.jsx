import React from "react";

const StatBlockAttributes = ({ attributes }) => (
  <div className="grid grid-cols-6 gap-1 text-center my-1">
    {attributes.map((attr) => (
      <div key={attr.class} className="text-xs">
        <div className="text-2xs uppercase">{attr.class}</div>
        <div className="font-bold">{attr.value}</div>
        <div>{attr.modifier}</div>
      </div>
    ))}
  </div>
);

export default StatBlockAttributes;