import { createContext, useContext, useState, type ReactNode } from "react";

interface SettingsContextType {
  showPointers: boolean;
  setShowPointers: (show: boolean) => void;
  randomizePointerColors: boolean;
  setRandomizePointerColors: (randomize: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showPointers, setShowPointers] = useState(true);
  const [randomizePointerColors, setRandomizePointerColors] = useState(false);

  return (
    <SettingsContext.Provider value={{ showPointers, setShowPointers, randomizePointerColors, setRandomizePointerColors }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
