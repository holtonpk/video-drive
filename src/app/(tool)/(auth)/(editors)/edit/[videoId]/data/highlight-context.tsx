"use client";

import React, {createContext, useContext, useState, useCallback} from "react";

export interface TextHighlight {
  id: string;
  start: number;
  end: number;
  color: string;
  text: string;
}

export interface HighlightState {
  highlights: TextHighlight[];
  activeColor: string;
  selection: {start: number; end: number} | null;
}

interface HighlightContextType {
  highlights: TextHighlight[];
  activeColor: string;
  selection: {start: number; end: number} | null;
  addHighlight: (
    start: number,
    end: number,
    color: string,
    text: string
  ) => void;
  removeHighlight: (id: string) => void;
  updateHighlight: (id: string, color: string) => void;
  setSelection: (selection: {start: number; end: number} | null) => void;
  setActiveColor: (color: string) => void;
  clearHighlights: () => void;
  getHighlightsInRange: (start: number, end: number) => TextHighlight[];
}

const HighlightContext = createContext<HighlightContextType | null>(null);

export function useHighlight() {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error("useHighlight must be used within a HighlightProvider");
  }
  return context;
}

interface Props {
  children: React.ReactNode;
}

const DEFAULT_COLORS = [
  "#FEF3C7", // Yellow
  "#D1FAE5", // Green
  "#DBEAFE", // Blue
  "#FCE7F3", // Pink
  "#EDE9FE", // Purple
  "#F3F4F6", // Gray
];

export const HighlightProvider = ({children}: Props) => {
  const [highlights, setHighlights] = useState<TextHighlight[]>([]);
  const [activeColor, setActiveColorState] = useState(DEFAULT_COLORS[0]);
  const [selection, setSelectionState] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const addHighlight = useCallback(
    (start: number, end: number, color: string, text: string) => {
      const newHighlight: TextHighlight = {
        id: `${Date.now()}-${Math.random()}`,
        start,
        end,
        color,
        text,
      };

      setHighlights((prev) => {
        // Remove any overlapping highlights
        const filtered = prev.filter((h) => !(h.start < end && h.end > start));
        return [...filtered, newHighlight];
      });
    },
    []
  );

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const updateHighlight = useCallback((id: string, color: string) => {
    setHighlights((prev) => prev.map((h) => (h.id === id ? {...h, color} : h)));
  }, []);

  const setSelection = useCallback(
    (newSelection: {start: number; end: number} | null) => {
      setSelectionState(newSelection);
    },
    []
  );

  const setActiveColor = useCallback((color: string) => {
    setActiveColorState(color);
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlights([]);
  }, []);

  const getHighlightsInRange = useCallback(
    (start: number, end: number) => {
      return highlights.filter((h) => h.start < end && h.end > start);
    },
    [highlights]
  );

  const value: HighlightContextType = {
    highlights,
    activeColor,
    selection,
    addHighlight,
    removeHighlight,
    updateHighlight,
    setSelection,
    setActiveColor,
    clearHighlights,
    getHighlightsInRange,
  };

  return (
    <HighlightContext.Provider value={value}>
      {children}
    </HighlightContext.Provider>
  );
};

export {DEFAULT_COLORS};
