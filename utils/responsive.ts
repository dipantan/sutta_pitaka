// utils/responsive.ts

import { Dimensions, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base guideline sizes are iPhone 11 Pro's
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Responsive width and height
export const wp = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;
const hp = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;

// Scale size based on screen width
const scale = (size: number) =>
  (SCREEN_WIDTH / guidelineBaseWidth) * size;

// Vertical scale based on screen height
const verticalScale = (size: number) =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;

// Moderate scale gives a slightly less aggressive scaling
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Font sizes using RFValue
const fontSize = (size: number) => RFValue(size, SCREEN_HEIGHT);

// Spacing helpers
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
};

// Margin helpers
export const margin = {
  tiny: scale(4),
  small: scale(8),
  medium: scale(16),
  large: scale(24),
  xlarge: scale(32),
};

// Padding helpers
export const padding = {
  tiny: scale(4),
  small: scale(8),
  medium: scale(16),
  large: scale(24),
  xlarge: scale(32),
};

// Font weight (optional utility)
const fontWeight = {
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
};

// Platform-specific styles if needed
const isIOS = Platform.OS === "ios";
const isAndroid = Platform.OS === "android";
