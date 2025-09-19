import { Color } from "@/constants/color";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const filterSections = [
  {
    title: "PTS volume and page search",
    description: "Find texts using PTS volume and page references.",
    examples: ["volpage:SN ii 4", "volpage:M II 246", "volpage:S.II,236"],
  },
  {
    title: "PTS volume search",
    description: "Find texts using just the PTS volume.",
    examples: ["volpage:SN ii", "volpage:M II"],
  },
  {
    title: "Reference search",
    description: "Find texts using the reference number.",
    examples: ["ref:PTS 1.1", "ref:sya13.544", "ref:vri13.346"],
  },
  {
    title: "author search",
    description: "Filter results by author.",
    examples: [
      "by:sujato cat",
      "by:sabbamitta Katze",
      "by:sujato kassapa OR moggallana",
      "by:sujato Buddha AND Sāvatthī",
    ],
  },
  {
    title: "",
    description: "List all authors.",
    examples: ["list authors"],
  },
  {
    title: "title search",
    description: "Search only in the title.",
    examples: ["title:intention"],
  },
  {
    title: "collection search",
    description: "Search in a specific collection with SuttaCentral IDs.",
    examples: [
      "in:dn cat",
      "in:an4 dog",
      "in:sutta moat",
      "in:abhidhamma feelings",
      "in:kn flame",
      "in:an kassapa OR moggallana",
    ],
  },
  {
    title: "ebt search",
    description:
      "Narrow search to “Early Buddhist Texts” (ebt). This is a shortcut and not a definitive list of what is early. Searches within listed collections.",
    examples: ["in:ebt elephant"],
  },
  {
    title: "ebs search",
    description:
      "Narrow search to “Early Buddhist Suttas” (ebs). Shortcut for listed collections.",
    examples: ["in:ebs lion"],
  },
  {
    title: "ebct search",
    description:
      "Narrow search to “Early Buddhist Chinese Texts” (ebct). Shortcut for listed collections.",
    examples: ["in:ebct 四念处"],
  },
  {
    title: "operators",
    description: "Use AND, OR, NOT for advanced searches.",
    examples: [
      "greed OR desire",
      "greed OR desire NOT anicca",
      "greed AND desire",
      "greed AND desire NOT anicca",
    ],
  },
  {
    title: "combine filters",
    description: "Use multiple filters.",
    examples: [
      "in:mn by:sujato Buddha OR Monastery",
      "in:mn by:sujato Buddha AND Monastery",
    ],
  },
  {
    title: "chinese",
    description:
      "Use space-separated keywords, or convert simplified/traditional.",
    examples: [
      "八正道 涅槃",
      "四神足 三摩地",
      "八正道 AND 涅槃",
      "发勤 ，观心生灭",
      "發勤 ，觀心生滅",
    ],
  },
];

export default function FilterHelpCard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View
          style={{
            borderWidth: 1,
            paddingHorizontal: 4,
            borderColor: Color.borderColor,
          }}
        >
          {/* <View style={styles.header}>
            <Text style={styles.headerText}>
              REFINE YOUR SEARCH WITH FILTERS
            </Text>
          </View> */}
          <Text style={styles.tip}>
            Filters must always appear first in a search before keywords. Pāli
            diacritics are ignored in search terms.
          </Text>
          {filterSections.map((section, idx) => (
            <View key={section.title + idx} style={styles.section}>
              {!!section.title && (
                <Text style={styles.sectionTitle}>{section.title}</Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.sectionDesc}>{section.description}</Text>
                <View style={styles.exampleBox}>
                  {section.examples.map((example) => (
                    <Text key={example} style={styles.exampleText}>
                      {example}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: Color.darkFixedBackgroundColor,
  },
  header: {
    backgroundColor: "#bebebe",
    paddingVertical: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 8,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#333",
    fontSize: 14,
    letterSpacing: 1,
  },
  tip: {
    marginBottom: 16,
    color: Color.invertedTextColor,
    marginHorizontal: 4,
    lineHeight: 21,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "600",
    color: Color.invertedTextColor,
    marginBottom: 3,
    backgroundColor: Color.tertiaryBackgroundColor,
    padding: 8,
  },
  sectionDesc: {
    color: Color.invertedTextColor,
    fontSize: 13,
    width: "50%",
  },
  exampleBox: {
    marginTop: 4,
    marginLeft: 8,
    width: "50%",
  },
  exampleText: {
    color: Color.invertedTextColor,
    fontSize: 13,
    fontFamily: "Courier",
  },
});
