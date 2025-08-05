interface Reference {
  author_uid: string;
  lang: string;
  name: string | null;
  uid: string | null;
}

interface Translation {
  lang: string;
  lang_name: string;
  is_root: boolean;
  author: string;
  author_short: string;
  author_uid: string;
  publication_date: string | null;
  id: string;
  segmented: boolean;
  title: string | null;
  volpage: string | null;
  has_comment: boolean;
}

interface SuttaText {
  uid: string;
  lang: string;
  is_root: boolean;
  title: string;
  author: string;
  author_short: string;
  author_uid: string;
  next: Reference | null;
  previous: Reference | null;
  text: string;
}

interface Suttaplex {
  acronym: string;
  volpages: string;
  alt_volpages: string | null;
  uid: string;
  blurb: string;
  difficulty: string | null;
  original_title: string;
  root_lang: string;
  root_lang_name: string;
  type: string;
  from: string | null;
  translated_title: string;
  translations: Translation[];
  parallel_count: number;
  biblio: string | null;
  priority_author_uid: string | null;
  verseNo: string;
  previous: Reference;
  next: Reference;
}

export interface LegacySutta {
  root_text: SuttaText;
  translation: SuttaText;
  segmented: boolean;
  suttaplex: Suttaplex;
  bilara_root_text: {
    uid: string;
    author: string;
    author_short: string;
    author_uid: string;
    lang: string;
    title: string;
    previous: Reference;
    next: Reference;
  };
  bilara_translated_text: SuttaText | null;
  candidate_authors: string[];
}
