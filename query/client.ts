import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { MMKV } from "react-native-mmkv";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
});

const storage = new MMKV();

const clientStorage = {
  setItem: (name: string, value: string | number | boolean | ArrayBuffer) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

const mmkvPersister = createAsyncStoragePersister({
  storage: clientStorage,
});

export { mmkvPersister, queryClient };
