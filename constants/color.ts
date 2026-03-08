export type ThemeMode = "light" | "dark";

type Palette = {
  primaryColor: string;
  primaryColorLight: string;
  primaryColorLightTransparent: string;
  primaryColorDark: string;
  primaryAlternateColor: string;
  primaryAccentColor: string;
  primaryAccentColorLight: string;
  secondaryAccentColor: string;
  secondaryAccentColorLight: string;
  primaryBackgroundColor: string;
  onPrimaryPrimaryTextColor: string;
  onPrimarySecondaryTextColor: string;
  secondaryBackgroundColor: string;
  onSecondaryPrimaryTextColor: string;
  onSecondarySecondaryTextColor: string;
  tertiaryBackgroundColor: string;
  onTertiaryPrimaryTextColor: string;
  onTertiarySecondaryTextColor: string;
  darkFixedBackgroundColor: string;
  darkerFixedBackgroundColor: string;
  invertedTextColor: string;
  oppositeBackgroundColor: string;
  oppositeTextColor: string;
  iconColor: string;
  borderColor: string;
  toastErrorColor: string;
  toastSuccessColor: string;
  pieChartBgColor: string;
  pieChartFillColor: string;
};

const darkPalette: Palette = {
  primaryColor: "#c68b05",
  primaryColorLight: "#f9b20f",
  primaryColorLightTransparent: "rgba(252, 239, 149, 0.2)",
  primaryColorDark: "#9e6f04",
  primaryAlternateColor: "#e68019",
  primaryAccentColor: "#5aa8f2",
  primaryAccentColorLight: "#4886C1",
  secondaryAccentColor: "#C03030",
  secondaryAccentColorLight: "#CC5959",
  primaryBackgroundColor: "#1f1f1f",
  onPrimaryPrimaryTextColor: "#f5f5f5",
  onPrimarySecondaryTextColor: "#d6d6d6",
  secondaryBackgroundColor: "#2a2a2a",
  onSecondaryPrimaryTextColor: "#f1f1f1",
  onSecondarySecondaryTextColor: "#cccccc",
  tertiaryBackgroundColor: "#333333",
  onTertiaryPrimaryTextColor: "#ffffff",
  onTertiarySecondaryTextColor: "#dddddd",
  darkFixedBackgroundColor: "#2a2a2a",
  darkerFixedBackgroundColor: "#1f1f1f",
  invertedTextColor: "#ffffff",
  oppositeBackgroundColor: "#ffffff",
  oppositeTextColor: "#201b13",
  iconColor: "#c7c7c7",
  borderColor: "#4f4f4f",
  toastErrorColor: "#ba1a1a",
  toastSuccessColor: "#4886C1",
  pieChartBgColor: "#4886C1",
  pieChartFillColor: "#5aa8f2",
};

const lightPalette: Palette = {
  primaryColor: "#b37300",
  primaryColorLight: "#ffd26a",
  primaryColorLightTransparent: "rgba(255, 210, 106, 0.2)",
  primaryColorDark: "#744a00",
  primaryAlternateColor: "#e68019",
  primaryAccentColor: "#3d7ed9",
  primaryAccentColorLight: "#5aa8f2",
  secondaryAccentColor: "#c03c3c",
  secondaryAccentColorLight: "#ff6b6b",
  primaryBackgroundColor: "#fafafa",
  onPrimaryPrimaryTextColor: "#1a1a1a",
  onPrimarySecondaryTextColor: "#4a4a4a",
  secondaryBackgroundColor: "#f0f0f0",
  onSecondaryPrimaryTextColor: "#222222",
  onSecondarySecondaryTextColor: "#4e4e4e",
  tertiaryBackgroundColor: "#e6e6e6",
  onTertiaryPrimaryTextColor: "#1f1f1f",
  onTertiarySecondaryTextColor: "#3a3a3a",
  darkFixedBackgroundColor: "#e6e6e6",
  darkerFixedBackgroundColor: "#dcdcdc",
  invertedTextColor: "#1a1a1a",
  oppositeBackgroundColor: "#1f1f1f",
  oppositeTextColor: "#f5f5f5",
  iconColor: "#6c6c6c",
  borderColor: "#c6c6c6",
  toastErrorColor: "#ba1a1a",
  toastSuccessColor: "#2b7dd3",
  pieChartBgColor: "#5aa8f2",
  pieChartFillColor: "#3d7ed9",
};

const palettes: Record<ThemeMode, Palette> = {
  light: lightPalette,
  dark: darkPalette,
};

let activePalette: Palette = darkPalette;

export const Color = new Proxy(palettes.dark, {
  get: (_target, prop: string) => {
    return (activePalette as Record<string, string>)[prop];
  },
}) as Palette;

export function setColorPalette(mode: ThemeMode) {
  activePalette = palettes[mode];
}

export function getPalette(mode: ThemeMode) {
  return palettes[mode];
}
