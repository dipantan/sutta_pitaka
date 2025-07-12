import { MenuById } from "@/api/endpoints";
import instance from "@/api/instance";
import MenuCard from "@/components/MenuCard";
import { Color } from "@/constants/color";
import useLanguageStore from "@/stores/useLanguage";
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
};

const VaggaList = () => {
  const { uid, title } = useLocalSearchParams();
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const [loading, setLoading] = React.useState(false);

  const [data, setData] = React.useState<IData[]>([]);

  const fetchVagga = async () => {
    try {
      setLoading(true);
      const { data } = await instance.get(
        MenuById(uid as string, currentLanguage?.iso_code as string)
      );
      setData(data?.[0]?.children);

      // setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVagga();
  }, []);

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
          renderItem={({ item }) => (
            <MenuCard
              uid={item.uid}
              headerTitle={item.translated_name}
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
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default VaggaList;
