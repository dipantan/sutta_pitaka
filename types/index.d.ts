type LanguageStore = {
  languages: Language[];
  currentLanguage: Language | null;
  fetchLanguage: () => Promise<void>;
  setCurrentLanguage: (language: Language) => void;
  error: string | null;
  loading: boolean;
};

type Language = {
  uid: string;
  name: string;
  iso_code: string;
  is_root: boolean;
  localized: boolean;
  localized_percent: number;
};

type MenuStore = {
  menu: Menu | null;
  fetchMenu: (id: string, language?: string) => Promise<void>;
  selectedChildMenu: ChildMenu | null;
  error: string | null;
  loading: boolean;
};

type Menu = {
  uid: string;
  root_name: string;
  translated_name: string;
  blurb: string;
  acronym: string;
  node_type: string;
  root_lang_iso: any;
  root_lang_name: any;
  child_range: any;
  yellow_brick_road: boolean;
  yellow_brick_road_count: number;
  children: ChildMenu[];
};

type ChildMenu = {
  uid: string;
  root_name: string;
  translated_name: string;
  acronym: string;
  blurb: string;
  node_type: string;
  root_lang_iso: any;
  root_lang_name: any;
  child_range: any;
  yellow_brick_road: boolean;
  yellow_brick_road_count: number;
};

type TMenuCard = {
  uid: string;
  headerTitle?: string;
  headerSubtitle?: string;
  description?: string;
  yellowBrickRoad?: boolean;
  yellowBrickRoadCount?: number;
  yellowBrickRoadText?: string;
  leftText?: string;
  rightText?: string;
  isExpanded?: boolean;
  setIsExpanded?: (isExpanded: boolean) => void;
  onPress?: () => void;
};
