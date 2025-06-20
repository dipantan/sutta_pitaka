import { Color } from "@/constants/color";
import { Theme } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
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
        />
      </GestureHandlerRootView>
    </PaperProvider>
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
