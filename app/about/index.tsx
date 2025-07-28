import Mission from "@/components/Mission";
import { Color } from "@/constants/color";
import { hp, wp } from "@/utils/responsive";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Appbar, Card, Text } from "react-native-paper";

const About = () => {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Text variant="titleLarge">About</Text>
      </Appbar.Header>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 10,
          gap: wp(4),
          paddingBottom: wp(2),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignSelf: "center",
          }}
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
              marginTop: hp(4),
            }}
          >
            <Image
              source={require("@/assets/images/budhha.jpeg")}
              style={{
                width: wp(56),
                height: wp(40),
                borderRadius: wp(2),
              }}
            />
          </MotiView>

          <Image
            source={require("@/assets/images/bodhi.jpeg")}
            style={{
              position: "absolute",
              height: wp(14),
              width: wp(14),
              right: -14,
              top: hp(1),
              borderRadius: wp(7),
              opacity: 0.5,
              zIndex: +999,
            }}
          />
        </View>

        <Text
          variant="displaySmall"
          style={{ textAlign: "center", fontWeight: "600" }}
        >
          About Sutta Pitaka
        </Text>

        <Text variant="titleMedium" style={{ textAlign: "center" }}>
          A peaceful journey through the teachings of the Buddha, bringing
          ancient wisdom to the modern world.
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>
              <Feather
                name="heart"
                size={24}
                color={Color.primaryAlternateColor}
              />
              {"  "}
              Acknowledgments
            </Text>

            <Text style={styles.section}>SuttaCentral.net</Text>
            <Text style={styles.text}>
              Deep gratitude to SuttaCentral for providing their exceptional
              public API, making the Buddha&apos;s teachings accessible to
              developers and practitioners worldwide. Their dedication to
              preserving and sharing the Dhamma is truly inspiring.
            </Text>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => Linking.openURL("https://suttacentral.net/")}
            >
              <Text
                style={{
                  color: Color.primaryAlternateColor,
                  fontWeight: "700",
                }}
              >
                Visit SuttaCentral{" "}
              </Text>
              <EvilIcons
                name="external-link"
                size={24}
                color={Color.primaryAlternateColor}
              />
            </Pressable>

            <Text style={styles.section}>Developer</Text>
            <Text style={styles.text}>
              Created with mindfulness and dedication to sharing the
              Buddha&apos;s teachings through modern technology. May this
              application be of benefit to all beings seeking wisdom and peace.
            </Text>
            <Text style={styles.quote}>
              &quot;Just as a mother would protect her only child with her life,
              even so let one cultivate a boundless love towards all
              beings.&quot;
            </Text>
          </Card.Content>
        </Card>

        <Mission />
      </ScrollView>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: Color.onTertiarySecondaryTextColor,
    borderRadius: wp(4),
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Color.darkerFixedBackgroundColor,
  },
  section: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    color: "#666",
    marginVertical: 8,
    lineHeight: wp(6.5),
  },
  quote: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    lineHeight: wp(5),
  },
  button: {
    marginVertical: 8,
  },
});
