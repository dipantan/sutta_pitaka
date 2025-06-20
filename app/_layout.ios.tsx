import { Color } from "@/constants/color";
import { Theme } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
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
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
