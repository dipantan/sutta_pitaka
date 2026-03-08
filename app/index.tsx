import { Color } from "@/constants/color";
import { loadPitakas } from "@/utils/offlineQueries";
import { hp, wp } from "@/utils/responsive";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Button, Card, Text } from "react-native-paper";

const App = () => {
  const { data: pitakas, isLoading, error } = useQuery({
    queryKey: ["pitakas"],
    queryFn: loadPitakas,
  });

  const headerMarginTop = (StatusBar.currentHeight ?? 0) + hp(2);

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      showsVerticalScrollIndicator={false}
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
          marginTop: wp(4),
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
          Sutta Pitaka
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

        <Button
          buttonColor={Color.primaryColor}
          textColor={Color.invertedTextColor}
          style={{
            marginVertical: wp(4),
            width: wp(40),
            borderRadius: wp(2),
          }}
          onPress={() => {
            if (pitakas && pitakas.length) {
              router.push({ pathname: "/suttaMenu", params: { pitaka: pitakas[0].pitaka } });
            }
          }}
          disabled={!pitakas?.length}
        >
          Explore Suttas
        </Button>

        <Link href={"/about"} asChild>
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
        </Link>

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
            pitakas?.map((item) => (
              <Card
                key={item.uid}
                style={styles.pitakaCard}
                contentStyle={styles.pitakaCardContent}
                onPress={() =>
                  router.push({
                    pathname: "/suttaMenu",
                    params: { pitaka: item.pitaka },
                  })
                }
              >
                <Avatar.Icon
                  size={wp(10)}
                  style={styles.pitakaIcon}
                  icon={() => (
                    <MaterialCommunityIcons
                      name="library"
                      size={wp(5)}
                      color={Color.invertedTextColor}
                    />
                  )}
                />
                <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                  {item.translated_name || item.root_name}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ textAlign: "center" }}
                  numberOfLines={3}
                >
                  {item.blurb || "Tap to explore this collection offline."}
                </Text>
                {item.yellow_brick_road_count ? (
                  <Text variant="labelSmall" style={{ color: Color.iconColor }}>
                    {item.yellow_brick_road_count} curated discourses
                  </Text>
                ) : null}
              </Card>
            ))
          )}

          {/* mindful design */}
          <Card
            style={{
              backgroundColor: Color.secondaryBackgroundColor,
              width: wp(90),
            }}
            contentStyle={{
              padding: 8,
              alignItems: "center",
              gap: wp(3),
              paddingVertical: wp(3),
            }}
          >
            <Avatar.Icon
              size={wp(10)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Color.secondaryAccentColor,
              }}
              icon={() => (
                <Octicons
                  name="heart"
                  size={wp(5)}
                  color={Color.invertedTextColor}
                />
              )}
            />
            <Text variant="bodyLarge" style={{ fontWeight: "700" }}>
              Mindful Design
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: "center" }}>
              Crafted with intention to support peaceful reading and
              contemplation.
            </Text>
          </Card>

          {/* open source */}
          <Card
            style={{
              backgroundColor: Color.secondaryBackgroundColor,
              width: wp(90),
            }}
            contentStyle={{
              padding: 8,
              alignItems: "center",
              gap: wp(3),
              paddingVertical: wp(3),
            }}
          >
            <Avatar.Icon
              size={wp(10)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Color.primaryAccentColor,
              }}
              icon={() => (
                <MaterialCommunityIcons
                  name="open-source-initiative"
                  size={wp(7)}
                  color={Color.invertedTextColor}
                />
              )}
            />
            <Text variant="bodyLarge" style={{ fontWeight: "700" }}>
              Open Source
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: "center" }}>
              Built with gratitude upon the generous API provided by
              SuttaCentral.net.
            </Text>
          </Card>
        </View>
      </View>
    </ScrollView>
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
