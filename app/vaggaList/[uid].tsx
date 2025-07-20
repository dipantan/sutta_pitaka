import { MenuById, SuttaById } from "@/api/endpoints";
import instance from "@/api/instance";
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
import { Suttaplex, SuttaRoot } from "@/types/suttaplex";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  View,
} from "react-native";
import { Appbar } from "react-native-paper";

type IData = {
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

const VaggaList = () => {
  const { uid, title } = useLocalSearchParams();
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const [loading, setLoading] = React.useState(false);

  const [data, setData] = React.useState<IData[]>([]);

  const fetchVaggaAndSuttaPlex = async () => {
    try {
      setLoading(true);

      // Fetch list
      const { data: vaggaResp } = await instance.get(
        MenuById(uid as string, currentLanguage?.iso_code as string)
      );
      const items: IData[] = vaggaResp?.[0]?.children || [];

      // Fetch all suttaplex in parallel
      const details = await Promise.all(
        items.map(async (item) => {
          //  if item type is branch then skip
          if (item.node_type === "branch") return item;

          try {
            const { data: suttaplexResp } = await instance.get<Suttaplex[]>(
              SuttaById(item.uid, currentLanguage?.iso_code as string)
            );

            return { ...item, extraData: suttaplexResp };
          } catch (e: any) {
            // Optional: Attach error info, or fallback to item only
            return { ...item, extraData: {} as SuttaRoot };
          }
        })
      );

      setData(details as IData[]);
    } catch (error) {
      console.log(error);
      setData([]); // optional: or keep previous
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaggaAndSuttaPlex();
  }, [currentLanguage, uid]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Appbar.Header
        statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={title || "Vaggas"} />
      </Appbar.Header>

      {loading ? (
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
          data={data}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => {
            return (
              <MenuCard
                uid={item.uid}
                headerTitle={
                  item.extraData?.suttaplex?.translated_title ||
                  item.translated_name
                }
                headerSubtitle={item.root_name}
                description={item.blurb}
                yellowBrickRoadCount={item.yellow_brick_road_count}
                yellowBrickRoad={item.yellow_brick_road}
                leftText={item.root_lang_iso}
                child_range={item.child_range}
                onPress={() => {
                  if (item.node_type === "leaf") {
                    router.push({
                      pathname: "/suttaList/[id]",
                      params: {
                        id: item.uid,
                        title: item.translated_name,
                      },
                    });
                  } else {
                    router.push({
                      pathname: "/vaggaList/[uid]",
                      params: {
                        uid: item.uid,
                        title: item.root_name,
                      },
                    });
                  }
                }}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default VaggaList;
