import { Color } from "@/constants/color";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text as RNPText } from "react-native-paper";

const SuttaText = ({ suttaData }: { suttaData: object }) => {

  // Function to determine text style based on the key structure
  const getTextStyle = (key: string) => {
    const parts = key.split(":")[1].split(".");
    const level = parts.length;

    // Main titles (e.g. "Long Discourses 1")
    if (level === 1) {
      return styles.mainTitle;
    }

    // Section headers (e.g. "1. Talk on Wanderers")
    if (level === 2) {
      return styles.sectionHeader;
    }

    // Sub-section headers (e.g. "2.1. The Shorter Section on Ethics")
    if (level === 3) {
      return styles.subSectionHeader;
    }

    // Verse numbers or special markers
    if (level >= 4 && parts[parts.length - 1] === "0") {
      return styles.sectionMarker;
    }

    // Regular text
    return styles.regularText;
  };

  // Function to determine if we need extra space before this element
  const needsSpaceBefore = (key: string) => {
    const parts = key.split(":")[1].split(".");
    const level = parts.length;

    // Add space before main sections and headers
    return level <= 3;
  };

  if (!suttaData)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <RNPText variant="bodyLarge">
          This sutta is not available in this language.
        </RNPText>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {Object.entries(suttaData).map(([key, value]) => {
          if (!value.trim()) return null;

          return (
            <View
              key={key}
              style={[
                styles.textContainer,
                needsSpaceBefore(key) && styles.spaceBefore,
              ]}
            >
              <RNPText style={getTextStyle(key)}>{value}</RNPText>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Color.primaryBackgroundColor,
  },
  content: {
    paddingBottom: 30,
  },
  textContainer: {
    marginBottom: 4,
  },
  spaceBefore: {
    marginTop: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff", // Dark brown
    textAlign: "center",
    marginVertical: 16,
    lineHeight: 28,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Medium brown
    marginBottom: 8,
    lineHeight: 24,
  },
  subSectionHeader: {
    fontSize: 16,
    fontWeight: "600", // Semi-bold
    color: "#fff",
    marginBottom: 6,
    lineHeight: 22,
  },
  sectionMarker: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 2,
    fontStyle: "italic",
  },
  regularText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 22,
    textAlign: "justify",
    marginBottom: 4,
  },
});

export default SuttaText;
