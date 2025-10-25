import React from "react";

export const Button = ({ child, className, onClick }) => {
  return (
    <button onClick={onClick} className={`${className}`}>
      {child}
    </button>
  );
};
