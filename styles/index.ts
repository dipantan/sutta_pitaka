import { Color } from "@/constants/color";
import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  tabButton: {
    borderColor: Color.invertedTextColor,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});

export default Styles;
