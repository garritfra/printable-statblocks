import React from "react";

const StatBlockActions = ({ actions }) => {
  if (!actions) return null;
  
  return (
    <div className="border-t border-gray-300 pt-1">
      <h3 className="font-bold text-xs mb-1">Aktionen</h3>
      {actions.map((action, index) => (
        <div key={index} className="mb-1 text-xs">
          <p className="font-bold">{action.name}</p>
          <p className="whitespace-pre-wrap">{action.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default StatBlockActions;