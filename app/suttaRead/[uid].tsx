import { BillaraSuttaByAuthor, SuttaByAuthor } from "@/api/endpoints";
import instance from "@/api/instance";
import { Color } from "@/constants/color";
import { cssStyles } from "@/styles/css";
import { ReaderScreenProps } from "@/types";
import { BillaraSuttaType } from "@/types/bilarasutta";
import { LegacySutta } from "@/types/legacySutta";
import { convertToHtml } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Appbar, Text } from "react-native-paper";
import { WebView } from "react-native-webview";

export const fetchTranslation = async (
  uid: string,
  author_uid: string,
  currentLanguage: string,
  segmented?: boolean
) => {
  let response = null;

  if (segmented) {
    const { data } = await instance.get<BillaraSuttaType>(
      BillaraSuttaByAuthor(uid, author_uid, currentLanguage)
    );
    response = data;
  } else {
    const { data } = await instance.get<LegacySutta>(
      SuttaByAuthor(uid, author_uid, currentLanguage)
    );
    response = data;
  }
  return response;
};

const SuttaDetails = () => {
  const { segmented, author_uid, lang, uid, author, author_short } =
    useLocalSearchParams<ReaderScreenProps>();

  const isSegmented = segmented === "true";

  const { data, isLoading, error } = useQuery({
    queryKey: ["suttaRead", uid, author_uid, lang],
    queryFn: () => fetchTranslation(uid, author_uid, lang, isSegmented),
    enabled: !!uid && !!author_uid && !!lang,
    refetchOnMount: "always",
  });

  // JavaScript to inject into WebView
  const injectedJavaScript = `
    (function() {
      document.querySelectorAll('.comment').forEach(function(element) {
        element.addEventListener('click', function() {
          const tooltipValue = this.getAttribute('data-tooltip');
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'commentClick', value: tooltipValue }));
        });
      });
    })();
    true; // Required by WebView
  `;

  // Handle messages from WebView
  const onMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "commentClick") {
        router.push({
          pathname: "/comment",
          params: {
            data: message.value,
          },
        });
      }
    } catch (e) {
      console.error("Error parsing WebView message:", e);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={Color.primaryColor} size={"large"} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text variant="bodyMedium">{error.message}</Text>
      </View>
    );
  }

  const htmlContent = `
    <html>
      <head>
        ${cssStyles}
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="color: #fff; margin: 16">
        ${
          isSegmented
            ? convertToHtml(data as BillaraSuttaType)
            : data?.root_text?.text || "No text available"
        }
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`${author || author_short || "Unknown"}`} />
      </Appbar.Header>

      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        automaticallyAdjustContentInsets
        automaticallyAdjustsScrollIndicatorInsets
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
      />
    </View>
  );
};

export default SuttaDetails;

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: Color.primaryBackgroundColor,
    marginBottom: 20,
  },
});
