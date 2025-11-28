"use client";
import { createContext, useState } from "react";

export const StarContext = createContext({
  avgStars: 0,
  setAvgStars: (v: number) => {},
});

export function StarProvider({ children }: { children: React.ReactNode }) {
  const [avgStars, setAvgStars] = useState(0);

  return (
    <StarContext.Provider value={{ avgStars, setAvgStars }}>
      {children}
    </StarContext.Provider>
  );
}
