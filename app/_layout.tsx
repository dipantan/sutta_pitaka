import { Color } from "@/constants/color";
import { Theme } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button, PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { mmkvPersister, queryClient } from "@/query/client";
import { ensureDatasetReady } from "@/utils/database";
// TODO: Wrap with dataset bootstrap guard once utils/database is ready.

type BootstrapState =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "ready" };

const DatasetBootstrap = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<BootstrapState>({ status: "loading" });

  const bootstrap = useCallback(async () => {
    setState({ status: "loading" });
    try {
      await ensureDatasetReady();
      setState({ status: "ready" });
    } catch (error) {
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
          backgroundColor: Color.primaryBackgroundColor,
          padding: 24,
        }}
      >
        <ActivityIndicator size="large" color={Color.primaryColor} />
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
          backgroundColor: Color.primaryBackgroundColor,
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
  return (
    <QueryClientProvider client={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: mmkvPersister }}
      >
        <PaperProvider theme={Theme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <DatasetBootstrap>
              <SafeAreaView
                style={{ flex: 1, backgroundColor: Color.primaryColorLight }}
              >
                <StatusBar
                backgroundColor={Color.primaryColorLight}
                  style="auto"
                />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: Color.primaryBackgroundColor,
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
