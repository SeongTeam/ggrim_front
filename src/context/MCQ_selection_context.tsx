// had to implement this because multiple MCQ blocks were getting selected

import React, { createContext, useState, useContext, ReactNode } from "react";

interface MCQSelectionContextType {
  selectedMCQId: string | null;
  setSelectedMCQId: (id: string | null) => void;
}

const MCQSelectionContext = createContext<MCQSelectionContextType | undefined>(
  undefined
);

export const MCQSelectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedMCQId, setSelectedMCQId] = useState<string | null>(null);

  return (
    <MCQSelectionContext.Provider value={{ selectedMCQId, setSelectedMCQId }}>
      {children}
    </MCQSelectionContext.Provider>
  );
};

export const useMCQSelection = () => {
  const context = useContext(MCQSelectionContext);
  if (context === undefined) {
    throw new Error(
      "useMCQSelection must be used within a MCQSelectionProvider"
    );
  }
  return context;
};
