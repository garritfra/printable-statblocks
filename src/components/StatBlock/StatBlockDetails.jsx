import React from "react";

const StatBlockDetails = ({ creature }) => (
  <div className="my-1 space-y-0.5 text-xs">
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
);

export default StatBlockDetails;