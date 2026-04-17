import { Color } from "@/constants/color";
import { loadPitakas } from "@/utils/offlineQueries";
import { hp, wp } from "@/utils/responsive";
import { Octicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

const App = () => {
  const { colors } = useTheme();
  const {
    data: pitakas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pitakas", "v2"],
    queryFn: loadPitakas,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
  });

  const headerMarginTop = (StatusBar.currentHeight ?? 0) + hp(2);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Color.primaryBackgroundColor,
      }}
      // showsVerticalScrollIndicator={false}
    >
      <MotiView
        animate={{
          translateY: [
            { value: -5, type: "timing", delay: 100 },
            { value: 5, type: "timing", delay: 100 },
          ],
        }}
        transition={{
          loop: true,
          type: "spring",
          duration: 5000,
        }}
        style={{
          alignItems: "center",
          marginTop: headerMarginTop,
        }}
      >
        <Octicons
          name="book"
          size={wp(16)}
          color={Color.primaryAlternateColor}
        />
      </MotiView>

      <View
        style={{
          // marginTop: wp(4),
          alignItems: "center",
        }}
      >
        <Text
          variant="displaySmall"
          style={{
            fontWeight: "bold",
          }}
        >
          Welcome to
        </Text>

        <Text
          variant="displaySmall"
          style={{
            color: Color.primaryAlternateColor,
            fontWeight: "bold",
          }}
        >
          Tripitaka
        </Text>

        <Text
          variant="labelLarge"
          style={{
            marginTop: wp(4),
            textAlign: "center",
            color: Color.iconColor,
          }}
        >
          Discover the profound teachings of the Buddha through an accessible,
          modern interface. Explore ancient wisdom for contemporary life.
        </Text>

        {/* <Button
          buttonColor={Color.primaryColor}
          textColor={Color.invertedTextColor}
          style={{
            marginVertical: wp(4),
            width: wp(40),
            borderRadius: wp(2),
          }}
          onPress={() => {
            if (pitakas && pitakas.length) {
              const targetUid = pitakas[0].uid || pitakas[0].pitaka;
              router.push({ pathname: "/menu/[uid]", params: { uid: targetUid } });
            }
          }}
          disabled={!pitakas?.length}
        >
          Explore Suttas
        </Button> */}

        <View style={styles.sectionContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Color.primaryColor} />
              <Text style={{ marginTop: 12 }}>Loading collections…</Text>
            </View>
          ) : error ? (
            <View style={styles.loadingContainer}>
              <Text style={{ color: Color.primaryColor }}>
                {(error as Error).message || "Unable to load pitakas"}
              </Text>
            </View>
          ) : (
            (pitakas || [])
              .filter((p) =>
                ["sutta", "vinaya", "abhidhamma"].includes(p.pitaka),
              )
              .map((item) => (
                <Card
                  key={item.uid}
                  style={[
                    styles.pitakaCard,
                    { backgroundColor: colors.elevation.level2 },
                  ]}
                  contentStyle={styles.pitakaCardContent}
                  onPress={() => {
                    const targetUid = item.uid || item.pitaka;
                    router.push({
                      pathname: "/menu/[uid]",
                      params: { uid: targetUid },
                    });
                  }}
                >
                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "700", color: colors.onSurface }}
                  >
                    {item.translated_name || item.root_name}
                  </Text>
                  <Text
                    variant="labelSmall"
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: colors.onSurfaceVariant,
                    }}
                  >
                    {item.pitaka === "sutta"
                      ? "SUTTAPIṬAKA"
                      : item.pitaka === "vinaya"
                        ? "VINAYAPIṬAKA"
                        : item.pitaka === "abhidhamma"
                          ? "ABHIDHAMMAPIṬAKA"
                          : ""}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ textAlign: "center", color: colors.onSurface }}
                  >
                    {item.blurb || "Tap to explore this collection offline."}
                  </Text>
                  {item.yellow_brick_road_count ? (
                    <Text
                      variant="labelSmall"
                      style={{ color: colors.onSurfaceVariant }}
                    >
                      {item.yellow_brick_road_count} curated discourses
                    </Text>
                  ) : null}
                </Card>
              ))
          )}
        </View>

        {/* <Link href={"/about"} asChild>
          <Button
            icon={"heart-outline"}
            style={{
              width: wp(40),
              borderRadius: wp(2),
              alignItems: "center",
            }}
            buttonColor={Color.invertedTextColor}
            theme={{
              colors: {
                // primary: Color.,
              },
            }}
          >
            <Text
              style={{
                color: Color.primaryBackgroundColor,
              }}
            >
              About & Credits
            </Text>
          </Button>
        </Link> */}
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: wp(5),
    gap: wp(4),
  },
  loadingContainer: {
    width: wp(90),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: wp(6),
  },
  pitakaCard: {
    backgroundColor: Color.secondaryBackgroundColor,
    width: wp(90),
  },
  pitakaCardContent: {
    padding: 8,
    alignItems: "center",
    gap: wp(3),
    paddingVertical: wp(3),
  },
  pitakaIcon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.primaryAccentColor,
  },
  errorText: {
    color: Color.primaryColor,
  },
});
