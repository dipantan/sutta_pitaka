interface SuttaText {
  [key: string]: string; // Dynamic keys like kp1:0.1, kp1:0.2, etc.
}

export interface BillaraSuttaType {
  comment_text?: SuttaText;
  html_text: SuttaText;
  root_text: SuttaText;
  translation_text: SuttaText;
  reference_text: Partial<SuttaText>; // Some keys may be missing in reference_text
  keys_order: string[]; // Array of keys like ["kp1:0.1", "kp1:0.2", ...]
}