import { setColorPalette } from "@/constants/color";
import { buildTheme } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { DatabaseInitializer } from "@/components/DatabaseInitializer";
import { mmkvPersister, queryClient } from "@/query/client";
import useThemeStore, { resolveThemeMode } from "@/stores/useTheme";

export default function RootLayout() {
  const preference = useThemeStore((state) => state.preference);
  const systemMode = useThemeStore((state) => state.systemMode);
  const resolvedMode = resolveThemeMode(preference, systemMode);

  const paperTheme = useMemo(() => buildTheme(resolvedMode), [resolvedMode]);

  useEffect(() => {
    setColorPalette(resolvedMode);
  }, [resolvedMode]);

  const statusBarStyle = resolvedMode === "light" ? "dark" : "light";

  return (
    <QueryClientProvider client={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: mmkvPersister }}
      >
        <PaperProvider theme={paperTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <DatabaseInitializer>
              <SafeAreaView
                edges={["left","right","bottom"]}
                style={{ flex: 1, backgroundColor: paperTheme.colors.primaryContainer }}
              >
                <StatusBar
                  backgroundColor={paperTheme.colors.primaryContainer}
                  style={statusBarStyle}
                />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: paperTheme.colors.background,
                    },
                  }}
                />
              </SafeAreaView>
            </DatabaseInitializer>
          </GestureHandlerRootView>
        </PaperProvider>
      </PersistQueryClientProvider>
    </QueryClientProvider>
  );
}
