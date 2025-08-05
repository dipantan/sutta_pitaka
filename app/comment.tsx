import { Color } from "@/constants/color";
import { commentWrapper } from "@/styles/css";
import { margin, padding } from "@/utils/responsive";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

type Props = {
  data: string;
};

export default function Comment() {
  const { data } = useLocalSearchParams<Props>();
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <WebView
        style={styles.webview}
        automaticallyAdjustContentInsets
        automaticallyAdjustsScrollIndicatorInsets
        source={{
          html: `
             <html>
                <head>
                    ${commentWrapper}
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="color: #fff; margin: 16">
                    ${data}
                </body>
            </html>
          `,
        }}
      />

      <Button
        style={{
          position: "absolute",
          bottom: margin.medium,
          alignSelf: "center",
          paddingHorizontal: padding.large,
        }}
        buttonColor={Color.primaryColor}
        textColor={Color.invertedTextColor}
        onPress={() => router.back()}
      >
        Dismiss
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webview: {
    // flex: 1,
    backgroundColor: Color.primaryBackgroundColor,
    marginBottom: 20,
  },
});
