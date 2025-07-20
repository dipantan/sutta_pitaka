export interface Vaggga {
  acronym: string;
  volpages: string;
  alt_volpages: any;
  uid: string;
  blurb: string;
  difficulty: Difficulty;
  original_title: string;
  root_lang: string;
  root_lang_name: string;
  type: string;
  translated_title: string;
  translations: Translation[];
  parallel_count: number;
  biblio: any;
  priority_author_uid: any;
  verseNo: string;
  previous: Previous;
  next: Next;
}

export interface Difficulty {
  name: string;
  level: number;
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

export interface Previous {
  name: any;
  uid: any;
}

export interface Next {
  name: any;
  uid: any;
}
