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
  uid: "long" | "middle" | "linked" | "numbered" | "minor";
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
  mainHeader?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  description?: string;
  yellowBrickRoad?: boolean;
  yellowBrickRoadCount?: number;
  yellowBrickRoadText?: string;
  leftText?: string;
  rightText?: string;
  isExpanded?: boolean;
  child_range?: string;
  translations?: Translation[];
  setIsExpanded?: (isExpanded: boolean) => void;
  onPress?: () => void;
  onAuthorPress?: (translation: Translation) => void;
};

type ISutta = {
  acronym: string;
  volpages: string;
  alt_volpages: any;
  uid: string;
  blurb: string;
  difficulty: {
    name: string;
    level: number;
  };
  original_title: string;
  root_lang: string;
  root_lang_name: string;
  type: string;
  translated_title: string;
  translations: {
    lang: string;
    lang_name: string;
    is_root: boolean;
    author: string;
    author_short: string;
    author_uid: string;
    publication_date?: string;
    id: string;
    segmented: boolean;
    title?: string;
    volpage: any;
    has_comment: boolean;
  }[];
  parallel_count: number;
  biblio: any;
  priority_author_uid: string;
  verseNo: string;
  previous: {
    name: any;
    uid: string;
  };
  next: {
    name: string;
    uid: string;
  };
};
