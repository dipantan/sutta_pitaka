import { BillaraSutta } from "@/api/endpoints";
import instance from "@/api/instance";
import SuttaText from "@/components/SuttaText";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import { Appbar } from "react-native-paper";

const SuttaDetails = () => {
  const { item, id } = useLocalSearchParams();
  const [text, setText] = React.useState<object | null>(null);
  const pardedItem = JSON.parse(item as string);
  const { key } = pardedItem;

  const fetchTranslation = async () => {
    if (key === "sujato") {
      const { data } = await instance.get(BillaraSutta(id as string, key));
      setText(data?.translation_text);
    } else {
      // const { data } = await instance.get(BillaraSutta(id as string, key));
    }
  };

  useEffect(() => {
    fetchTranslation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={pardedItem.value} />
      </Appbar.Header>

      {key === "sujato" ? <SuttaText suttaData={text} /> : <></>}
    </View>
  );
};

export default SuttaDetails;
