import { Platform } from "react-native";
import { configureFonts, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { getPalette, ThemeMode } from "./color";

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

export function buildTheme(mode: ThemeMode) {
  const palette = getPalette(mode);
  const baseTheme = mode === "light" ? MD3LightTheme : MD3DarkTheme;

  return {
    ...baseTheme,
    roundness: 8,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
      ...baseTheme.colors,
      primary: palette.primaryColor,
      primaryContainer: palette.primaryColorDark,
      secondary: palette.primaryAccentColor,
      secondaryContainer: palette.primaryAccentColorLight,
      tertiary: palette.secondaryAccentColor,
      tertiaryContainer: palette.secondaryAccentColorLight,
      surface: palette.primaryBackgroundColor,
      surfaceVariant: palette.secondaryBackgroundColor,
      surfaceDisabled: mode === "light" ? "rgba(0,0,0,0.12)" : "rgba(255, 255, 255, 0.12)",
      background: palette.primaryBackgroundColor,
      error: palette.toastErrorColor,
      errorContainer: mode === "light" ? "#ffdad6" : "#93000A",
      onPrimary: palette.onPrimaryPrimaryTextColor,
      onPrimaryContainer: palette.onPrimarySecondaryTextColor,
      onSecondary: palette.onSecondaryPrimaryTextColor,
      onSecondaryContainer: palette.onSecondarySecondaryTextColor,
      onTertiary: palette.onTertiaryPrimaryTextColor,
      onTertiaryContainer: palette.onTertiarySecondaryTextColor,
      onSurface: palette.onPrimaryPrimaryTextColor,
      onSurfaceVariant: palette.onPrimarySecondaryTextColor,
      onSurfaceDisabled: mode === "light" ? "rgba(0,0,0,0.38)" : "rgba(255, 255, 255, 0.38)",
      onError: palette.invertedTextColor,
      onErrorContainer: palette.invertedTextColor,
      onBackground: palette.onPrimaryPrimaryTextColor,
      outline: palette.borderColor,
      outlineVariant: palette.borderColor,
      inverseSurface: palette.oppositeBackgroundColor,
      inverseOnSurface: palette.oppositeTextColor,
      inversePrimary: palette.primaryColorLight,
      shadow: "#000000",
      scrim: "#000000",
      backdrop: mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(0, 0, 0, 0.4)",
      elevation: {
        level0: "transparent",
        level1: palette.darkFixedBackgroundColor,
        level2: palette.tertiaryBackgroundColor,
        level3: mode === "light" ? "#e0e0e0" : "#454545",
        level4: mode === "light" ? "#ededed" : "#4F4F4F",
        level5: mode === "light" ? "#f5f5f5" : "#5A5A5A",
      },
      toastErrorColor: palette.toastErrorColor,
      toastSuccessColor: palette.toastSuccessColor,
      pieChartBgColor: palette.pieChartBgColor,
      pieChartFillColor: palette.pieChartFillColor,
      primaryColorLightTransparent: palette.primaryColorLightTransparent,
      iconColor: palette.iconColor,
      borderColor: palette.borderColor,
    },
  };
}
