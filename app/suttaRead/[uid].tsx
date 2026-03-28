import { Color } from "@/constants/color";
import { cssStyles } from "@/styles/css";
import { loadSuttaContent, SuttaSegment } from "@/utils/offlineQueries";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const SuttaReader = () => {
  const { author_uid, lang, uid, author, author_short } =
    useLocalSearchParams<{
      author_uid?: string;
      lang?: string;
      uid?: string;
      author?: string;
      author_short?: string;
    }>();

  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = useQuery({
    queryKey: ["suttaContent", uid, author_uid, lang],
    queryFn: () => loadSuttaContent(uid as string, author_uid as string, lang as string),
    enabled: !!uid && !!author_uid && !!lang,
  });

  const segments = data?.segments ?? [];

  const htmlContent = useMemo(() => buildSegmentsHtml(segments), [segments]);

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

  return (
    <View style={{ flex: 1, backgroundColor: Color.primaryBackgroundColor }}>
      <Appbar.Header statusBarHeight={insets.top} style={{ backgroundColor: Color.primaryColorLight }}>
        <Appbar.BackAction onPress={() => router.back()} color={Color.onPrimaryPrimaryTextColor} />
        <Appbar.Content title={`${author || author_short || data?.translation?.author || "Unknown"}`} color={Color.onPrimaryPrimaryTextColor} />
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

export default SuttaReader;

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: Color.primaryBackgroundColor,
    marginBottom: 20,
  },
});

function buildSegmentsHtml(segments: SuttaSegment[]) {
  const body = segments
    .map(
      (segment) => `
        <div class="segment">
          ${segment.root ? `<div class="root">${segment.root}</div>` : ""}
          <div class="translation">${segment.translation}</div>
        </div>
      `
    )
    .join("\n");

  return `
    <html>
      <head>
        ${cssStyles}
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="color: #fff; margin: 16">
        ${body || "<p>No text available.</p>"}
      </body>
    </html>
  `;
}
