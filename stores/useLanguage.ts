import { Languages } from "@/api/endpoints";
import { GETCALL } from "@/helpers/apiService";
import zustandStorage from "@/utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      languages: [],
      currentLanguage: null,
      error: null,
      loading: false,
      fetchLanguage: async () => {
        set({ loading: true, error: null });
        try {
          const response = await GETCALL<Language[]>(Languages);
          if (response && response) {
            set({
              languages: response,
              loading: false,
              currentLanguage: response.find((lang) => lang.uid === "en"), // Default to English if available
            });
          } else {
            set({ error: "No languages found", loading: false });
          }
          set({ loading: false });
        } catch (error) {
          console.error("Error fetching languages:", error);
          set({ error: "Failed to fetch languages", loading: false });
        }
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
