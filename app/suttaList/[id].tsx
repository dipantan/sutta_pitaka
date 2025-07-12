import { BillaraSutta } from "@/api/endpoints";
import instance from "@/api/instance";
import SuttaText from "@/components/SuttaText";
import { Color } from "@/constants/color";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Appbar } from "react-native-paper";

const SuttaDetails = () => {
  const { id, title } = useLocalSearchParams();
  const [text, setText] = React.useState<object | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchTranslation = async () => {
    try {
      setLoading(true);
      const { data } = await instance.get(BillaraSutta(id as string, "sujato"));
      setText(data?.translation_text);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
        <Appbar.Content title={title || "Sutta Details"} />
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
        <SuttaText suttaData={text} />
      )}
    </View>
  );
};

export default SuttaDetails;

const styles = StyleSheet.create({});
