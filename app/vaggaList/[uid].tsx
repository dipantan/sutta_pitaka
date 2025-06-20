import AppBar from "@/components/Appbar";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const VaggaList = () => {
  const { uid } = useLocalSearchParams();
  const navigation = useNavigation();

  console.log(uid);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <AppBar title="" />
    </View>
  );
};

export default VaggaList;

const styles = StyleSheet.create({});
