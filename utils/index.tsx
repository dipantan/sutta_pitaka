import { Color } from "@/constants/color";
import parse from "html-react-parser";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

function convertToParagraph(
  jsonData: { [s: string]: unknown } | ArrayLike<unknown>
) {
  // Extract values from the JSON object, filter out empty strings, and join with spaces
  let text = Object.values(jsonData)
    .filter(
      (segment): segment is string =>
        typeof segment === "string" && Boolean(segment.trim())
    )
    .join(" "); // Remove empty or whitespace-only segments

  // Clean up punctuation and spacing
  text = text
    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
    .replace(/([.!?])\s*/g, "$1 ") // Ensure single space after sentence-ending punctuation
    .replace(/,\s*/g, ", ") // Ensure single space after commas
    .replace(/(["'])\s*/g, "$1") // Remove space after opening quotes
    .replace(/\s*(["'])/g, "$1") // Remove space before closing quotes
    .trim(); // Remove leading/trailing whitespace

  // Split into paragraphs based on thematic breaks or section endings
  const paragraphs = [];
  let currentParagraph = "";
  const sentences = text.split(/(?<=[.!?])\s+/); // Split by sentence-ending punctuation followed by space

  for (const sentence of sentences) {
    // Add sentence to current paragraph
    currentParagraph += sentence + " ";

    // Start a new paragraph if the sentence indicates a section break or significant shift
    if (
      sentence.includes("section is finished") ||
      sentence.includes("recitation section") ||
      sentence.includes("And those who genuinely praise the Realized One") ||
      sentence.includes("And what are the") ||
      sentence.includes("That is what the Buddha said") ||
      sentence.includes("It's incredible, sir, it's amazing")
    ) {
      paragraphs.push(currentParagraph.trim());
      currentParagraph = "";
    }
  }

  // Add any remaining text as the final paragraph
  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }

  // Join paragraphs with double newlines for readability
  return paragraphs.join("\n\n");
}

// for example if pass parameter as long->dn it will return
const NikayaMapper = (
  uid: "long" | "middle" | "linked" | "numbered" | "minor"
) => {
  const Nikaya = {
    long: "dn",
    middle: "mn",
    linked: "sn",
    numbered: "an",
    minor: "kn",
  };

  return Nikaya[uid];
};

const styles = StyleSheet.create({
  regularText: {
    color: Color.onPrimaryPrimaryTextColor,
    lineHeight: 24,
  },
  italicText: {
    color: Color.onPrimaryPrimaryTextColor,
    fontStyle: "italic",
    lineHeight: 24,
  },
  boldText: {
    color: Color.onPrimaryPrimaryTextColor,
    fontWeight: "bold",
    lineHeight: 24,
  },
  underlineText: {
    color: Color.onPrimaryPrimaryTextColor,
    textDecorationLine: "underline",
    lineHeight: 24,
  },
  emphasisText: {
    color: Color.onPrimaryPrimaryTextColor,
    fontStyle: "italic", // <em> typically renders as italic
    lineHeight: 24,
  },
});

const htmlToText = (htmlString: any) => {
  return parse(htmlString, {
    replace: (domNode) => {
      if (domNode.type === "text") {
        // Handle regular text nodes
        return <Text style={styles.regularText}>{domNode.data}</Text>;
      }
      if (
        domNode.name === "i" &&
        domNode.attribs?.lang === "pi" &&
        domNode.attribs?.translate === "no"
      ) {
        // Handle Pali terms in <i lang='pi' translate='no'>
        return (
          <Text style={styles.italicText}>
            {domNode.children
              .filter((child) => child.type === "text")
              .map((child, index) => (
                <Text key={index} style={styles.italicText}>
                  {child.data}
                </Text>
              ))}
          </Text>
        );
      }
      if (domNode.name === "i") {
        // Handle regular <i> tags
        return (
          <Text style={styles.italicText}>
            {domNode.children
              .filter((child) => child.type === "text")
              .map((child, index) => (
                <Text key={index} style={styles.italicText}>
                  {child.data}
                </Text>
              ))}
          </Text>
        );
      }
      if (domNode.name === "b" || domNode.name === "strong") {
        // Handle <b> and <strong> tags
        return (
          <Text style={styles.boldText}>
            {domNode.children
              .filter((child) => child.type === "text")
              .map((child, index) => (
                <Text key={index} style={styles.boldText}>
                  {child.data}
                </Text>
              ))}
          </Text>
        );
      }
      if (domNode.name === "u") {
        // Handle <u> tags
        return (
          <Text style={styles.underlineText}>
            {domNode.children
              .filter((child) => child.type === "text")
              .map((child, index) => (
                <Text key={index} style={styles.underlineText}>
                  {child.data}
                </Text>
              ))}
          </Text>
        );
      }
      if (domNode.name === "em") {
        // Handle <em> tags
        return (
          <Text style={styles.emphasisText}>
            {domNode.children
              .filter((child) => child.type === "text")
              .map((child, index) => (
                <Text key={index} style={styles.emphasisText}>
                  {child.data}
                </Text>
              ))}
          </Text>
        );
      }
      return null; // Let parser handle other nodes
    },
  });
};

export { convertToParagraph, htmlToText, NikayaMapper };
