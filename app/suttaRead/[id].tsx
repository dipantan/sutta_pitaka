import { BillaraSuttaByAuthor, SuttaByAuthor } from "@/api/endpoints";
import instance from "@/api/instance";
import { Color } from "@/constants/color";
import { cssStyles } from "@/styles/css";
import { BillaraSuttaType } from "@/types/bilarasutta";
import { LegacySutta } from "@/types/legacySutta";
import { Translation } from "@/types/suttaplex";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { IData } from "../vaggaList/[uid]";

const fetchTranslation = async (
  uid: string,
  author_uid: string,
  currentLanguage: string,
  segmented: boolean
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

interface Props extends Translation, IData {
  uid: string;
  segmented?: string;
  extraData?: string;
}

const SuttaDetails = () => {
  const { segmented, author_uid, lang, uid, author, author_short, title } =
    useLocalSearchParams<Props>();
  const { top } = useSafeAreaInsets();

  const [showComment, setShowComment] = useState({
    state: false,
    data: "",
  });

  const openComment = (value: string) =>
    setShowComment({
      state: true,
      data: value,
    });

  const closeComment = () =>
    setShowComment({
      state: false,
      data: "",
    });

  const isSegmented = segmented === "true";

  const { data, isLoading, error } = useQuery({
    queryKey: ["suttaRead", uid, author_uid, lang],
    queryFn: () => fetchTranslation(uid, author_uid, lang, isSegmented),
    enabled: !!uid && !!author_uid && !!lang,
    refetchOnMount: "always",
  });

  function convertToHtml(data: BillaraSuttaType): string {
    if (!data?.keys_order) return "No content available";

    let html = "";
    for (const key of data.keys_order) {
      const template = data.html_text?.[key] || "";
      const translation = data?.translation_text?.[key] || "";
      const root = data.root_text?.[key] || "";
      const comment = data?.comment_text?.[key] || null;

      if (template.includes("{}")) {
        html +=
          `<span class='segment' id='${key}'>` +
          template.replace("{}", `<span class="root">${root}</span>`) +
          template.replace(
            "{}",
            `<span class="translation"><span class="text">${translation}</span>${
              comment
                ? `<span class="comment" data-tooltip="${comment}">${comment}</span>`
                : ""
            }</span>`
          ) +
          "</span>";
      } else {
        html += template;
      }
    }
    return html || "No content available";
  }

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
        <Appbar.Content
          title={
            title
              ? `${title} - ${author || author_short || "Unknown"}`
              : `${author || author_short || "Unknown"}`
          }
        />
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
