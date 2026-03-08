import { ThemeMode } from "@/constants/color";
import { ThemePreference } from "@/types";
import { zustandStorage } from "@/utils/storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeStore {
  preference: ThemePreference;
  systemMode: ThemeMode;
  setPreference: (preference: ThemePreference) => void;
  setSystemMode: (mode: ThemeMode) => void;
}

const initialSystemMode: ThemeMode =
  Appearance.getColorScheme() === "light" ? "light" : "dark";

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      preference: "system" as ThemePreference,
      systemMode: initialSystemMode,
      setPreference: (preference) => set({ preference }),
      setSystemMode: (mode) => set({ systemMode: mode }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

Appearance.addChangeListener(({ colorScheme }) => {
  const mode: ThemeMode = colorScheme === "light" ? "light" : "dark";
  useThemeStore.getState().setSystemMode(mode);
});

export function resolveThemeMode(preference: ThemePreference, systemMode: ThemeMode) {
  if (preference === "system") {
    return systemMode;
  }
  return preference;
}

export default useThemeStore;
