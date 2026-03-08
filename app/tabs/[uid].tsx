import { Color } from "@/constants/color";
import useTab from "@/stores/useTab";
import { cssStyles } from "@/styles/css";
import { ReaderScreenProps } from "@/types";
import { loadSuttaContent, SuttaContent, SuttaSegment } from "@/utils/offlineQueries";
import { wp } from "@/utils/responsive";
import { useQuery } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system/legacy";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Appbar, Card, IconButton, Text } from "react-native-paper";
import { captureRef, releaseCapture } from "react-native-view-shot";
import WebView from "react-native-webview";

// Constants
const INJECTED_JAVASCRIPT = `
  (function() {
    document.querySelectorAll('.comment').forEach(element => {
      element.addEventListener('click', () => {
        const tooltipValue = element.getAttribute('data-tooltip');
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'commentClick', value: tooltipValue }));
      });
    });
  })();
  true;
`;

const Styles = StyleSheet.create({
  container: { flex: 1 },
  webview: {
    flex: 1,
    backgroundColor: Color.primaryBackgroundColor,
    marginBottom: 20,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabButton: {
    borderColor: Color.invertedTextColor,
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  flatList: {
    paddingHorizontal: wp(2),
    backgroundColor: Color.primaryBackgroundColor,
    flex: 1,
    gap: wp(2),
  },
  flatListContent: { rowGap: wp(2), paddingBottom: wp(4) },
});

const LoadingView = () => (
  <View style={Styles.centered}>
    <ActivityIndicator color={Color.primaryColor} size="large" />
  </View>
);

const ErrorView = ({ message }: { message: string }) => (
  <View style={Styles.centered}>
    <Text variant="bodyMedium">{message}</Text>
  </View>
);

const TabCard = ({
  item,
  onSelect,
  onClose,
  isLastTab,
}: {
  item: ReaderScreenProps;
  onSelect: (uid: string, author_uid: string) => void;
  onClose: (uid: string, author_uid: string) => void;
  isLastTab: boolean;
}) => (
  <Card onPress={() => onSelect(item.uid, item.author_uid)}>
    <Card.Title
      title={item.translated_name || item.title || "Unknown"}
      subtitle={item.author || item.author_short || "Unknown"}
      right={() => (
        <IconButton
          icon="close"
          iconColor={Color.invertedTextColor}
          onPress={() => {
            onClose(item.uid, item.author_uid);
            if (isLastTab) router.dismiss();
          }}
          size={20}
          accessibilityLabel="Close Tab"
        />
      )}
    />
    <Card.Cover source={{ uri: `file:///${item?.image}` }} resizeMode="cover" />
  </Card>
);

const TabSwitcher = ({
  items,
  onSelect,
  onClose,
}: {
  items: ReaderScreenProps[];
  onSelect: (uid: string, author_uid: string) => void;
  onClose: (uid: string, author_uid: string) => void;
}) => (
  <>
    <Appbar.Header
      statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
    >
      <Appbar.BackAction onPress={() => onSelect("", "")} />
      <Appbar.Content title="Tabs" />
    </Appbar.Header>
    <FlatList
      data={items}
      keyExtractor={(item) => item.uid + item.author_uid}
      showsVerticalScrollIndicator={false}
      style={Styles.flatList}
      contentContainerStyle={Styles.flatListContent}
      ListEmptyComponent={() => (
        <View>
          <Text style={{ color: Color.invertedTextColor }}>
            No tabs available
          </Text>
        </View>
      )}
      renderItem={({ item }) => (
        <TabCard
          item={item}
          onSelect={onSelect}
          onClose={onClose}
          isLastTab={items.length === 1}
        />
      )}
    />
  </>
);

const ContentHeader = ({
  selectedUid,
  items,
  onBack,
  onCapture,
  author_uid,
}: {
  selectedUid: string;
  items: ReaderScreenProps[];
  onBack: () => void;
  onCapture: () => void;
  author_uid: string;
}) => {
  const { getItem } = useTab();

  const item =
    // items.find((tab) => tab.uid === selectedUid) ||
    getItem(selectedUid, author_uid);

  return (
    <Appbar.Header
      statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
    >
      <Appbar.BackAction onPress={onBack} />
      <Appbar.Content
        title={`${item?.author || item?.author_short || "Unknown"}`}
      />
      <Pressable style={Styles.tabButton} onPress={onCapture}>
        <Text style={{ color: Color.invertedTextColor }}>{items.length}</Text>
      </Pressable>
    </Appbar.Header>
  );
};

const Tabs = () => {
  const { uid, show, author_uid } = useLocalSearchParams<{
    uid?: string;
    show?: string;
    author_uid?: string;
  }>();
  const { getItem, removeItem, items, updateImage } = useTab();

  // Initialize with valid item if available, otherwise use defaults
  const initialItem = items.find(
    (item) => item.uid === uid && item.author_uid === author_uid
  ) ||
    items[0] || { uid: "", author_uid: "" };
  const [selectedUid, setSelectedUid] = useState<string>(
    uid || initialItem.uid || ""
  );
  const [selectedAuthorUid, setSelectedAuthorUid] = useState<string>(
    author_uid || initialItem.author_uid || ""
  );

  const [showSwitcher, setShowSwitcher] = useState(show === "true");
  const viewShotRef = useRef<View>(null);

  // Safely get item data with fallback
  const item = getItem(selectedUid, selectedAuthorUid);
  const lang = item?.lang ?? "en";

  const { data, isLoading, error } = useQuery<SuttaContent, Error>({
    queryKey: ["suttaContent", selectedUid, selectedAuthorUid, lang],
    queryFn: () =>
      loadSuttaContent(selectedUid as string, selectedAuthorUid as string, lang as string),
    enabled: !!selectedUid && !!selectedAuthorUid,
  });

  const segments = data?.segments ?? [];

  const htmlContent = buildSegmentsHtml(segments);

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "commentClick") {
        router.push({ pathname: "/comment", params: { data: message.value } });
      }
    } catch (e) {
      console.error("Error parsing WebView message:", e);
    }
  };

  const handleCapture = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.2,
        fileName: `${uid}-${selectedAuthorUid}`,
      });

      if (!uri) {
        throw new Error("Failed to capture view");
      }

      const documentDir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
      if (!documentDir) {
        throw new Error("FileSystem directory unavailable");
      }

      const screenshotsDir = `${documentDir}screenshots`;
      const dirInfo = await FileSystem.getInfoAsync(screenshotsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(screenshotsDir, { intermediates: true });
      }

      const fileName = uri.split("/").pop();
      const destination = `${screenshotsDir}/${fileName}`;

      await FileSystem.copyAsync({ from: uri, to: destination });
      releaseCapture(uri);

      updateImage(selectedUid, selectedAuthorUid, destination);
      setShowSwitcher(true);
    } catch (error) {
      const err = error as Error;
      Alert.alert("", err?.message || "Failed to capture screenshot");
      console.error("Error capturing screenshot:", err);
    }
  };

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView message={error.message} />;

  return (
    <View style={Styles.container}>
      {showSwitcher ? (
        <TabSwitcher
          items={items}
          onSelect={(uid, author_uid) => {
            setShowSwitcher(false);
            if (uid && author_uid) {
              setSelectedUid(uid);
              setSelectedAuthorUid(author_uid);
            }
          }}
          onClose={removeItem}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <ContentHeader
            selectedUid={selectedUid}
            items={items}
            onBack={() => {
              handleCapture();
              router.back();
            }}
            author_uid={selectedAuthorUid || author_uid || ""}
            onCapture={handleCapture}
          />
          <View style={{ flex: 1 }} ref={viewShotRef} collapsable={false}>
            <WebView
              source={{ html: htmlContent }}
              style={Styles.webview}
              automaticallyAdjustContentInsets
              automaticallyAdjustsScrollIndicatorInsets
              injectedJavaScript={INJECTED_JAVASCRIPT}
              onMessage={handleMessage}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Tabs;

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
