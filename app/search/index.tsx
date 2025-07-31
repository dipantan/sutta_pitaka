import { router } from "expo-router";
import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";

const Search = () => {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        statusBarHeight={Platform.OS === "ios" ? 5 : StatusBar.currentHeight}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={"Search"} />
      </Appbar.Header>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
