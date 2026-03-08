import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FontFamilyPreference = "system" | "serif";

interface TypographyState {
  fontFamily: FontFamilyPreference;
  setFontFamily: (fontFamily: FontFamilyPreference) => void;
}

export const useTypographyStore = create<TypographyState>()(
  persist(
    (set) => ({
      fontFamily: "system",
      setFontFamily: (fontFamily) => set({ fontFamily }),
    }),
    {
      name: "typography-preferences",
    }
  )
);
