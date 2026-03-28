import { Translation } from "@/types/suttaplex";
import { getDatabase } from "@/utils/database";

type LanguageRecord = {
  iso_code: string;
  uid?: string | null;
  name: string;
  is_root: number;
  localized: number;
  localized_percent: number;
};

type MenuRecord = {
  uid: string;
  pitaka: string;
  collection: string | null;
  parent_uid: string | null;
  root_name: string | null;
  translated_name: string | null;
  acronym: string | null;
  node_type: string | null;
  blurb: string | null;
  child_range: string | null;
  root_lang_iso: string | null;
  root_lang_name: string | null;
  yellow_brick_road: number | null;
  yellow_brick_road_count: number | null;
  order_index: number | null;
};

type MenuNode = MenuRecord & { children: MenuRecord[] };

type TranslationRow = {
  sutta_uid: string;
  lang: string;
  lang_name: string | null;
  author_uid: string;
  author: string | null;
  segmented: number;
  has_comment: number;
  is_root: number;
  localized: number;
  localized_percent: number | null;
};

type SuttaRecord = {
  uid: string;
  title: string | null;
  translated_title: string | null;
  blurb: string | null;
  root_lang: string | null;
  root_lang_name: string | null;
};

type SegmentRow = {
  segment_id: string;
  content: string;
  segment_order: number;
};

export type SuttaSegment = {
  segment_id: string;
  translation: string;
  root?: string;
  title?: string | null;
  order: number;
};

export type SuttaContent = {
  segments: SuttaSegment[];
  translation: Translation | null;
  sutta: SuttaRecord | null;
};

type SearchResultRecord = SuttaRecord & { acronym: string | null };

export type SearchResult = SearchResultRecord & {
  translations: Translation[];
};

export async function loadLanguages() {
  const db = await getDatabase();
  const rows = (await db.getAllAsync<LanguageRecord>(
    `SELECT * FROM languages ORDER BY is_root DESC, name ASC`
  )) as LanguageRecord[];

  return rows.map((row) => ({
    uid: row.uid ?? row.iso_code,
    name: row.name,
    iso_code: row.iso_code,
    is_root: row.is_root === 1,
    localized: row.localized === 1,
    localized_percent: row.localized_percent,
  }));
}

export async function loadMenuNode(uid: string): Promise<MenuNode | null> {
  const db = await getDatabase();
  const node = await db.getFirstAsync<MenuRecord>(
    `SELECT * FROM menus WHERE uid = ? LIMIT 1`,
    [uid]
  );

  if (!node) return null;

  const children = (await db.getAllAsync<MenuRecord>(
    `SELECT * FROM menus WHERE parent_uid = ? ORDER BY order_index`,
    [uid]
  )) as MenuRecord[];

  return { ...node, children } as MenuNode;
}

export async function loadSuttaplex(suttaUid: string): Promise<{
  translations: Translation[];
  sutta: SuttaRecord | null;
}> {
  const db = await getDatabase();

  const translations = (await db.getAllAsync<TranslationRow>(
    `SELECT * FROM translations WHERE sutta_uid = ? ORDER BY is_root DESC, lang ASC`,
    [suttaUid]
  )) as TranslationRow[];

  const mapped: Translation[] = translations.map(mapTranslationRow);

  const sutta = await db.getFirstAsync<SuttaRecord>(
    `SELECT uid, title, translated_title, blurb, root_lang, root_lang_name FROM suttas WHERE uid = ? LIMIT 1`,
    [suttaUid]
  );

  return { translations: mapped, sutta: sutta ?? null };
}

function sanitizeFtsQuery(query: string) {
  return query
    .trim()
    .replace(/"|'/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => `${token}*`)
    .join(" ");
}

function mapTranslationsBySutta(rows: TranslationRow[]) {
  const translationsMap = new Map<string, Translation[]>();
  rows.forEach((row) => {
    const entry = mapTranslationRow(row);
    const existing = translationsMap.get(row.sutta_uid) ?? [];
    existing.push(entry);
    translationsMap.set(row.sutta_uid, existing);
  });
  return translationsMap;
}

export async function searchSuttas(
  query: string,
  lang?: string,
  limit = 50
): Promise<SearchResult[]> {
  const normalized = query.trim();
  if (!normalized) {
    return [];
  }

  const db = await getDatabase();
  const matchQuery = sanitizeFtsQuery(normalized) || normalized;
  const params = lang ? [matchQuery, lang, limit] : [matchQuery, limit];

  let hitRows: { sutta_uid: string }[] = [];
  try {
    hitRows = (await db.getAllAsync<{ sutta_uid: string }>(
      `SELECT DISTINCT sutta_uid
       FROM segments_fts
       WHERE segments_fts MATCH ?
       ${lang ? "AND lang = ?" : ""}
       LIMIT ?`,
      params
    )) as { sutta_uid: string }[];
  } catch (error) {
    console.warn("FTS search failed, falling back to LIKE query", error);
    const likeParam = `%${normalized}%`;
    hitRows = (await db.getAllAsync<{ sutta_uid: string }>(
      `SELECT DISTINCT uid as sutta_uid
       FROM suttas
       WHERE translated_title LIKE ? OR title LIKE ?
       LIMIT ?`,
      [likeParam, likeParam, limit]
    )) as { sutta_uid: string }[];
  }

  const suttaUids = hitRows.map((row) => row.sutta_uid);
  if (!suttaUids.length) {
    return [];
  }

  const placeholders = suttaUids.map(() => "?").join(",");

  const suttaRows = (await db.getAllAsync<SearchResultRecord>(
    `SELECT s.uid, s.title, s.translated_title, s.blurb, s.root_lang, s.root_lang_name, m.acronym
     FROM suttas s
     LEFT JOIN menus m ON m.uid = s.uid
     WHERE s.uid IN (${placeholders})
     GROUP BY s.uid`,
    suttaUids
  )) as SearchResultRecord[];

  const suttaMap = new Map<string, SearchResultRecord>();
  suttaRows.forEach((row) => suttaMap.set(row.uid, row));

  const translationRows = (await db.getAllAsync<TranslationRow>(
    `SELECT * FROM translations WHERE sutta_uid IN (${placeholders})`,
    suttaUids
  )) as TranslationRow[];

  const translationsMap = mapTranslationsBySutta(translationRows);

  return suttaUids
    .map((uid) => {
      const sutta = suttaMap.get(uid);
      if (!sutta) {
        return null;
      }
      return {
        ...sutta,
        translations: translationsMap.get(uid) ?? [],
      } as SearchResult;
    })
    .filter((item): item is SearchResult => item !== null);
}

function mapTranslationRow(row: TranslationRow): Translation {
  return {
    lang: row.lang,
    lang_name: row.lang_name || row.lang?.toUpperCase() || row.lang || "Unknown",
    is_root: row.is_root === 1,
    author: row.author || "Unknown",
    author_short:
      row.author?.split(" ").slice(-1).join(" ") || row.author || "Unknown",
    author_uid: row.author_uid,
    id: `${row.sutta_uid}-${row.author_uid}-${row.lang}`,
    segmented: row.segmented === 1,
    title: undefined,
    volpage: null,
    has_comment: row.has_comment === 1,
    publication_date: undefined,
  };
}

export async function loadSuttaContent(
  suttaUid: string,
  authorUid: string,
  lang: string
): Promise<SuttaContent> {
  const db = await getDatabase();

  const translationRows = (await db.getAllAsync<SegmentRow>(
    `SELECT segment_id, content, segment_order FROM segments WHERE sutta_uid = ? AND author_uid = ? ORDER BY segment_order`,
    [suttaUid, authorUid]
  )) as SegmentRow[];

  const rootRows = (await db.getAllAsync<SegmentRow>(
    `SELECT segment_id, content, segment_order FROM segments WHERE sutta_uid = ? AND lang = 'pli' ORDER BY segment_order`,
    [suttaUid]
  )) as SegmentRow[];

  const rootMap = new Map<string, SegmentRow>();
  rootRows.forEach((row) => rootMap.set(row.segment_id, row));

  const translationMetaRow = await db.getFirstAsync<TranslationRow>(
    `SELECT * FROM translations WHERE sutta_uid = ? AND author_uid = ? AND lang = ? LIMIT 1`,
    [suttaUid, authorUid, lang]
  );
  const translation = translationMetaRow ? mapTranslationRow(translationMetaRow) : null;

  const sutta = await db.getFirstAsync<SuttaRecord>(
    `SELECT uid, title, translated_title, blurb, root_lang, root_lang_name FROM suttas WHERE uid = ? LIMIT 1`,
    [suttaUid]
  );

  const segments: SuttaSegment[] = translationRows.map((row) => ({
    segment_id: row.segment_id,
    translation: row.content,
    root: rootMap.get(row.segment_id)?.content,
    order: row.segment_order,
    title: null,
  }));

  return {
    segments,
    translation,
    sutta: sutta ?? null,
  };
}

export type MenuChildDetail = MenuRecord & {
  translations: Translation[];
  sutta?: SuttaRecord | null;
};

export async function loadMenuChildrenDetails(parentUid: string): Promise<MenuChildDetail[]> {
  const db = await getDatabase();
  const children = (await db.getAllAsync<MenuRecord>(
    `SELECT * FROM menus WHERE parent_uid = ? ORDER BY order_index`,
    [parentUid]
  )) as MenuRecord[];

  if (!children.length) {
    return [];
  }

  const leafUids = children.filter((child) => child.node_type === "leaf").map((child) => child.uid);
  let translationsMap = new Map<string, Translation[]>();
  let suttaMap = new Map<string, SuttaRecord>();

  if (leafUids.length) {
    const placeholders = leafUids.map(() => "?").join(",");
    const translations = (await db.getAllAsync<TranslationRow>(
      `SELECT * FROM translations WHERE sutta_uid IN (${placeholders})`,
      leafUids
    )) as TranslationRow[];

    translations.forEach((row) => {
      const entry: Translation = {
        lang: row.lang,
        lang_name:
          row.lang_name || row.lang?.toUpperCase() || row.lang || "Unknown",
        is_root: row.is_root === 1,
        author: row.author || "Unknown",
        author_short:
          row.author?.split(" ").slice(-1).join(" ") || row.author || "Unknown",
        author_uid: row.author_uid,
        id: `${row.sutta_uid}-${row.author_uid}-${row.lang}`,
        segmented: row.segmented === 1,
        title: undefined,
        volpage: null,
        has_comment: row.has_comment === 1,
        publication_date: undefined,
      };
      const existing = translationsMap.get(row.sutta_uid) ?? [];
      existing.push(entry);
      translationsMap.set(row.sutta_uid, existing);
    });

    const suttas = (await db.getAllAsync<SuttaRecord>(
      `SELECT uid, title, translated_title, blurb, root_lang, root_lang_name FROM suttas WHERE uid IN (${placeholders})`,
      leafUids
    )) as SuttaRecord[];

    suttas.forEach((sutta) => suttaMap.set(sutta.uid, sutta));
  }

  return children.map((child) => ({
    ...child,
    translations: translationsMap.get(child.uid) ?? [],
    sutta: suttaMap.get(child.uid) ?? null,
  }));
}

export async function loadMenuByPitaka(pitaka: string): Promise<MenuNode | null> {
  const db = await getDatabase();
  const root = await db.getFirstAsync<MenuRecord>(
    `SELECT * FROM menus WHERE pitaka = ? AND (parent_uid IS NULL OR parent_uid = '') ORDER BY order_index LIMIT 1`,
    [pitaka]
  );

  if (!root) {
    return null;
  }

  const children = (await db.getAllAsync<MenuRecord>(
    `SELECT * FROM menus WHERE parent_uid = ? ORDER BY order_index`,
    [root.uid]
  )) as MenuRecord[];

  return {
    ...root,
    children,
  };
}

type PitakaSummary = {
  pitaka: string;
  uid: string;
  root_name: string | null;
  translated_name: string | null;
  blurb: string | null;
  yellow_brick_road_count: number | null;
};

export async function loadPitakas(): Promise<PitakaSummary[]> {
  const db = await getDatabase();
  const rows = (await db.getAllAsync<PitakaSummary>(
    `
    SELECT * FROM (
      SELECT uid, pitaka, root_name, translated_name, blurb, yellow_brick_road_count
      FROM menus
      WHERE (parent_uid IS NULL OR parent_uid = '') AND pitaka = 'sutta'
      ORDER BY order_index
      LIMIT 1
    )
    UNION ALL
    SELECT * FROM (
      SELECT uid, pitaka, root_name, translated_name, blurb, yellow_brick_road_count
      FROM menus
      WHERE (parent_uid IS NULL OR parent_uid = '') AND pitaka = 'vinaya'
      ORDER BY order_index
      LIMIT 1
    )
    UNION ALL
    SELECT * FROM (
      SELECT uid, pitaka, root_name, translated_name, blurb, yellow_brick_road_count
      FROM menus
      WHERE (parent_uid IS NULL OR parent_uid = '') AND pitaka = 'abhidhamma'
      ORDER BY order_index
      LIMIT 1
    )
    `
  )) as PitakaSummary[];

  return rows;
}
