/*
 * Build-time dataset preparation script.
 *
 * Responsibilities:
 * 1. Download the latest Bilara dataset zip + metadata JSON defined in .env.
 * 2. Extract contents to a staging directory for ingestion.
 * 3. Create the initial SQLite database file and persist dataset metadata for the app.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const AdmZip = require("adm-zip");
const Database = require("better-sqlite3");
const dotenv = require("dotenv");

const PROJECT_ROOT = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(PROJECT_ROOT, ".env") });

const TMP_DIR = path.join(PROJECT_ROOT, ".tmp", "dataset");
const STAGING_DIR = path.join(TMP_DIR, "extracted");
const BILARA_DIR = path.join(STAGING_DIR, "bilara-data-published");
const MENUS_DIR = path.join(STAGING_DIR, "menus");
const SUTTAPLEX_DIR = path.join(STAGING_DIR, "suttaplex");
const GENERATED_DIR = path.join(STAGING_DIR, "generated");
const ASSETS_DATASET_DIR = path.join(PROJECT_ROOT, "assets", "datasets");
const ASSETS_DB_DIR = path.join(PROJECT_ROOT, "assets", "databases");

const ZIP_DEST_PATH = path.join(TMP_DIR, "data.zip");
const JSON_DEST_PATH = path.join(TMP_DIR, "data.json");

const ZIP_URL = process.env.EXPO_PUBLIC_ZIP_URL;
const JSON_URL = process.env.EXPO_PUBLIC_JSON_URL;

if (!ZIP_URL || !JSON_URL) {
  console.error("Missing EXPO_PUBLIC_ZIP_URL or EXPO_PUBLIC_JSON_URL in .env");
  process.exit(1);
}

/**
 * Ensure a directory exists (clean if requested).
 */
function ensureDir(dirPath, clean = false) {
  if (clean && fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Download a remote file to disk.
 */
function downloadFile(url, destination) {
  console.log(`Downloading ${url} -> ${destination}`);
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    const handleResponse = (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirects
        https.get(response.headers.location, handleResponse).on("error", reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Request failed with status ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    };

    https.get(url, handleResponse).on("error", (error) => {
      fs.unlink(destination, () => reject(error));
    });
  });
}

/**
 * Extracts the downloaded zip into the staging directory.
 */
function extractZip(zipPath, destinationDir) {
  console.log(`Extracting ${zipPath} -> ${destinationDir}`);
  ensureDir(destinationDir, true);
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(destinationDir, true);
}

/**
 * Writes the metadata JSON into assets for the app to consume.
 */
function saveMetadata(metadata) {
  ensureDir(ASSETS_DATASET_DIR);
  const targetPath = path.join(ASSETS_DATASET_DIR, "metadata.json");
  fs.writeFileSync(targetPath, JSON.stringify(metadata, null, 2));
  console.log(`Metadata saved -> ${targetPath}`);
}

function createSchema(db) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    DROP TABLE IF EXISTS segments_fts;
    DROP TABLE IF EXISTS segments;
    DROP TABLE IF EXISTS translations;
    DROP TABLE IF EXISTS suttas;
    DROP TABLE IF EXISTS menus;
    DROP TABLE IF EXISTS languages;
    DROP TABLE IF EXISTS metadata;

    CREATE TABLE metadata (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      dataset_commit TEXT,
      dataset_date TEXT,
      dataset_updated_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE suttas (
      uid TEXT PRIMARY KEY,
      pitaka TEXT,
      collection TEXT,
      title TEXT,
      translated_title TEXT,
      blurb TEXT,
      root_lang TEXT,
      available_langs TEXT,
      priority_author_uid TEXT
    );

    CREATE TABLE translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sutta_uid TEXT NOT NULL,
      lang TEXT,
      author_uid TEXT,
      author TEXT,
      lang_name TEXT,
      is_root INTEGER,
      localized INTEGER,
      localized_percent REAL,
      segmented INTEGER,
      has_comment INTEGER,
      path TEXT,
      FOREIGN KEY (sutta_uid) REFERENCES suttas(uid)
    );

    CREATE TABLE segments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sutta_uid TEXT NOT NULL,
      segment_id TEXT,
      lang TEXT,
      author_uid TEXT,
      content TEXT,
      segment_order INTEGER,
      FOREIGN KEY (sutta_uid) REFERENCES suttas(uid)
    );

    CREATE TABLE menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pitaka TEXT,
      collection TEXT,
      uid TEXT,
      parent_uid TEXT,
      root_name TEXT,
      translated_name TEXT,
      acronym TEXT,
      node_type TEXT,
      blurb TEXT,
      child_range TEXT,
      root_lang_iso TEXT,
      root_lang_name TEXT,
      yellow_brick_road INTEGER,
      yellow_brick_road_count INTEGER,
      order_index INTEGER
    );

    CREATE TABLE languages (
      iso_code TEXT PRIMARY KEY,
      uid TEXT,
      name TEXT,
      is_root INTEGER,
      localized INTEGER,
      localized_percent REAL
    );

    CREATE VIRTUAL TABLE segments_fts USING fts5(
      content,
      segment_id UNINDEXED,
      sutta_uid UNINDEXED,
      lang UNINDEXED,
      author_uid UNINDEXED
    );

    CREATE INDEX idx_segments_sutta_lang ON segments (sutta_uid, lang, author_uid);
    CREATE INDEX idx_translations_sutta ON translations (sutta_uid);
    CREATE INDEX idx_menus_parent ON menus (parent_uid);
  `);
}

function loadJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function determinePitakaFromPath(relativePath) {
  if (!relativePath) return null;
  const parts = relativePath.split("/");
  return parts.length > 0 ? parts[0] : null;
}

function determineCollectionFromPath(relativePath) {
  if (!relativePath) return null;
  const parts = relativePath.split("/");
  return parts.length > 1 ? parts[1] : null;
}

function readSuttaplex(uid) {
  const filePath = path.join(SUTTAPLEX_DIR, `${uid}.json`);
  if (!fs.existsSync(filePath)) return null;
  const data = loadJSON(filePath);
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  return data;
}

function inferLanguageFromPath(relativePath) {
  if (!relativePath) return null;
  const match = relativePath.match(/_translation-([a-z]+)-/i);
  return match ? match[1] : null;
}

function insertSegmentsFromFile(db, params) {
  const { filePath, suttaUid, lang, authorUid, insertSegment, insertFts } = params;
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  const jsonData = loadJSON(filePath);
  if (!jsonData || typeof jsonData !== "object") {
    return 0;
  }

  let order = 0;
  for (const [segmentId, content] of Object.entries(jsonData)) {
    order += 1;
    const textContent = typeof content === "string" ? content : "";
    insertSegment.run({
      sutta_uid: suttaUid,
      segment_id: segmentId,
      lang,
      author_uid: authorUid,
      content: textContent,
      segment_order: order,
    });
    insertFts.run({
      content: textContent,
      segment_id: segmentId,
      sutta_uid: suttaUid,
      lang,
      author_uid: authorUid,
    });
  }
  return order;
}

function ingestSuttas(db) {
  const indexPath = path.join(GENERATED_DIR, "sutta_index.json");
  if (!fs.existsSync(indexPath)) {
    console.warn("No generated/sutta_index.json found; skipping sutta ingestion");
    return { suttas: 0, translations: 0, segments: 0 };
  }

  const suttaIndex = loadJSON(indexPath);
  const insertSutta = db.prepare(`
    INSERT OR REPLACE INTO suttas
    (uid, pitaka, collection, title, translated_title, blurb, root_lang, available_langs, priority_author_uid)
    VALUES (@uid, @pitaka, @collection, @title, @translated_title, @blurb, @root_lang, @available_langs, @priority_author_uid)
  `);
  const insertTranslation = db.prepare(`
    INSERT INTO translations
    (sutta_uid, lang, author_uid, author, segmented, has_comment, path)
    VALUES (@sutta_uid, @lang, @author_uid, @author, @segmented, @has_comment, @path)
  `);
  const insertSegment = db.prepare(`
    INSERT INTO segments
    (sutta_uid, segment_id, lang, author_uid, content, segment_order)
    VALUES (@sutta_uid, @segment_id, @lang, @author_uid, @content, @segment_order)
  `);
  const insertFts = db.prepare(`
    INSERT INTO segments_fts (content, segment_id, sutta_uid, lang, author_uid)
    VALUES (@content, @segment_id, @sutta_uid, @lang, @author_uid)
  `);

  const languagesMap = new Map();
  function recordLanguage({ iso_code, name, is_root, localized = 0, localized_percent = 0 }) {
    if (!iso_code || languagesMap.has(iso_code)) return;
    languagesMap.set(iso_code, {
      iso_code,
      name: name || iso_code,
      is_root: is_root ? 1 : 0,
      localized: localized ? 1 : 0,
      localized_percent,
    });
  }

  let suttaCount = 0;
  let translationCount = 0;
  let segmentCount = 0;

  const transaction = db.transaction(() => {
    for (const [uid, entry] of Object.entries(suttaIndex)) {
      const { root: rootPath, translations = {} } = entry;
      const pitaka = determinePitakaFromPath(rootPath);
      const collection = determineCollectionFromPath(rootPath);
      const suttaplex = readSuttaplex(uid);

      const availableLangs = suttaplex?.translations
        ? JSON.stringify(
            suttaplex.translations
              .map((t) => t.lang)
              .filter((lang) => typeof lang === "string")
          )
        : null;

      insertSutta.run({
        uid,
        pitaka,
        collection,
        title: suttaplex?.original_title || null,
        translated_title: suttaplex?.translated_title || null,
        blurb: suttaplex?.blurb || null,
        root_lang: suttaplex?.root_lang || null,
        available_langs: availableLangs,
        priority_author_uid: suttaplex?.priority_author_uid || null,
      });
      suttaCount += 1;

      const rootFullPath = rootPath
        ? path.join(BILARA_DIR, "root", "pli", "ms", rootPath)
        : null;
      if (rootFullPath) {
        recordLanguage({ iso_code: "pli", name: "Pāli", is_root: 1 });
        const inserted = insertSegmentsFromFile(db, {
          filePath: rootFullPath,
          suttaUid: uid,
          lang: "pli",
          authorUid: "ms",
          insertSegment,
          insertFts,
        });
        segmentCount += inserted;
      }

      if (suttaplex?.translations && Array.isArray(suttaplex.translations)) {
        for (const translationMeta of suttaplex.translations) {
          const authorUid = translationMeta.author_uid;
          const translationRelativePath = translations[authorUid];
          if (!translationRelativePath) {
            continue;
          }
          const langCode = translationMeta.lang || inferLanguageFromPath(translationRelativePath);
          recordLanguage({
            iso_code: langCode,
            name: translationMeta.lang_name,
            is_root: translationMeta.is_root,
            localized: translationMeta.localized,
            localized_percent: translationMeta.localized_percent || 0,
          });
          const translationFullPath = path.join(
            BILARA_DIR,
            "translation",
            langCode || "unknown",
            authorUid,
            translationRelativePath
          );
          insertTranslation.run({
            sutta_uid: uid,
            lang: langCode,
            author_uid: authorUid,
            author: translationMeta.author || null,
            segmented: translationMeta.segmented ? 1 : 0,
            has_comment: translationMeta.has_comment ? 1 : 0,
            path: translationRelativePath,
          });
          translationCount += 1;

          const inserted = insertSegmentsFromFile(db, {
            filePath: translationFullPath,
            suttaUid: uid,
            lang: langCode || "",
            authorUid,
            insertSegment,
            insertFts,
          });
          segmentCount += inserted;
        }
      } else {
        for (const [translatorUid, translationRelativePath] of Object.entries(
          translations
        )) {
          const langCode = inferLanguageFromPath(translationRelativePath);
          recordLanguage({ iso_code: langCode, name: langCode?.toUpperCase() });
          const translationFullPath = path.join(
            BILARA_DIR,
            "translation",
            langCode || "unknown",
            translatorUid,
            translationRelativePath
          );
          insertTranslation.run({
            sutta_uid: uid,
            lang: langCode,
            author_uid: translatorUid,
            author: translatorUid,
            segmented: 0,
            has_comment: 0,
            path: translationRelativePath,
          });
          translationCount += 1;
          const inserted = insertSegmentsFromFile(db, {
            filePath: translationFullPath,
            suttaUid: uid,
            lang: langCode || "",
            authorUid: translatorUid,
            insertSegment,
            insertFts,
          });
          segmentCount += inserted;
        }
      }
    }
  });

  transaction();

  const languages = Array.from(languagesMap.values());

  console.log(
    `Loaded ${suttaCount} suttas, ${translationCount} translations, ${segmentCount} segments.`
  );
  return { suttas: suttaCount, translations: translationCount, segments: segmentCount, languages };
}

function flattenMenus(menuArray, options) {
  const { pitaka } = options;
  const rows = [];

  function traverse(nodes, parentUid = null, pathStack = []) {
    if (!Array.isArray(nodes)) return;
    nodes.forEach((node, index) => {
      rows.push({
        pitaka,
        collection: node.uid || null,
        uid: node.uid,
        parent_uid: parentUid,
        root_name: node.root_name || null,
        translated_name: node.translated_name || null,
        acronym: node.acronym || null,
        node_type: node.node_type || null,
        blurb: node.blurb || null,
        order_index: index,
      });
      if (node.children) {
        traverse(node.children, node.uid, [...pathStack, node.uid]);
      }
    });
  }

  traverse(menuArray);
  return rows;
}

function ingestMenus(db) {
  if (!fs.existsSync(MENUS_DIR)) {
    console.warn("No menus directory detected; skipping menu ingestion");
    return 0;
  }

  const files = fs.readdirSync(MENUS_DIR).filter((file) => file.endsWith(".json"));
  const insertMenu = db.prepare(`
    INSERT INTO menus
    (pitaka, collection, uid, parent_uid, root_name, translated_name, acronym, node_type, blurb, order_index)
    VALUES (@pitaka, @collection, @uid, @parent_uid, @root_name, @translated_name, @acronym, @node_type, @blurb, @order_index)
  `);

  let count = 0;
  const transaction = db.transaction(() => {
    for (const file of files) {
      const pitaka = path.basename(file, ".json");
      const menuData = loadJSON(path.join(MENUS_DIR, file));
      const rows = flattenMenus(menuData, { pitaka });
      rows.forEach((row) => {
        insertMenu.run({
          ...row,
          child_range: row.child_range || null,
          root_lang_iso: row.root_lang_iso || null,
          root_lang_name: row.root_lang_name || null,
          yellow_brick_road: row.yellow_brick_road ? 1 : 0,
          yellow_brick_road_count: row.yellow_brick_road_count || 0,
        });
        count += 1;
      });
    }
  });

  transaction();
  console.log(`Loaded ${count} menu entries.`);
  return count;
}

function ingestLanguages(db, languages) {
  if (!languages || languages.length === 0) {
    console.warn("No languages detected during ingestion");
    return 0;
  }
  const insertLanguage = db.prepare(`
    INSERT INTO languages (iso_code, name, is_root, localized, localized_percent)
    VALUES (@iso_code, @name, @is_root, @localized, @localized_percent)
  `);
  const transaction = db.transaction(() => {
    languages.forEach((lang) => insertLanguage.run(lang));
  });
  transaction();
  console.log(`Loaded ${languages.length} languages.`);
  return languages.length;
}

function buildDatabase(metadata) {
  ensureDir(ASSETS_DB_DIR);
  const dbPath = path.join(ASSETS_DB_DIR, "suttacentral.db");
  if (fs.existsSync(dbPath)) {
    fs.rmSync(dbPath);
  }

  const db = new Database(dbPath);
  createSchema(db);

  db.prepare("DELETE FROM metadata").run();
  db.prepare(
    "INSERT INTO metadata (id, dataset_commit, dataset_date, dataset_updated_at) VALUES (1, @dataset_commit, @dataset_date, @dataset_updated_at)"
  ).run({
    dataset_commit: metadata.commit,
    dataset_date: metadata.date,
    dataset_updated_at: metadata.updated_at,
  });

  const stats = ingestSuttas(db);
  ingestLanguages(db, stats.languages);
  ingestMenus(db);

  db.close();

  console.log(
    `SQLite database ready -> ${dbPath} (suttas: ${stats.suttas}, translations: ${stats.translations}, segments: ${stats.segments})`
  );
}

async function main() {
  ensureDir(TMP_DIR, true);

  await downloadFile(ZIP_URL, ZIP_DEST_PATH);
  await downloadFile(JSON_URL, JSON_DEST_PATH);

  const metadata = JSON.parse(fs.readFileSync(JSON_DEST_PATH, "utf-8"));

  extractZip(ZIP_DEST_PATH, STAGING_DIR);
  if (!fs.existsSync(BILARA_DIR)) {
    throw new Error("bilara-data-published directory missing after extraction");
  }
  saveMetadata(metadata);
  buildDatabase(metadata);

  console.log("Dataset preparation complete.");
}

main().catch((error) => {
  console.error("Dataset preparation failed:", error);
  process.exit(1);
});
