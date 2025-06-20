import { Color } from "@/constants/color";
import { router } from "expo-router";
import React from "react";
import { Appbar } from "react-native-paper";

const AppBar = ({ title }: { title: string }) => {
  return (
    <Appbar.Header
      style={{
        backgroundColor: Color.primaryColor,
      }}
    >
      <Appbar.BackAction
        onPress={() => {
          router.back();
        }}
      />
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default AppBar;
