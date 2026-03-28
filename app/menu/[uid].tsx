import CommonAppBar from "@/components/CommonAppBar";
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import { loadMenuChildrenDetails, loadMenuNode, MenuChildDetail } from "@/utils/offlineQueries";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Text } from "react-native-paper";

export default function MenuScreen() {
  const { uid } = useLocalSearchParams<{ uid?: string }>();

  const { data: node, isLoading: nodeLoading, error: nodeError } = useQuery({
    queryKey: ["menu-node", uid],
    queryFn: () => loadMenuNode(uid as string),
    enabled: !!uid,
  });

  const { data: children, isLoading: childrenLoading } = useQuery<MenuChildDetail[]>({
    queryKey: ["menu-children", uid],
    queryFn: () => loadMenuChildrenDetails(uid as string),
    enabled: !!uid,
  });

  const isLoading = nodeLoading || childrenLoading;
  const displayChildren = useMemo(() => children ?? [], [children]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Color.primaryColor} />
      </View>
    );
  }

  if (nodeError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{(nodeError as Error).message || "Failed to load menu"}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Color.primaryBackgroundColor }}>
      <CommonAppBar
        title={node?.root_name || node?.translated_name || (uid as string) || "Menu"}
        onBack={() => router.back()}
        onSearch={() => router.push("/search")}
      />

      <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: Color.primaryBackgroundColor }}>
        <FlatList
          data={displayChildren}
          keyExtractor={(item) => item.uid}
          ListHeaderComponent={
            node?.blurb ? (
              <View style={{ marginBottom: 20, paddingHorizontal: 8, gap: 4 }}>
                <Text variant="titleMedium" style={{ color: Color.onPrimaryPrimaryTextColor }}>
                  {node?.blurb}
                </Text>
              </View>
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
              leftText={item.root_name ?? undefined}
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{}}
        />
      </View>
    </View>
  );
}
