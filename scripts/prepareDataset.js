/*
 * Build-time dataset preparation script.
 *
 * Responsibilities:
 * 1. Download the latest Bilara dataset zip + metadata JSON defined in .env.
 * 2. Extract contents to a staging directory for ingestion.
 * 3. Create the initial SQLite database file and persist dataset metadata for the app.
 * 4. Optimize database with VACUUM, REINDEX, and page_size optimization.
 * 5. Compress the database and generate base64 assets for Expo Go.
 * 6. Clean up temporary files.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");
const zlib = require("zlib");

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
const AUTHOR_META_PATH = path.join(BILARA_DIR, "_author.json");
const LEGACY_MAP_FILE_PATH = path.join(BILARA_DIR, "legacy_sutta_map.json");
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
    DROP TABLE IF EXISTS source_files;
    DROP TABLE IF EXISTS segments_fts;
    DROP TABLE IF EXISTS segments;
    DROP TABLE IF EXISTS translations;
    DROP TABLE IF EXISTS suttas;
    DROP TABLE IF EXISTS menus;
    DROP TABLE IF EXISTS languages;
    DROP TABLE IF EXISTS legacy_html;
    DROP TABLE IF EXISTS metadata;

    CREATE TABLE metadata (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      dataset_commit TEXT,
      dataset_date TEXT,
      dataset_updated_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE source_files (
      path TEXT PRIMARY KEY,
      kind TEXT,
      content_text TEXT,
      content_json TEXT
    );

    CREATE TABLE suttas (
      uid TEXT PRIMARY KEY,
      pitaka TEXT,
      collection TEXT,
      acronym TEXT,
      title TEXT,
      translated_title TEXT,
      blurb TEXT,
      difficulty REAL,
      root_lang TEXT,
      root_lang_name TEXT,
      sutta_type TEXT,
      volpages TEXT,
      alt_volpages TEXT,
      verse_no TEXT,
      parallel_count INTEGER,
      previous_uid TEXT,
      previous_name TEXT,
      next_uid TEXT,
      next_name TEXT,
      biblio TEXT,
      available_langs TEXT,
      priority_author_uid TEXT,
      source_json TEXT
    );

    CREATE TABLE translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sutta_uid TEXT NOT NULL,
      lang TEXT,
      author_uid TEXT,
      author TEXT,
      author_short TEXT,
      lang_name TEXT,
      is_root INTEGER,
      localized INTEGER,
      localized_percent REAL,
      segmented INTEGER,
      has_comment INTEGER,
      title TEXT,
      volpage TEXT,
      publication_date TEXT,
      path TEXT,
      source_json TEXT,
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

    CREATE TABLE comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sutta_uid TEXT NOT NULL,
      segment_id TEXT,
      lang TEXT,
      author_uid TEXT,
      content TEXT,
      FOREIGN KEY (sutta_uid) REFERENCES suttas(uid)
    );

    CREATE TABLE legacy_html (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sutta_uid TEXT NOT NULL,
      lang TEXT,
      author_uid TEXT,
      author TEXT,
      path TEXT,
      content TEXT,
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
      order_index INTEGER,
      source_json TEXT
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
    CREATE INDEX idx_comments_sutta_lang ON comments (sutta_uid, lang, author_uid);
    CREATE INDEX idx_translations_sutta ON translations (sutta_uid);
    CREATE INDEX idx_legacy_html_sutta_lang ON legacy_html (sutta_uid, lang, author_uid);
    CREATE INDEX idx_menus_parent ON menus (parent_uid);
    CREATE UNIQUE INDEX idx_menus_parent_uid_unique ON menus (pitaka, COALESCE(parent_uid, ''), uid);
    CREATE INDEX idx_source_files_kind ON source_files (kind);
  `);
}

function loadJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function walkFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  entries.forEach((entry) => {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  });

  return files;
}

function inferSourceKind(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized.startsWith("bilara-data-published/root/")) return "root";
  if (normalized.startsWith("bilara-data-published/translation/")) return "translation";
  if (normalized.startsWith("bilara-data-published/comment/")) return "comment";
  if (normalized.startsWith("bilara-data-published/html/")) return "html";
  if (normalized.startsWith("bilara-data-published/reference/")) return "reference";
  if (normalized.startsWith("bilara-data-published/variant/")) return "variant";
  if (normalized.startsWith("bilara-data-published/legacy/")) return "legacy";
  if (normalized.startsWith("bilara-data-published/_publication")) return "publication";
  if (normalized.startsWith("menus/")) return "menu";
  if (normalized.startsWith("generated/")) return "generated";
  if (normalized.startsWith("suttaplex/")) return "suttaplex";
  return path.extname(normalized).replace(/^\./, "") || "file";
}

function shouldStoreInSourceFiles(relativePath) {
  const kind = inferSourceKind(relativePath);
  return [
    "html",
    "reference",
    "variant",
    "legacy",
    "publication",
    "generated",
  ].includes(kind);
}

function ingestSourceFiles(db) {
  const allFiles = walkFiles(STAGING_DIR).filter((fullPath) => {
    const relativePath = path.relative(STAGING_DIR, fullPath).replace(/\\/g, "/");
    return shouldStoreInSourceFiles(relativePath);
  });

  if (!allFiles.length) {
    console.warn("No extracted files detected; skipping source file ingestion");
    return 0;
  }

  const insertSourceFile = db.prepare(`
    INSERT OR REPLACE INTO source_files (path, kind, content_text, content_json)
    VALUES (@path, @kind, @content_text, @content_json)
  `);

  const transaction = db.transaction(() => {
    allFiles.forEach((fullPath) => {
      const relativePath = path.relative(STAGING_DIR, fullPath).replace(/\\/g, "/");
      const rawContent = fs.readFileSync(fullPath, "utf-8");
      let contentJson = null;

      if (fullPath.endsWith(".json")) {
        try {
          contentJson = JSON.stringify(JSON.parse(rawContent));
        } catch {
          contentJson = null;
        }
      }

      insertSourceFile.run({
        path: relativePath,
        kind: inferSourceKind(relativePath),
        content_text: rawContent,
        content_json: contentJson,
      });
    });
  });

  transaction();
  console.log(`Loaded ${allFiles.length} source files.`);
  return allFiles.length;
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

 function inferLegacyLanguageFromPath(relativePath) {
  if (!relativePath) return null;
  const normalizedPath = relativePath.replace(/\\/g, "/");
  const parts = normalizedPath.split("/");
  const legacyIndex = parts.indexOf("legacy");
  if (legacyIndex >= 0 && parts[legacyIndex + 1]) {
    return parts[legacyIndex + 1];
  }
  return null;
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

function insertCommentsFromFile(db, params) {
  const { filePath, suttaUid, lang, authorUid, insertComment } = params;
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  const jsonData = loadJSON(filePath);
  if (!jsonData || typeof jsonData !== "object") {
    return 0;
  }

  let count = 0;
  for (const [segmentId, content] of Object.entries(jsonData)) {
    const textContent = typeof content === "string" ? content : "";
    if (!textContent) {
      continue;
    }

    insertComment.run({
      sutta_uid: suttaUid,
      segment_id: segmentId,
      lang,
      author_uid: authorUid,
      content: textContent,
    });
    count += 1;
  }

  return count;
}

function ingestSuttas(db) {
  const indexPath = path.join(GENERATED_DIR, "sutta_index.json");
  if (!fs.existsSync(indexPath)) {
    console.warn("No generated/sutta_index.json found; skipping sutta ingestion");
    return { suttas: 0, translations: 0, segments: 0 };
  }

  const suttaIndex = loadJSON(indexPath);
  const authorMeta = fs.existsSync(AUTHOR_META_PATH) ? loadJSON(AUTHOR_META_PATH) : {};
  const legacyMap = fs.existsSync(LEGACY_MAP_FILE_PATH) ? loadJSON(LEGACY_MAP_FILE_PATH) : {};
  const insertSutta = db.prepare(`
    INSERT OR REPLACE INTO suttas
    (uid, pitaka, collection, acronym, title, translated_title, blurb, difficulty, root_lang, root_lang_name, sutta_type, volpages, alt_volpages, verse_no, parallel_count, previous_uid, previous_name, next_uid, next_name, biblio, available_langs, priority_author_uid, source_json)
    VALUES (@uid, @pitaka, @collection, @acronym, @title, @translated_title, @blurb, @difficulty, @root_lang, @root_lang_name, @sutta_type, @volpages, @alt_volpages, @verse_no, @parallel_count, @previous_uid, @previous_name, @next_uid, @next_name, @biblio, @available_langs, @priority_author_uid, @source_json)
  `);
  const insertTranslation = db.prepare(`
    INSERT INTO translations
    (sutta_uid, lang, author_uid, author, author_short, lang_name, is_root, localized, localized_percent, segmented, has_comment, title, volpage, publication_date, path, source_json)
    VALUES (@sutta_uid, @lang, @author_uid, @author, @author_short, @lang_name, @is_root, @localized, @localized_percent, @segmented, @has_comment, @title, @volpage, @publication_date, @path, @source_json)
  `);
  const insertSegment = db.prepare(`
    INSERT INTO segments
    (sutta_uid, segment_id, lang, author_uid, content, segment_order)
    VALUES (@sutta_uid, @segment_id, @lang, @author_uid, @content, @segment_order)
  `);
  const insertComment = db.prepare(`
    INSERT INTO comments
    (sutta_uid, segment_id, lang, author_uid, content)
    VALUES (@sutta_uid, @segment_id, @lang, @author_uid, @content)
  `);
  const insertLegacyHtml = db.prepare(`
    INSERT INTO legacy_html
    (sutta_uid, lang, author_uid, author, path, content)
    VALUES (@sutta_uid, @lang, @author_uid, @author, @path, @content)
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
        acronym: suttaplex?.acronym || null,
        title: suttaplex?.original_title || null,
        translated_title: suttaplex?.translated_title || null,
        blurb: suttaplex?.blurb || null,
        difficulty: suttaplex?.difficulty ?? null,
        root_lang: suttaplex?.root_lang || null,
        root_lang_name: suttaplex?.root_lang_name || null,
        sutta_type: suttaplex?.type || null,
        volpages: suttaplex?.volpages || null,
        alt_volpages:
          suttaplex?.alt_volpages != null ? JSON.stringify(suttaplex.alt_volpages) : null,
        verse_no: suttaplex?.verseNo || null,
        parallel_count: suttaplex?.parallel_count ?? null,
        previous_uid: suttaplex?.previous?.uid || null,
        previous_name: suttaplex?.previous?.name || null,
        next_uid: suttaplex?.next?.uid || null,
        next_name: suttaplex?.next?.name || null,
        biblio: suttaplex?.biblio != null ? JSON.stringify(suttaplex.biblio) : null,
        available_langs: availableLangs,
        priority_author_uid: suttaplex?.priority_author_uid || null,
        source_json: suttaplex ? JSON.stringify(suttaplex) : null,
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
            author_short: translationMeta.author_short || null,
            lang_name: translationMeta.lang_name || null,
            is_root: translationMeta.is_root ? 1 : 0,
            localized: translationMeta.localized ? 1 : 0,
            localized_percent: translationMeta.localized_percent || 0,
            segmented: translationMeta.segmented ? 1 : 0,
            has_comment: translationMeta.has_comment ? 1 : 0,
            title: translationMeta.title || null,
            volpage: translationMeta.volpage != null ? String(translationMeta.volpage) : null,
            publication_date: translationMeta.publication_date || null,
            path: translationRelativePath,
            source_json: JSON.stringify(translationMeta),
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

          if (translationMeta.has_comment) {
            const parts = translationRelativePath.split("/");
            const filename = parts.pop();
            const dir = parts.join("/");
            const commentFilename = filename?.replace("translation-", "comment-");
            const commentFullPath = commentFilename
              ? path.join(
                  BILARA_DIR,
                  "comment",
                  langCode || "unknown",
                  authorUid,
                  dir,
                  commentFilename
                )
              : null;

            if (commentFullPath) {
              insertCommentsFromFile(db, {
                filePath: commentFullPath,
                suttaUid: uid,
                lang: langCode || "",
                authorUid,
                insertComment,
              });
            }
          }
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
            author_short: translatorUid,
            lang_name: langCode?.toUpperCase() || null,
            is_root: 0,
            localized: 0,
            localized_percent: 0,
            segmented: 0,
            has_comment: 0,
            title: null,
            volpage: null,
            publication_date: null,
            path: translationRelativePath,
            source_json: null,
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

      if ((!translations || Object.keys(translations).length === 0) && legacyMap && legacyMap[uid]) {
        const legacyEntry = legacyMap[uid];
        const legacyRelativePath = typeof legacyEntry?.path === "string"
          ? legacyEntry.path.replace(/\\/g, "/")
          : null;
        const legacyAuthorUid = legacyEntry?.author_uid || null;
        const legacyLang = inferLegacyLanguageFromPath(legacyRelativePath) || "en";
        const legacyAuthor = legacyAuthorUid && authorMeta?.[legacyAuthorUid]?.name
          ? authorMeta[legacyAuthorUid].name
          : legacyAuthorUid;
        const legacyFullPath = legacyRelativePath ? path.join(BILARA_DIR, legacyRelativePath) : null;

        if (legacyFullPath && fs.existsSync(legacyFullPath) && legacyAuthorUid) {
          recordLanguage({ iso_code: legacyLang, name: legacyLang.toUpperCase() });
          insertTranslation.run({
            sutta_uid: uid,
            lang: legacyLang,
            author_uid: legacyAuthorUid,
            author: legacyAuthor || legacyAuthorUid,
            author_short: legacyAuthor || legacyAuthorUid,
            lang_name: legacyLang.toUpperCase(),
            is_root: 0,
            localized: 0,
            localized_percent: 0,
            segmented: 0,
            has_comment: 0,
            title: null,
            volpage: null,
            publication_date: null,
            path: legacyRelativePath,
            source_json: legacyEntry ? JSON.stringify(legacyEntry) : null,
          });
          translationCount += 1;

          insertLegacyHtml.run({
            sutta_uid: uid,
            lang: legacyLang,
            author_uid: legacyAuthorUid,
            author: legacyAuthor || legacyAuthorUid,
            path: legacyRelativePath,
            content: fs.readFileSync(legacyFullPath, "utf-8"),
          });
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

  const rootNodes = Array.isArray(menuArray)
    ? menuArray
    : menuArray && typeof menuArray === "object"
      ? [menuArray]
      : [];

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
        child_range: node.child_range || null,
        root_lang_iso: node.root_lang_iso || null,
        root_lang_name: node.root_lang_name || null,
        yellow_brick_road: node.yellow_brick_road || null,
        yellow_brick_road_count: node.yellow_brick_road_count || null,
        source_json: JSON.stringify(node),
        order_index: index,
      });
      if (node.children) {
        traverse(node.children, node.uid, [...pathStack, node.uid]);
      }
    });
  }

  traverse(rootNodes);
  return rows;
}

function dedupeMenuRows(rows) {
  const seen = new Set();

  return rows.filter((row) => {
    const key = [row.pitaka, row.parent_uid || "", row.uid].join("::");
    if (!row.uid || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function ingestMenus(db) {
  if (!fs.existsSync(MENUS_DIR)) {
    console.warn("No menus directory detected; skipping menu ingestion");
    return 0;
  }

  const files = fs.readdirSync(MENUS_DIR).filter((file) => file.endsWith(".json"));
  const insertMenu = db.prepare(`
    INSERT OR IGNORE INTO menus
    (pitaka, collection, uid, parent_uid, root_name, translated_name, acronym, node_type, blurb, child_range, root_lang_iso, root_lang_name, yellow_brick_road, yellow_brick_road_count, order_index, source_json)
    VALUES (@pitaka, @collection, @uid, @parent_uid, @root_name, @translated_name, @acronym, @node_type, @blurb, @child_range, @root_lang_iso, @root_lang_name, @yellow_brick_road, @yellow_brick_road_count, @order_index, @source_json)
  `);

  let count = 0;
  files.forEach((file) => {
    const transaction = db.transaction(() => {
      const pitaka = path.basename(file, ".json");
      const menuData = loadJSON(path.join(MENUS_DIR, file));
      const rows = dedupeMenuRows(flattenMenus(menuData, { pitaka }));
      rows.forEach((row) => {
        const result = insertMenu.run({
          ...row,
          child_range: row.child_range || null,
          root_lang_iso: row.root_lang_iso || null,
          root_lang_name: row.root_lang_name || null,
          yellow_brick_road: row.yellow_brick_road ? 1 : 0,
          yellow_brick_road_count: row.yellow_brick_road_count || 0,
        });
        count += result.changes;
      });
    });

    transaction();
  });

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
  ingestSourceFiles(db);

  db.close();

  console.log(
    `SQLite database ready -> ${dbPath} (suttas: ${stats.suttas}, translations: ${stats.translations}, segments: ${stats.segments})`
  );
}

/**
 * Optimize database and keep compressed files for app deployment
 */
function optimizeAndGenerateAssets(dbPath) {
  console.log("Optimizing database...");
  
  const db = new Database(dbPath);
  
  console.log("Running VACUUM...");
  db.exec('VACUUM');
  
  console.log("Running REINDEX...");
  db.exec('REINDEX');
  
  console.log("Setting page_size to 4096...");
  db.exec('PRAGMA page_size=4096');
  
  console.log("Running final VACUUM...");
  db.exec('VACUUM');
  
  db.close();
  
  // Get optimized size
  const optimizedSize = fs.statSync(dbPath).size;
  console.log(`Database optimized: ${Math.round(optimizedSize / 1024 / 1024)} MB`);
  
  // Compress with gzip only
  console.log("Creating gzip compression...");
  const dbData = fs.readFileSync(dbPath);
  const gzipData = zlib.gzipSync(dbData, { level: 9 });
  const gzipPath = `${dbPath}.gz`;
  fs.writeFileSync(gzipPath, gzipData);
  
  // Calculate statistics
  const originalSize = dbData.length;
  const compressedSize = gzipData.length;
  const reduction = Math.round((1 - compressedSize / originalSize) * 100);
  
  console.log(`Database compression results:`);
  console.log(`- Original: ${Math.round(originalSize / 1024 / 1024)} MB`);
  console.log(`- Optimized: ${Math.round(optimizedSize / 1024 / 1024)} MB`);
  console.log(`- Compressed: ${Math.round(compressedSize / 1024 / 1024)} MB (${reduction}% reduction)`);
  console.log(`- Compressed file: ${gzipPath}`);
  
  // Keep compressed files for app deployment
  console.log("Keeping compressed files for app deployment...");
  
  // Remove the raw database
  console.log("Removing raw database file...");
  fs.unlinkSync(dbPath);
  
  return {
    compressedPath: gzipPath,
    originalSize,
    optimizedSize,
    compressedSize,
    reduction
  };
}

/**
 * Clean up temporary files
 */
function cleanupTempFiles() {
  console.log("Cleaning up temporary files...");
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }
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
  
  const dbPath = path.join(ASSETS_DB_DIR, "suttacentral.db");
  buildDatabase(metadata);
  
  // Optimize database and keep compressed files
  const result = optimizeAndGenerateAssets(dbPath);
  
  // Clean up temporary files
  cleanupTempFiles();

  console.log("Dataset preparation complete.");
  console.log(`Compressed database ready: ${result.compressedPath}`);
  console.log(`Total compression: ${result.reduction}% reduction`);
  console.log("Database will be decompressed on app first launch");
}

main().catch((error) => {
  console.error("Dataset preparation failed:", error);
  process.exit(1);
});
