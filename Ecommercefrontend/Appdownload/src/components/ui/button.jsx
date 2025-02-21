
import React from "react";

export const Button = ({ children, onClick, className = "", ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`
        bg-gray-800 
        hover:bg-gray-700 
        text-white 
        font-normal 
        py-2 
        px-6 
        border-b-4 
        border-gray-900 
        hover:border-gray-800 
        rounded 
        transition-all 
        duration-200 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};