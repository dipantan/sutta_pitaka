import { MenuById, SuttaById } from "@/api/endpoints";
import instance from "@/api/instance";
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import useTab from "@/stores/useTab";
import Styles from "@/styles";
import { Suttaplex, SuttaRoot } from "@/types/suttaplex";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  View,
} from "react-native";
import { Appbar, List, Text } from "react-native-paper";

export type IData = {
  uid: string;
  root_name: string;
  translated_name: string;
  acronym: string;
  blurb: string;
  node_type: string;
  root_lang_iso: string;
  root_lang_name: string;
  child_range: string;
  yellow_brick_road: boolean;
  yellow_brick_road_count: number;
  extraData: SuttaRoot;
};

const fetchVaggaAndSuttaPlex = async (
  uid: string,
  language: string
): Promise<IData[]> => {
  // Fetch list
  const { data: vaggaResp } = await instance.get(MenuById(uid, language));
  const items: IData[] = vaggaResp?.[0]?.children || [];

  // Fetch all suttaplex in parallel
  const details = await Promise.all(
    items.map(async (item) => {
      // if (item.node_type === "branch") return item;

      try {
        const { data: suttaplexResp } = await instance.get<Suttaplex[]>(
          SuttaById(item.uid, language)
        );
        return { ...item, extraData: suttaplexResp };
      } catch (e: any) {
        return { ...item, extraData: {} as SuttaRoot };
      }
    })
  );

  return details as IData[];
};

const VaggaList = () => {
  const { uid, title } = useLocalSearchParams();
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const { items, addItem } = useTab();

  const { data, isLoading } = useQuery({
    queryKey: ["vaggaList", uid, currentLanguage?.iso_code],
    queryFn: () =>
      fetchVaggaAndSuttaPlex(
        uid as string,
        currentLanguage?.iso_code as string
      ),
    enabled: !!uid && !!currentLanguage?.iso_code,
  });

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={title || "Vaggas"} />

        {items.length > 0 && (
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
        )}

        <Pressable
          style={{
            paddingRight: 8,
          }}
          onPress={() => router.push("/search")}
        >
          <List.Icon icon={"magnify"} color="#fff" />
        </Pressable>
      </Appbar.Header>

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
                  ? item.translated_name || item.root_name
                  : item.extraData?.suttaplex?.translated_title
              }
              translations={item.extraData?.suttaplex?.translations}
              headerSubtitle={item.root_name}
              description={item.blurb}
              yellowBrickRoadCount={item.yellow_brick_road_count}
              yellowBrickRoad={item.yellow_brick_road}
              leftText={item.root_lang_iso}
              child_range={item.child_range}
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
                // set to store
                addItem({
                  ...item,
                  extraData: item.extraData,
                  ...translation,
                  segmented: translation.segmented,
                });

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
