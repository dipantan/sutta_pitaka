import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import { Translation } from "@/types/suttaplex";
import { htmlToText } from "@/utils";
import { wp } from "@/utils/responsive";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Card, List, Text, useTheme } from "react-native-paper";

const MenuCard = ({
  mainHeader,
  description,
  headerSubtitle,
  headerTitle,
  leftText,
  onPress,
  yellowBrickRoadCount,
  yellowBrickRoad,
  child_range,
  translations,
  rightText,
  onAuthorPress,
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
        {headerTitle && (
          <Text
            variant="bodyLarge"
            style={[
              {
                color: Color.onPrimaryPrimaryTextColor,
                fontWeight: "700",
                textTransform: "capitalize",
                marginTop: 12,
              },
            ]}
            numberOfLines={2}
          >
            {headerTitle?.toUpperCase()}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            {leftText && (
              <Text
                style={[
                  {
                    color: Color.onPrimarySecondaryTextColor,
                    backgroundColor: Color.darkFixedBackgroundColor,
                    paddingHorizontal: 4,
                    borderRadius: 4,
                  },
                ]}
                variant="labelSmall"
              >
                {leftText?.toUpperCase()}
              </Text>
            )}

            {headerSubtitle && (
              <Text
                style={[{ color: Color.onPrimarySecondaryTextColor }]}
                variant="labelSmall"
              >
                {headerSubtitle?.toUpperCase()}
              </Text>
            )}

            {child_range && (
              <Text
                style={[{ color: Color.onPrimarySecondaryTextColor }]}
                variant="labelSmall"
              >
                {child_range}
              </Text>
            )}
          </View>

          {rightText && <Text style={styles.rightText}>{rightText}</Text>}
        </View>

        {description && (
          <Text
            style={[
              {
                color: Color.onPrimaryPrimaryTextColor,
                fontSize: wp(3.5),
              },
            ]}
            numberOfLines={isExpanded ? undefined : 2}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {htmlToText(description)}
          </Text>
        )}

        {translations && translations?.length > 0 && (
          <View>
            <List.Accordion
              title={`Translations in your chosen language (${
                translations.filter(
                  (item) => item.lang === currentLanguage?.iso_code
                ).length
              })`}
              titleStyle={{ color: colors.onError, fontSize: 14 }}
              expanded
            >
              <FlatList
                data={translations.filter(
                  (item) => item.lang === currentLanguage?.iso_code
                )}
                style={{
                  gap: 16,
                  // flexWrap: "wrap",
                }}
                renderItem={({ item }: { item: Translation }) => (
                  <Pressable onPress={() => onAuthorPress?.(item)}>
                    <List.Section
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        // flexWrap: "nowrap",
                        // flex: 1,
                      }}
                    >
                      <List.Icon
                        icon={({ color, size }) => (
                          <Entypo name="open-book" size={size} color={color} />
                        )}
                        color={colors.primary}
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <Text variant="titleMedium">{item.author}</Text>
                        <Text variant="titleSmall">{item.lang_name}</Text>

                        {item.segmented && (
                          <View style={styles.helperIndicatorContainer}>
                            <Text variant="labelSmall">aligned</Text>
                            <MaterialIcons
                              name="done"
                              size={wp(3)}
                              color={Color.primaryAccentColor}
                            />
                          </View>
                        )}

                        {item.has_comment && (
                          <View style={styles.helperIndicatorContainer}>
                            <Text variant="labelSmall">annotated</Text>
                            <MaterialIcons
                              name="done"
                              size={wp(3)}
                              color={Color.primaryAccentColor}
                            />
                          </View>
                        )}

                        {!item.has_comment && !item.segmented && (
                          <View style={styles.helperIndicatorContainer}>
                            <Text variant="labelSmall">legacy</Text>
                          </View>
                        )}
                      </View>
                    </List.Section>
                  </Pressable>
                )}
              />
            </List.Accordion>

            <List.Accordion
              title={`Translations in other languages (${
                translations.filter(
                  (item) => item.lang !== currentLanguage?.iso_code
                ).length
              })`}
              titleStyle={{ color: colors.onError, fontSize: 14 }}
            >
              <FlatList
                data={translations.filter(
                  (item) => item.lang !== currentLanguage?.iso_code
                )}
                style={{
                  gap: 16,
                }}
                renderItem={({ item }: { item: Translation }) => (
                  <Pressable onPress={() => onAuthorPress?.(item)}>
                    <List.Section
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: 8,
                      }}
                    >
                      <List.Icon
                        icon={({ color, size }) => (
                          <Entypo name="open-book" size={size} color={color} />
                        )}
                        color={colors.primary}
                      />

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <Text variant="titleMedium">{item.author}</Text>
                        <Text variant="labelMedium">{item.lang_name}</Text>

                        {item.segmented && (
                          <View style={styles.helperIndicatorContainer}>
                            <Text variant="labelSmall">aligned</Text>
                            <MaterialIcons
                              name="done"
                              size={wp(3)}
                              color={Color.primaryAccentColor}
                            />
                          </View>
                        )}

                        {item.has_comment && (
                          <View style={styles.helperIndicatorContainer}>
                            <Text variant="labelSmall">annotated</Text>
                            <MaterialIcons
                              name="done"
                              size={wp(3)}
                              color={Color.primaryAccentColor}
                            />
                          </View>
                        )}

                        {!item.has_comment && !item.segmented && (
                          <View style={styles.helperIndicatorContainer}>
                            <Text variant="labelSmall">legacy</Text>
                          </View>
                        )}
                      </View>
                    </List.Section>
                  </Pressable>
                )}
              />
            </List.Accordion>
          </View>
        )}

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
    gap: 8,
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
  helperIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderColor: Color.borderColor,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
