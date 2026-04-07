import CommonAppBar from "@/components/CommonAppBar";
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import { loadMenuChildrenDetails, loadMenuNode, MenuChildDetail } from "@/utils/offlineQueries";
import { Entypo } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function dedupeChildren(children: MenuChildDetail[]) {
  const seen = new Set<string>();

  return children.filter((item) => {
    if (seen.has(item.uid)) {
      return false;
    }

    seen.add(item.uid);
    return true;
  });
}

export default function MenuScreen() {
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const { bottom } = useSafeAreaInsets();
  const [isBlurbExpanded, setIsBlurbExpanded] = useState(false);

  const { data: node, isLoading: nodeLoading, error: nodeError } = useQuery({
    queryKey: ["menu-node", uid],
    queryFn: () => loadMenuNode(uid as string),
    enabled: !!uid,
  });

  const {
    data: children,
    isLoading: childrenLoading,
    error: childrenError,
  } = useQuery<MenuChildDetail[]>({
    queryKey: ["menu-children", uid],
    queryFn: () => loadMenuChildrenDetails(uid as string),
    enabled: !!uid,
  });

  const isLoading = nodeLoading || childrenLoading;
  const displayChildren = useMemo(
    () => dedupeChildren(children ?? []),
    [children]
  );

  const getHeaderSubtitle = (item: MenuChildDetail) => {
    if (item.root_name && item.root_name !== item.translated_name && item.root_name !== item.child_range) {
      return item.root_name;
    }

    if (item.acronym && item.acronym !== item.child_range) {
      return item.acronym;
    }

    return undefined;
  };

  const getChildRange = (item: MenuChildDetail) => {
    if (item.child_range) {
      return item.child_range;
    }

    if (item.acronym && item.acronym !== item.root_name) {
      return item.acronym;
    }

    return undefined;
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Color.primaryColor} />
      </View>
    );
  }

  if (nodeError || childrenError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 }}>
        <Text>
          {((childrenError as Error | undefined)?.message ||
            (nodeError as Error | undefined)?.message ||
            "Failed to load menu")}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Color.primaryBackgroundColor, paddingBottom: bottom + 4 }}>
      <CommonAppBar
        title={node?.root_name || node?.translated_name || (uid as string) || "Menu"}
        onBack={() => router.back()}
        onSearch={() => router.push("/search")}
      />

      <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: Color.primaryBackgroundColor }}>
        <FlatList
          data={displayChildren}
          keyExtractor={(item, index) => `${item.uid}-${index}`}
          ListHeaderComponent={
            node?.blurb ? (
              <Pressable
                onPress={() => setIsBlurbExpanded((value) => !value)}
                style={{ marginVertical: 8, paddingHorizontal: 8, gap: 4 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Text
                    variant="labelSmall"
                    style={{
                      color: Color.onPrimarySecondaryTextColor,
                      fontWeight: "600",
                      letterSpacing: 0.4,
                    }}
                  >
                    {isBlurbExpanded ? "SHOW LESS" : "SHOW MORE"}
                  </Text>
                  <Entypo
                    name={isBlurbExpanded ? "chevron-small-up" : "chevron-small-down"}
                    size={18}
                    color={Color.onPrimarySecondaryTextColor}
                  />
                </View>

                <Text
                  variant="titleMedium"
                  numberOfLines={isBlurbExpanded ? undefined : 2}
                  style={{ color: Color.onPrimaryPrimaryTextColor }}
                >
                  {node?.blurb}
                </Text>
              </Pressable>
            ) : null
          }
          renderItem={({ item }) => (
            <MenuCard
              description={item.blurb ?? item.sutta?.blurb ?? undefined}
              headerTitle={
                item.node_type === "branch"
                  ? item.translated_name || item.root_name || undefined
                  : item.sutta?.translated_title || item.translated_name || item.root_name || undefined
              }
              isExpanded={false}
              headerSubtitle={getHeaderSubtitle(item)}
              leftText={item.root_lang_iso ?? undefined}
              child_range={getChildRange(item)}
              uid={item.uid}
              yellowBrickRoad={item.yellow_brick_road ? true : undefined}
              yellowBrickRoadCount={item.yellow_brick_road_count ?? undefined}
              onPress={() => {
                if (item.node_type === "branch") {
                  router.push({ pathname: "/menu/[uid]", params: { uid: item.uid } });
                } else {
                  router.push({ pathname: "/sutta/[uid]", params: { uid: item.uid } });
                }
              }}
            />
          )}
          ListEmptyComponent={
            <View style={{ paddingHorizontal: 8, paddingTop: 12 }}>
              <Text>No items found for this collection.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
          }}
        />
      </View>
    </View>
  );
}
