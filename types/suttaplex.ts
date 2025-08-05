export interface SuttaRoot {
  root_text: any;
  translation: any;
  segmented: boolean;
  suttaplex: Suttaplex;
  bilara_root_text: BilaraRootText;
  bilara_translated_text: any;
  candidate_authors: string[];
}

export interface Suttaplex {
  acronym: string;
  volpages: string;
  alt_volpages: any;
  uid: string;
  blurb: string;
  difficulty: number;
  original_title: string;
  root_lang: string;
  root_lang_name: string;
  type: string;
  from: any;
  translated_title: string;
  translations: Translation[];
  parallel_count: number;
  biblio: any;
  priority_author_uid: any;
  verseNo: string;
  previous: Previous;
  next: Next;
}

export interface Translation {
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
}

interface Previous {
  name: any;
  uid: any;
}

interface Next {
  name: any;
  uid: any;
}

interface BilaraRootText {
  uid: string;
  author: string;
  author_short: string;
  author_uid: string;
  lang: string;
  title: string;
  previous: Previous2;
  next: Next2;
}

interface Previous2 {
  author_uid: string;
  lang: string;
  name: any;
  uid: any;
}

interface Next2 {
  author_uid: string;
  lang: string;
  name: any;
  uid: any;
}
