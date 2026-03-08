import { LanguageStore } from "@/types";
import { zustandStorage } from "@/utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      languages: [],
      currentLanguage: null,
      setLanguages: (languages) => {
        set((state) => ({
          languages,
          currentLanguage: state.currentLanguage ?? languages[0] ?? null,
        }));
      },
      setCurrentLanguage: (language) => set({ currentLanguage: language }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useLanguageStore;
