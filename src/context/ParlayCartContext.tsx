import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";

export interface CartLeg {
  straight_id: string;
  game_id: number;
  display: string;
  odds: number | null;
}

interface ParlayCartContextType {
  legs: CartLeg[];
  addLeg: (leg: CartLeg) => void;
  removeLeg: (straightId: string) => void;
  clear: () => void;
  hasLeg: (straightId: string) => boolean;
  hasGame: (gameId: number) => boolean;
}

const ParlayCartContext = createContext<ParlayCartContextType | null>(null);

const STORAGE_KEY = "edgeforge_parlay_cart";
const DATE_KEY = "edgeforge_parlay_cart_date";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function ParlayCartProvider({ children }: { children: ReactNode }) {
  const [legs, setLegs] = useState<CartLeg[]>(() => {
    try {
      const savedDate = localStorage.getItem(DATE_KEY);
      if (savedDate !== todayStr()) {
        localStorage.removeItem(STORAGE_KEY);
        return [];
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(DATE_KEY, todayStr());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legs));
  }, [legs]);

  const addLeg = useCallback((leg: CartLeg) => {
    setLegs((prev) => {
      if (prev.some((l) => l.straight_id === leg.straight_id)) return prev;
      if (prev.length >= 6) return prev;
      return [...prev, leg];
    });
  }, []);

  const removeLeg = useCallback((straightId: string) => {
    setLegs((prev) => prev.filter((l) => l.straight_id !== straightId));
  }, []);

  const clear = useCallback(() => setLegs([]), []);

  const hasLeg = useCallback(
    (straightId: string) => legs.some((l) => l.straight_id === straightId),
    [legs],
  );

  const hasGame = useCallback(
    (gameId: number) => legs.some((l) => l.game_id === gameId),
    [legs],
  );

  return (
    <ParlayCartContext.Provider value={{ legs, addLeg, removeLeg, clear, hasLeg, hasGame }}>
      {children}
    </ParlayCartContext.Provider>
  );
}

export function useParlayCart() {
  const ctx = useContext(ParlayCartContext);
  if (!ctx) throw new Error("useParlayCart must be used inside ParlayCartProvider");
  return ctx;
}
