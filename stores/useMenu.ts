import { MenuById } from "@/api/endpoints";
import { GETCALL } from "@/helpers/apiService";
import { create } from "zustand";

const useMenuStore = create<MenuStore>((set) => ({
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
}));

export default useMenuStore;
