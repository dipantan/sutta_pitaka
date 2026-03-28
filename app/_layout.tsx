import { setColorPalette } from "@/constants/color";
import { buildTheme } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, PaperProvider, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { mmkvPersister, queryClient } from "@/query/client";
import useThemeStore, { resolveThemeMode } from "@/stores/useTheme";
import { ensureDatasetReady } from "@/utils/database";
// TODO: Wrap with dataset bootstrap guard once utils/database is ready.

type BootstrapState =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "ready" };

const DatasetBootstrap = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<BootstrapState>({ status: "loading" });
  const { colors } = useTheme();

  const bootstrap = useCallback(async () => {
    setState({ status: "loading" });
    try {
      console.log("[dataset] bootstrap invoking ensureDatasetReady");
      await ensureDatasetReady();
      console.log("[dataset] bootstrap ready");
      setState({ status: "ready" });
      RNBootSplash.hide({ fade: true }).catch((error) => {
        console.warn("[bootsplash] hide failed", error);
      });
    } catch (error) {
      console.error("[dataset] bootstrap failed", error);
      setState({ status: "error", error: error as Error });
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (state.status === "loading") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
          padding: 24,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16 }} variant="titleMedium">
          Preparing offline library…
        </Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
          padding: 24,
          gap: 16,
        }}
      >
        <Text variant="titleMedium">Failed to prepare offline data.</Text>
        <Text style={{ textAlign: "center" }}>
          {state.error.message || "Unknown error"}
        </Text>
        <Button mode="contained" onPress={bootstrap}>
          Retry
        </Button>
      </View>
    );
  }

  return <>{children}</>;
};

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
            <DatasetBootstrap>
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
            </DatasetBootstrap>
          </GestureHandlerRootView>
        </PaperProvider>
      </PersistQueryClientProvider>
    </QueryClientProvider>
  );
}
