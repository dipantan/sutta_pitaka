import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import { TMenuCard } from "@/types";
import { Translation } from "@/types/suttaplex";
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
  yellowBrickRoadCount,
  yellowBrickRoad,
  child_range,
  translations,
  rightText,
  onPress,
  onAuthorPress,
  onLongPress,
}: TMenuCard) => {
  const { colors, dark } = useTheme();
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionText = description
    ? String(description)
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";
  const descriptionColor = dark ? colors.onSurface : "#201b13";
  const cardBorderColor = dark ? colors.outlineVariant : "rgba(125, 95, 45, 0.08)";

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.surface, borderColor: cardBorderColor }]}
      onPress={onPress}
    >
      <Card.Content style={[styles.content, yellowBrickRoad ? styles.contentWithTopBadge : null]}>
        {headerTitle && (
          <Text
            variant="titleLarge"
            style={[
              styles.headerTitle,
              {
                color: colors.onSurface,
              },
            ]}
            numberOfLines={2}
          >
            {headerTitle}
          </Text>
        )}

        <View style={styles.metaRow}>
          <View
            style={styles.metaLeft}
          >
            {leftText && (
              <View
                style={[
                  styles.languageChip,
                  {
                    backgroundColor: Color.darkFixedBackgroundColor,
                  },
                ]}
              >
                <RNText
                  numberOfLines={1}
                  style={{
                    color: Color.onPrimarySecondaryTextColor,
                    fontSize: 10,
                    lineHeight: 12,
                    fontWeight: "700",
                    letterSpacing: 0.4,
                    includeFontPadding: false,
                    textAlignVertical: "center",
                  }}
                >
                  {leftText?.toUpperCase()}
                </RNText>
              </View>
            )}

            {headerSubtitle && (
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: colors.onSurfaceVariant },
                ]}
                variant="titleSmall"
              >
                {headerSubtitle}
              </Text>
            )}

            {child_range && (
              <Text
                style={[
                  styles.childRange,
                  { color: colors.onSurfaceVariant },
                ]}
                variant="titleSmall"
              >
                {child_range}
              </Text>
            )}
          </View>

          {rightText && (
            <View style={[styles.metaBadge, { backgroundColor: colors.primaryContainer }]}> 
              <Text style={[styles.rightText, { color: colors.onPrimaryContainer }]}>
                {rightText}
              </Text>
            </View>
          )}
        </View>

        {descriptionText ? (
          <Pressable
            style={styles.descriptionContainer}
            onPress={() => setIsExpanded((value) => !value)}
          >
            <View style={styles.descriptionHeaderRow}>
              <Text
                style={[styles.descriptionHint, { color: colors.onSurfaceVariant }]}
                variant="labelSmall"
              >
                {isExpanded ? "Show less" : "Show more"}
              </Text>
              <Entypo
                name={isExpanded ? "chevron-small-up" : "chevron-small-down"}
                size={18}
                color={colors.onSurfaceVariant}
              />
            </View>
            <Text
              style={[
                styles.description,
                {
                  color: descriptionColor,
                },
              ]}
              numberOfLines={isExpanded ? undefined : 3}
            >
              {descriptionText}
            </Text>
          </Pressable>
        ) : null}

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
                }}
                renderItem={({ item }: { item: Translation }) => (
                  <Pressable
                    onPress={() => onAuthorPress?.(item)}
                    onLongPress={() => onLongPress?.(item)}
                  >
                    <List.Section
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
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
                  <Pressable
                    onPress={() => onAuthorPress?.(item)}
                    onLongPress={() => onLongPress?.(item)}
                  >
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
            style={[
              styles.topRightBadge,
              { backgroundColor: colors.primaryContainer },
            ]}
          >
            <Text variant="labelSmall" style={{ color: colors.onPrimaryContainer, fontWeight: "700" }}>
              {yellowBrickRoadCount}{" "}
              {currentLanguage?.name || currentLanguage?.iso_code}
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
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 2,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  contentWithTopBadge: {
    paddingTop: 20,
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: wp(4),
    lineHeight: 24,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    paddingRight: 56,
  },
  metaLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    flexWrap: "wrap",
    gap: 8,
  },
  languageChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerSubtitle: {
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  childRange: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.9,
  },
  rightText: {
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 0,
  },
  metaBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  descriptionContainer: {
    gap: 4,
  },
  descriptionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
  },
  descriptionHint: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  description: {
    fontSize: wp(3.6),
    lineHeight: 24,
    // marginTop: 2,
  },
  topRightBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 74,
    alignItems: "center",
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
