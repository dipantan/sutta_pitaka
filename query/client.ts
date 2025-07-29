import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    },
  },
});

const mmkvPersister = createAsyncStoragePersister({
  storage: clientStorage,
});

export { mmkvPersister, queryClient };
