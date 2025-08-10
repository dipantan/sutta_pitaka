import { ReaderScreenProps } from "@/types";
import { TabStore } from "@/types/tab";
import { zustandStorage } from "@/utils/storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useTab = create<TabStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: ReaderScreenProps) => {
        // dont add same item if already exists
        if (
          !get().items.find(
            (i) => i.uid === item.uid && i.author_uid === item.author_uid
          )
        ) {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      updateImage: (uid: string, author_uid: string, image: string) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uid === uid && item.author_uid === author_uid
              ? { ...item, image }
              : item
          ),
        })),

      removeItem: (uid: string, author_uid: string) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.uid === uid && item.author_uid === author_uid)
          ),
        })),

      getItem: (uid: string, author_uid: string): ReaderScreenProps | null => {
        const item = get().items.find(
          (item) => item.uid === uid && item.author_uid === author_uid
        );
        return item || null;
      },

      clearItems: () => set(() => ({ items: [] })),
    }),
    {
      name: "tab-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize(state) {
        // only store the items
        return { items: state.items };
      },
    }
  )
);

export default useTab;
