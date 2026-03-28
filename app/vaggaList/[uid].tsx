import CommonAppBar from "@/components/CommonAppBar";
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import useTab from "@/stores/useTab";
import Styles from "@/styles";
import { ReaderScreenProps } from "@/types";
import { loadMenuChildrenDetails } from "@/utils/offlineQueries";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    View
} from "react-native";
import { Text } from "react-native-paper";

const VaggaList = () => {
  const { uid, title } = useLocalSearchParams();
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const { items, addItem } = useTab();

  const { data, isLoading } = useQuery({
    queryKey: ["vaggaList", uid],
    queryFn: () => loadMenuChildrenDetails(uid as string),
    enabled: !!uid,
  });

  return (
    <View style={{ flex: 1, backgroundColor: Color.primaryBackgroundColor }}>
      <CommonAppBar
        title={(title as string) || "Vaggas"}
        onBack={() => router.back()}
        onSearch={() => router.push("/search")}
        rightContent={
          items.length > 0 ? (
            <Pressable
              style={Styles.tabButton}
              onPress={() => {
                router.push({
                  pathname: "/tabs/[uid]",
                  params: {
                    uid: items[0]?.uid,
                    show: "true",
                  },
                });
              }}
            >
              <Text style={{ color: Color.invertedTextColor }}>
                {items.length}
              </Text>
            </Pressable>
          ) : null
        }
      />

      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Color.primaryColor} />
        </View>
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <MenuCard
              uid={item.uid}
              headerTitle={
                item.node_type === "branch"
                  ? item.translated_name || item.root_name || undefined
                  : item.sutta?.translated_title || item.translated_name || item.root_name || undefined
              }
              translations={item.translations}
              headerSubtitle={item.root_name ?? undefined}
              description={item.blurb ?? undefined}
              yellowBrickRoadCount={item.yellow_brick_road_count ?? undefined}
              yellowBrickRoad={item.yellow_brick_road ? true : undefined}
              leftText={item.root_lang_iso ?? undefined}
              child_range={item.child_range ?? undefined}
              onPress={() => {
                if (item.node_type === "branch") {
                  router.push({
                    pathname: "/vaggaList/[uid]",
                    params: {
                      uid: item.uid,
                      title: item.root_name,
                    },
                  });
                }
              }}
              onAuthorPress={(translation) => {
                const tabItem: ReaderScreenProps = {
                  uid: item.uid,
                  author_uid: translation.author_uid,
                  lang: translation.lang,
                  author: translation.author,
                  author_short: translation.author_short,
                  segmented: translation.segmented,
                  title:
                    item.sutta?.translated_title ||
                    item.translated_name ||
                    item.root_name ||
                    undefined,
                  translated_name: item.translated_name ?? undefined,
                  root_name: item.root_name ?? undefined,
                  blurb: item.blurb ?? undefined,
                };

                addItem(tabItem);
                router.push({
                  pathname: "/tabs/[uid]",
                  params: {
                    uid: item.uid,
                    author_uid: translation.author_uid,
                  },
                });
              }}
              // onLongPress={(translation) => {
              //   if (item.node_type === "leaf") {
              //     Alert.alert(
              //       "Alert",
              //       "Open in new tab?",
              //       [
              //         {
              //           text: "Cancel",
              //           style: "cancel",
              //         },
              //         {
              //           text: "Open",
              //           onPress: () => {
              //             // set to store
              //             addItem({
              //               ...item,
              //               extraData: item.extraData,
              //               ...translation,
              //               segmented: translation.segmented,
              //             });

              //             router.push({
              //               pathname: "/tabs/[uid]",
              //               params: {
              //                 uid: item.uid,
              //                 author_uid: translation.author_uid
              //               },
              //             });
              //           },
              //         },
              //       ],
              //       {}
              //     );
              //   }
              // }}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default VaggaList;
