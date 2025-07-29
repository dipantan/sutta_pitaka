import { Color } from "@/constants/color";
import { Theme } from "@/constants/theme";
import { mmkvPersister, queryClient } from "@/query/client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { preventAutoHideAsync } from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // hideAsync();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: mmkvPersister,
      }}
    >
      <PaperProvider theme={Theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View
            style={[
              styles.statusBarBackground,
              {
                backgroundColor: Color.primaryColorLight,
                height: StatusBar.currentHeight,
              },
            ]}
          />
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
                animation: "fade",
                headerShown: false,
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </PaperProvider>
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure it's behind content
  },
});
