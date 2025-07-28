import { Color } from "@/constants/color";
import { Theme } from "@/constants/theme";
import { mmkvPersister, queryClient } from "@/query/client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: mmkvPersister,
      }}
    >
      <PaperProvider theme={Theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: Color.primaryColorLight }}
          >
            <StatusBar backgroundColor={Color.primaryColorLight} style="auto" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Color.primaryBackgroundColor },
              }}
            >
              <Stack.Screen
                name="comment"
                options={{
                  presentation: "transparentModal",
                }}
              />
            </Stack>
          </SafeAreaView>
        </GestureHandlerRootView>
      </PaperProvider>
    </PersistQueryClientProvider>
  );
}
