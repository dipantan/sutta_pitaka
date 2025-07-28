import { wp } from "@/utils/responsive";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

const Mission = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/lotus.jpg")} // Replace with your image URL
        style={styles.backgroundImage}
        imageStyle={{
          borderRadius: wp(4),
          opacity: 0.9,
        }}
      >
        <Text
          style={[
            styles.quoteText,
            {
              marginTop: wp(16),
              marginHorizontal: wp(4),
              textAlign: "left",
            },
          ]}
        >
          "Three things cannot be long hidden: the sun, the moon, and the
          truth."
        </Text>
        <Text
          style={[
            styles.author,
            {
              alignSelf: "flex-start",
              marginHorizontal: wp(4),
              textAlign: "left",
            },
          ]}
        >
          - Buddha
        </Text>
      </ImageBackground>

      <Card style={styles.missionCard}>
        <Card.Content>
          <Text
            style={[
              styles.missionTitle,
              {
                textAlign: "left",
              },
            ]}
          >
            Our Mission
          </Text>
          <Text
            style={[
              styles.missionText,
              {
                textAlign: "left",
              },
            ]}
          >
            To make the profound teachings of the Buddha accessible, searchable,
            and meaningful for practitioners in the digital age. Through
            technology and mindfulness, we bridge ancient wisdom with
            contemporary life.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.quoteCard}>
        <Card.Content>
          <Text style={styles.quoteText}>
            "Thousands of candles can be lighted from a single candle, and the
            life of the candle will not be shortened. Happiness never decreases
            by being shared."
          </Text>
          <Text style={styles.author}>- Buddha</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: wp(4),
    // backgroundColor: '#e0f2f7',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  quoteCard: {
    backgroundColor: "#d9e6f2",
    borderRadius: wp(4),
  },
  quoteText: {
    fontSize: 18,
    textAlign: "center",
    color: "#000",
    fontStyle: "italic",
  },
  author: {
    fontSize: 14,
    textAlign: "right",
    color: "#666",
    marginTop: 8,
  },
  missionCard: {
    backgroundColor: "#f5a623",
    borderRadius: wp(4),
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  missionText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});

export default Mission;
