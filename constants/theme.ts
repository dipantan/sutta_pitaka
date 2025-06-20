import { Platform } from "react-native";
import { configureFonts, MD3DarkTheme } from "react-native-paper";
import { Color } from "./color";

// Define custom font configuration
const fontConfig = {
  regular: {
    fontFamily: Platform.select({
      ios: "System",
      android: "System",
      default: "sans-serif",
    }),
    fontWeight: "400",
  },
  medium: {
    fontFamily: Platform.select({
      ios: "System",
      android: "System",
      default: "sans-serif-medium",
    }),
    fontWeight: "500",
  },
  bold: {
    fontFamily: Platform.select({
      ios: "System",
      android: "System",
      default: "sans-serif",
    }),
    fontWeight: "700",
  },
};

// TypeScript augmentation for custom theme properties
declare module "react-native-paper" {
  interface Theme {
    roundness: number;
  }
  interface ThemeColors {
    toastErrorColor: string;
    toastSuccessColor: string;
    pieChartBgColor: string;
    pieChartFillColor: string;
    primaryColorLightTransparent: string;
    iconColor: string;
    borderColor: string;
  }
}

// Custom theme (based on your darker background colors)
const Theme = {
  ...MD3DarkTheme,
  roundness: 8,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: Color.primaryColor,
    primaryContainer: Color.primaryColorDark,
    secondary: Color.primaryAccentColor,
    secondaryContainer: Color.primaryAccentColorLight,
    tertiary: Color.secondaryAccentColor,
    tertiaryContainer: Color.secondaryAccentColorLight,
    surface: Color.primaryBackgroundColor,
    surfaceVariant: Color.secondaryBackgroundColor,
    surfaceDisabled: "rgba(255, 255, 255, 0.12)",
    background: Color.primaryBackgroundColor,
    error: Color.toastErrorColor,
    errorContainer: "#93000A", // Derived for contrast
    onPrimary: Color.onPrimaryPrimaryTextColor,
    onPrimaryContainer: Color.onPrimarySecondaryTextColor,
    onSecondary: Color.onSecondaryPrimaryTextColor,
    onSecondaryContainer: Color.onSecondarySecondaryTextColor,
    onTertiary: Color.onTertiaryPrimaryTextColor,
    onTertiaryContainer: Color.onTertiarySecondaryTextColor,
    onSurface: Color.onPrimaryPrimaryTextColor,
    onSurfaceVariant: Color.onPrimarySecondaryTextColor,
    onSurfaceDisabled: "rgba(255, 255, 255, 0.38)",
    onError: Color.invertedTextColor,
    onErrorContainer: Color.invertedTextColor,
    onBackground: Color.onPrimaryPrimaryTextColor,
    outline: Color.borderColor,
    outlineVariant: Color.borderColor,
    inverseSurface: Color.oppositeBackgroundColor,
    inverseOnSurface: Color.oppositeTextColor,
    inversePrimary: Color.primaryColorLight,
    shadow: "#000000",
    scrim: "#000000",
    backdrop: "rgba(0, 0, 0, 0.4)",
    elevation: {
      level0: "transparent",
      level1: Color.darkFixedBackgroundColor,
      level2: Color.tertiaryBackgroundColor,
      level3: "#454545",
      level4: "#4F4F4F",
      level5: "#5A5A5A",
    },
    // Custom colors
    toastErrorColor: Color.toastErrorColor,
    toastSuccessColor: Color.toastSuccessColor,
    pieChartBgColor: Color.pieChartBgColor,
    pieChartFillColor: Color.pieChartFillColor,
    primaryColorLightTransparent: Color.primaryColorLightTransparent,
    iconColor: Color.iconColor,
    borderColor: Color.borderColor,
  },
};

export { Theme };
