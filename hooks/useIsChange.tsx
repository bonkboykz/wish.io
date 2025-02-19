"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";

interface isChangeFetchContextType {
  isChangeFetch: boolean;
  setIsChangeFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const isChangeFetchContext = createContext<isChangeFetchContextType | null>(
  null
);

interface isChangeFetchProviderProps {
  children: ReactNode;
}

export const IsChangeFetchProvider: React.FC<isChangeFetchProviderProps> = ({
  children,
}) => {
  const [isChangeFetch, setIsChangeFetch] = useState(true);

  return (
    <isChangeFetchContext.Provider value={{ isChangeFetch, setIsChangeFetch }}>
      {children}
    </isChangeFetchContext.Provider>
  );
};

export const useChange = (): isChangeFetchContextType => {
  const context = useContext(isChangeFetchContext);

  if (!context) {
    throw new Error("useChange must be used within a FilterProvider");
  }

  return context;
};
