import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Color } from "@/constants/color";

export type CommonAppBarProps = {
  title?: string;
  onBack?: () => void;
  onSearch?: () => void;
  rightContent?: React.ReactNode;
  style?: ViewStyle;
};

export default function CommonAppBar({ title, onBack, onSearch, rightContent, style }: CommonAppBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <Appbar.Header statusBarHeight={insets.top} style={[{ backgroundColor: Color.primaryColorLight }, style]}>
      {onBack ? <Appbar.BackAction onPress={onBack} color={Color.onPrimaryPrimaryTextColor} /> : null}
      <Appbar.Content title={title} color={Color.onPrimaryPrimaryTextColor} />
      {onSearch ? (
        <Pressable onPress={onSearch} style={{ paddingRight: 8 }}>
          <Appbar.Action icon="magnify" color={Color.onPrimaryPrimaryTextColor} onPress={onSearch} />
        </Pressable>
      ) : null}
      {rightContent}
    </Appbar.Header>
  );
}
