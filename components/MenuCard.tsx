import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

const MenuCard = ({
  description,
  headerSubtitle,
  headerTitle,
  leftText,
  onPress,
  yellowBrickRoadCount,
  yellowBrickRoad,
}: TMenuCard) => {
  const { colors } = useTheme();
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={onPress}
    >
      <Card.Content style={styles.content}>
        <Text
          variant="bodyLarge"
          style={[
            {
              color: Color.onPrimaryPrimaryTextColor,
              fontWeight: "700",
              textTransform: "capitalize",
            },
          ]}
        >
          {headerTitle?.toUpperCase()}
        </Text>

        <Text
          style={[{ color: Color.onPrimarySecondaryTextColor }]}
          variant="labelSmall"
        >
          {leftText?.toUpperCase()} {headerSubtitle?.toUpperCase()}
        </Text>

        {/* <ExpandableText
          description={description ?? ""}
          color={Color.onPrimaryPrimaryTextColor}
        /> */}

        <Text
          style={[{ color: Color.onPrimaryPrimaryTextColor }]}
          numberOfLines={isExpanded ? undefined : 2}
          variant="bodyMedium"
          onPress={() => setIsExpanded(!isExpanded)}
        >
          {description}
        </Text>

        {yellowBrickRoad && (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              borderTopRightRadius: 16,
              borderBottomLeftRadius: 8,
              backgroundColor: colors.primaryContainer,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text variant="labelSmall">
              {yellowBrickRoadCount} {currentLanguage?.name}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default MenuCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  rightButton: {
    backgroundColor: Color.primaryColorLight, // Yellow background for "39 English"
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rightText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
