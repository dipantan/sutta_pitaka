import React from "react";
import { StyleProp, TextStyle } from "react-native";
import type { MD3Theme } from "react-native-paper";
import { Text as PaperText, useTheme } from "react-native-paper";

const EMPHASIS_OPACITY = {
  high: 1,
  medium: 0.74,
  low: 0.54,
} as const;

const FONT_WEIGHTS: Record<"regular" | "medium" | "bold", TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
  bold: "700",
};

type PaperTextProps = React.ComponentProps<typeof PaperText>;
type ThemeColors = MD3Theme["colors"];

type BaseTypographyProps = Omit<PaperTextProps, "variant" | "style"> & {
  variant?: PaperTextProps["variant"];
  emphasis?: keyof typeof EMPHASIS_OPACITY;
  tone?: keyof ThemeColors | string;
  weight?: keyof typeof FONT_WEIGHTS;
  align?: TextStyle["textAlign"];
  uppercase?: boolean;
  style?: StyleProp<TextStyle>;
};

export const ThemedText = ({
  children,
  variant = "bodyMedium",
  emphasis = "high",
  tone,
  weight = "regular",
  align,
  uppercase,
  style,
  ...rest
}: BaseTypographyProps) => {
  const theme = useTheme();
  let resolvedColor: string | undefined;
  if (tone) {
    const key = tone as keyof ThemeColors;
    const value = theme.colors[key] ?? tone;
    resolvedColor = typeof value === "string" ? value : undefined;
  } else {
    resolvedColor = theme.colors.onSurface;
  }

  const textStyle: TextStyle = {
    color: resolvedColor,
    opacity: EMPHASIS_OPACITY[emphasis],
    fontWeight: FONT_WEIGHTS[weight],
    textAlign: align,
    textTransform: uppercase ? "uppercase" : undefined,
  };

  return (
    <PaperText variant={variant} style={[textStyle, style]} {...rest}>
      {children}
    </PaperText>
  );
};

type VariantProps = Omit<BaseTypographyProps, "variant" | "weight"> & {
  weight?: BaseTypographyProps["weight"];
};

export const DisplayText = ({ weight = "bold", ...props }: VariantProps) => (
  <ThemedText variant="displaySmall" weight={weight} {...props} />
);

export const HeadingText = ({ weight = "bold", ...props }: VariantProps) => (
  <ThemedText variant="headlineSmall" weight={weight} {...props} />
);

export const TitleText = ({ weight = "medium", ...props }: VariantProps) => (
  <ThemedText variant="titleMedium" weight={weight} {...props} />
);

export const BodyText = ({ weight = "regular", ...props }: VariantProps) => (
  <ThemedText variant="bodyMedium" weight={weight} {...props} />
);

export const CaptionText = ({ emphasis = "medium", ...props }: VariantProps) => (
  <ThemedText variant="labelSmall" emphasis={emphasis} {...props} />
);
