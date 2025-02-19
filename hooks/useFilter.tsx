"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface FilterContextType {
  isOpen: boolean;
  togglePanel: () => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePanel = () => setIsOpen((prev) => !prev);

  return (
    <FilterContext.Provider value={{ isOpen, togglePanel }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }

  return context;
};
