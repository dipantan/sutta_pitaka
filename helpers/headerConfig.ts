import { Color } from "@/constants/color";
import { NativeStackNavigationOptions } from "react-native-screens/lib/typescript/native-stack/types";

export const headerConfig: NativeStackNavigationOptions = {
  headerTintColor: Color.onPrimaryPrimaryTextColor,
  backButtonDisplayMode: "minimal",
  headerTitle: "Vaggas",
};
