import { Color } from "@/constants/color";
import { cssStyles } from "@/styles/css";
import { loadSuttaContent, SuttaSegment } from "@/utils/offlineQueries";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

 type ReaderBlock = {
   kind: "header" | "segment";
   segmentId: string;
   segmentNum: string;
   root?: string;
   translation?: string;
   comment?: string;
   headerLevel?: 1 | 2 | 3;
   isEvam?: boolean;
   isHomage?: boolean;
 };

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
  const [activeComment, setActiveComment] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["suttaContent", uid, author_uid, lang],
    queryFn: () => loadSuttaContent(uid as string, author_uid as string, lang as string),
    enabled: !!uid && !!author_uid && !!lang,
  });

  const segments = data?.segments ?? [];
  const readerTitle = data?.sutta?.translated_title || data?.sutta?.title || (uid as string) || "Sutta";
  const readerAuthor = author || author_short || data?.translation?.author || "Unknown";

  const htmlContent = useMemo(
    () =>
      data?.isLegacy
        ? buildLegacyHtml({
            uid: uid as string,
            title: readerTitle,
            authorName: readerAuthor,
            legacyHtml: data.legacyHtml || "",
          })
        : buildSegmentsHtml({
            uid: uid as string,
            title: readerTitle,
            authorName: readerAuthor,
            segments,
          }),
    [data?.isLegacy, data?.legacyHtml, readerAuthor, readerTitle, segments, uid]
  );

  const injectedJavaScript = `
    (function() {
      document.querySelectorAll('.comment-trigger').forEach(function(element) {
        element.addEventListener('click', function() {
          const tooltipValue = this.getAttribute('data-tooltip');
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'commentClick', value: tooltipValue }));
        });
      });
    })();
    true; // Required by WebView
  `;

  const onMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "commentClick") {
        setActiveComment(typeof message.value === "string" ? message.value : "");
      }
    } catch (e) {
      console.error("Error parsing WebView message:", e);
    }
  };

  const commentHtml = useMemo(
    () => buildCommentHtml(activeComment),
    [activeComment]
  );

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
        <Appbar.Content title={readerTitle} color={Color.onPrimaryPrimaryTextColor} />
      </Appbar.Header>

      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        automaticallyAdjustContentInsets
        automaticallyAdjustsScrollIndicatorInsets
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
      />

      <Modal
        visible={!!activeComment}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveComment(null)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setActiveComment(null)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <View style={styles.sheetHandle} />
            <Text variant="titleMedium" style={styles.sheetTitle}>
              Commentary
            </Text>
            <WebView
              source={{ html: commentHtml }}
              style={styles.commentWebview}
              scrollEnabled
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fffdf8",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 260,
    maxHeight: "72%",
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#d2c1aa",
    marginBottom: 10,
  },
  sheetTitle: {
    textAlign: "center",
    color: "#5e4526",
    marginBottom: 8,
  },
  commentWebview: {
    flex: 1,
    backgroundColor: "#fffdf8",
  },
});

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function segmentNumber(segmentId: string) {
  const parts = segmentId.split(":");
  return parts[1] || segmentId;
}

function stripHtml(value?: string) {
  return (value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function buildReaderBlocks(segments: SuttaSegment[]): ReaderBlock[] {
  return [...segments]
    .sort((a, b) => a.segment_id.localeCompare(b.segment_id, undefined, { numeric: true, sensitivity: "base" }))
    .map((segment) => {
      const segmentNum = segmentNumber(segment.segment_id);
      const parts = segmentNum.split(".");
      const translationText = segment.translation || "";
      const rootText = segment.root || "";
      const isIntro = segmentNum.startsWith("0.");
      const isSection = parts.length > 1 && parts[parts.length - 1] === "0";
      const isFirstContent = segmentNum === "1.0" || segmentNum === "1.1";
      const plainTranslation = stripHtml(translationText);
      const plainRoot = stripHtml(rootText);
      const isHomage =
        !isIntro &&
        isFirstContent &&
        (/^(homage to|salutation to)/i.test(plainTranslation) ||
          /^namo\s+tassa\s+bhagavato\s+arahato\s+sammāsambuddhassa/i.test(plainRoot));
      const isEvam =
        /^thus have i heard/i.test(plainTranslation) || /^evaṁ me sutaṁ/i.test(plainRoot);
      const isHeader = isIntro || isSection || isHomage;

      let headerLevel: 1 | 2 | 3 = 1;
      if (isHeader) {
        if (isIntro) headerLevel = 1;
        else if (isHomage) headerLevel = 2;
        else if (isSection) headerLevel = parts.length === 1 ? 1 : 2;
        else headerLevel = 1;
      }

      return {
        kind: (isHeader ? "header" : "segment") as ReaderBlock["kind"],
        segmentId: segment.segment_id,
        segmentNum,
        root: rootText || undefined,
        translation: translationText || undefined,
        comment: segment.comment || undefined,
        headerLevel,
        isEvam,
        isHomage,
      };
    })
    .filter((block) => block.root || block.translation);
}

function renderReaderBlock(block: ReaderBlock) {
  const lineNumber = `<span class="line-number">${escapeHtml(block.segmentNum)}</span>`;
  const commentMarker = block.comment
    ? `<sup class="comment-tooltip"><span class="comment-trigger" role="button" tabindex="0" data-tooltip="${escapeHtml(block.comment)}" aria-label="Open commentary">*</span></sup>`
    : "";

  if (block.kind === "header") {
    return `
      <section class="reader-header-block ${block.isHomage ? "namo" : ""}">
        ${block.root ? `<p class="reader-root header-level-${block.headerLevel}">${escapeHtml(block.root)}</p>` : ""}
        ${block.translation ? `<div class="reader-heading header-level-${block.headerLevel}">${block.translation}${commentMarker}</div>` : commentMarker}
      </section>
    `;
  }

  return `
    <section class="reader-segment ${block.isEvam ? "evam" : ""}">
      ${lineNumber}
      <div class="reader-segment-body">
        ${block.translation ? `<div class="reader-translation">${block.translation}${commentMarker}</div>` : commentMarker}
        ${block.root ? `<p class="reader-root">${escapeHtml(block.root)}</p>` : ""}
      </div>
    </section>
  `;
}

function buildSegmentsHtml({
  uid,
  title,
  authorName,
  segments,
}: {
  uid: string;
  title: string;
  authorName: string;
  segments: SuttaSegment[];
}) {
  const blocks = buildReaderBlocks(segments);
  const introBlocks = blocks.filter((block) => block.kind === "header" && ["0.1", "0.2", "0.3"].includes(block.segmentNum));
  const contentBlocks = blocks.filter((block) => !["0.1", "0.2", "0.3"].includes(block.segmentNum));

  const introHtml = introBlocks.map((block) => renderReaderBlock(block)).join("\n");
  const contentHtml = contentBlocks.map((block) => renderReaderBlock(block)).join("\n");

  return `
    <html>
      <head>
        ${cssStyles}
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html {
            width: 100%;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            background: #f6efe1;
          }

          *, *::before, *::after {
            box-sizing: border-box;
          }

          body {
            width: 100%;
            margin: 0;
            padding: 0;
            background: #f6efe1;
            color: #3b2f24;
            font-family: Georgia, 'Times New Roman', serif;
            overflow-x: hidden;
          }

          .reader-shell {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0 0 40px;
          }

          .reader-article {
            width: 100%;
            max-width: 100%;
            margin: 0;
            background: #fffdf8;
            border: none;
            border-radius: 0;
            padding: 24px 12px 40px;
            box-shadow: none;
            overflow-x: hidden;
          }

          .reader-meta {
            display: none;
          }

          .reader-header-block {
            text-align: center;
            margin-bottom: 20px;
          }

          .reader-heading,
          .reader-translation {
            color: #2f2317;
            line-height: 1.7;
            font-size: 21px;
          }

          .reader-heading.header-level-1 {
            font-size: 28px;
            font-weight: 700;
          }

          .reader-heading.header-level-2 {
            font-size: 23px;
            font-weight: 700;
          }

          .reader-heading.header-level-3 {
            font-size: 20px;
            font-weight: 700;
          }

          .reader-segment {
            display: grid;
            grid-template-columns: 56px minmax(0, 1fr);
            gap: 8px;
            align-items: start;
            margin-top: 16px;
          }

          .line-number {
            color: #a98a67;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.8;
            text-align: right;
            padding-top: 2px;
          }

          .reader-segment-body {
            min-width: 0;
          }

          .reader-root {
            color: #7a5b34;
            font-size: 16px;
            line-height: 1.7;
            margin: 8px 0 0;
          }

          .reader-root.header-level-1 {
            margin: 0 0 8px;
            font-size: 26px;
            font-weight: 600;
          }

          .reader-root.header-level-2 {
            margin: 0 0 8px;
            font-size: 22px;
            font-weight: 600;
          }

          .reader-root.header-level-3 {
            margin: 0 0 8px;
            font-size: 19px;
            font-weight: 600;
          }

          .evam .reader-translation {
            letter-spacing: 0.06em;
            font-variant: small-caps;
          }

          .comment-tooltip {
            margin-left: 2px;
          }

          .comment-trigger {
            display: inline;
            padding: 0 2px;
            background: transparent;
            color: #8b5e34;
            border: none;
            cursor: pointer;
            vertical-align: super;
            font-size: 18px;
            line-height: 1;
            font-weight: 700;
            overflow: visible;
            white-space: normal;
          }

          .comment-trigger:active {
            opacity: 0.7;
          }

          @media (max-width: 640px) {
            .reader-article {
              padding: 18px 8px 28px;
            }

            .reader-title {
              font-size: 28px;
            }

            .reader-segment {
              grid-template-columns: 42px minmax(0, 1fr);
            }

            .reader-heading,
            .reader-translation {
              font-size: 19px;
            }
          }
        </style>
      </head>
      <body>
        <main class="reader-shell" data-uid="${escapeHtml(uid)}">
          <article class="reader-article">
            ${introHtml}
            ${contentHtml || "<p>No text available.</p>"}
          </article>
        </main>
      </body>
    </html>
  `;
}

function cleanLegacyHtml(html: string) {
  return html.replace(/<a class=['"]ref[^>]*>.*?<\/a>/g, "");
}

function buildLegacyHtml({
  uid,
  title,
  authorName,
  legacyHtml,
}: {
  uid: string;
  title: string;
  authorName: string;
  legacyHtml: string;
}) {
  return `
    <html>
      <head>
        ${cssStyles}
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            width: 100%;
            margin: 0;
            padding: 0;
            background: #f6efe1;
            color: #3b2f24;
            overflow-x: hidden;
            font-family: Georgia, 'Times New Roman', serif;
          }

          *, *::before, *::after {
            box-sizing: border-box;
          }

          .legacy-shell {
            width: 100%;
            margin: 0;
            padding: 0 0 40px;
          }

          .legacy-article {
            width: 100%;
            margin: 0;
            background: #fffdf8;
            padding: 24px 12px 40px;
            overflow-x: auto;
          }

          .legacy-author {
            margin: 0 0 16px;
            color: #8b5e34;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          @media (max-width: 640px) {
            .legacy-article {
              padding: 18px 8px 28px;
            }
          }
        </style>
      </head>
      <body>
        <main class="legacy-shell" data-uid="${escapeHtml(uid)}" data-title="${escapeHtml(title)}">
          <article class="legacy-article">
            <div class="legacy-author">${escapeHtml(authorName)}</div>
            ${cleanLegacyHtml(legacyHtml) || "<p>No text available.</p>"}
          </article>
        </main>
      </body>
    </html>
  `;
}

function buildCommentHtml(comment: string | null) {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: #fffdf8;
            color: #3b2f24;
            font-family: Georgia, 'Times New Roman', serif;
          }

          body {
            padding: 12px 8px 24px;
            line-height: 1.7;
            font-size: 18px;
          }

          p {
            margin: 0 0 12px;
          }
        </style>
      </head>
      <body>
        ${comment || "<p>No commentary available.</p>"}
      </body>
    </html>
  `;
}
