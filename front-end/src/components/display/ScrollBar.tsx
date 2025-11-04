import React from "react";

interface ScrollbarProps {
  children: React.ReactNode;
  className?: string;
}

export default function Scrollbar({ children, className = "" }: ScrollbarProps) {
  return (
    <div 
      className={`
        flex-1 
        overflow-y-auto 
        ${className}
        
        /* Scrollbar customizada */
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-800
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:m-1
        [&::-webkit-scrollbar-thumb]:bg-gray-600
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:hover:bg-gray-500
        [&::-webkit-scrollbar-thumb]:active:bg-gray-400
        
        /* Para Firefox */
        scrollbar-width: thin
        scrollbar-color: #4B5563 #1F2937
      `}
    >
      {children}
    </div>
  );
}