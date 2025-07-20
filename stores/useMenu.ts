import { MenuById } from "@/api/endpoints";
import { GETCALL } from "@/helpers/apiService";
import zustandStorage from "@/utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface MenuStore {
  menu: Menu | null;
  loading: boolean;
  error: string | null;
  fetchMenu: (id: string, language: string) => Promise<void>;
  selectedChildMenu: any | null;
}

const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      menu: null,
      loading: false,
      error: null,
      async fetchMenu(id, language) {
        try {
          set({ loading: true, error: null });
          const response = await GETCALL<Menu[]>(MenuById(id, language));
          if (response) {
            set({ menu: response[0], loading: false });
          } else {
            set({ error: "Menu not found", loading: false });
          }
          set({ loading: false });
        } catch (error) {
          console.error("Error fetching menu:", error);
          set({ error: "Failed to fetch menu", loading: false });
        }
      },
      selectedChildMenu: null,
    }),
    {
      name: "menu-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useMenuStore;
