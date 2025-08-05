import { Color } from "@/constants/color";
import { hp, wp } from "@/utils/responsive";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Button, Card, Text } from "react-native-paper";

const App = () => {
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
          marginTop: StatusBar.currentHeight + hp(2),
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

        <Link href={"/suttaMenu"} asChild>
          <Button
            buttonColor={Color.primaryColor}
            textColor={Color.invertedTextColor}
            style={{
              marginVertical: wp(4),
              width: wp(40),
              borderRadius: wp(2),
            }}
          >
            Explore Suttas
          </Button>
        </Link>

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

        <View
          style={{
            marginVertical: wp(5),
            gap: wp(4),
          }}
        >
          {/* sacred text */}
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
              }}
              icon={() => (
                <Octicons
                  name="book"
                  size={wp(5)}
                  color={Color.invertedTextColor}
                />
              )}
            />
            <Text variant="bodyLarge" style={{ fontWeight: "700" }}>
              Sacred Texts
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: "center" }}>
              Access the complete collection of Buddha&apos;s teachings with
              modern search and organization.
            </Text>
          </Card>

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

const styles = StyleSheet.create({});
