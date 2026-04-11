import * as FileSystem from "expo-file-system/legacy";
import * as SQLite from "expo-sqlite";

const DB_NAME = "suttacentral.db";
const METADATA_FILENAME = "metadata.json";

type DatasetPaths = {
  SQLITE_DIR: string;
  DATASET_DIR: string;
  DB_DEST_PATH: string;
  METADATA_DEST_PATH: string;
};

let resolvedPaths: DatasetPaths | null = null;

function resolvePaths(): DatasetPaths {
  if (resolvedPaths) return resolvedPaths;

  // Try multiple ways to get the document directory (handling SDK 54 changes)
  const documentDir = (FileSystem as any).documentDirectory ||
    (FileSystem as any).Paths?.document?.uri ||
    (FileSystem as any).Paths?.document?.path;

  const cacheDir = (FileSystem as any).cacheDirectory ||
    (FileSystem as any).Paths?.cache?.uri ||
    (FileSystem as any).Paths?.cache?.path;

  // Use Document Directory as primary, Cache as secondary fallback
  const baseDirectory = documentDir || cacheDir;

  if (!baseDirectory) {
    console.error("[dataset] Critical: Both documentDirectory and cacheDirectory are null.");
    // We provide a fallback string to prevent total crash
    const fallback = "/";
    resolvedPaths = {
      SQLITE_DIR: `${fallback}SQLite`,
      DATASET_DIR: `${fallback}dataset`,
      DB_DEST_PATH: `${fallback}SQLite/${DB_NAME}`,
      METADATA_DEST_PATH: `${fallback}dataset/${METADATA_FILENAME}`,
    };
    return resolvedPaths;
  }

  // Ensure path ends with /
  const normalizedBase = baseDirectory.endsWith('/') ? baseDirectory : `${baseDirectory}/`;

  resolvedPaths = {
    SQLITE_DIR: `${normalizedBase}SQLite`,
    DATASET_DIR: `${normalizedBase}dataset`,
    DB_DEST_PATH: `${normalizedBase}SQLite/${DB_NAME}`,
    METADATA_DEST_PATH: `${normalizedBase}dataset/${METADATA_FILENAME}`,
  };

  return resolvedPaths;
}

// Load metadata from bundled asset
const BUNDLED_METADATA: DatasetMetadata = require("../assets/datasets/metadata.json");

export type DatasetMetadata = {
  dataset_commit: string;
  dataset_date: string;
  dataset_updated_at: string;
};

async function ensureDirExists(path: string) {
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

async function readLocalMetadata(): Promise<DatasetMetadata | null> {
  try {
    const { METADATA_DEST_PATH } = resolvePaths();
    const info = await FileSystem.getInfoAsync(METADATA_DEST_PATH);
    if (!info.exists) {
      return null;
    }
    const fileContent = await FileSystem.readAsStringAsync(METADATA_DEST_PATH);
    return JSON.parse(fileContent);
  } catch (error) {
    console.warn("Failed to read dataset metadata:", error);
    return null;
  }
}

async function writeLocalMetadata(metadata: DatasetMetadata) {
  const { DATASET_DIR, METADATA_DEST_PATH } = resolvePaths();
  await ensureDirExists(DATASET_DIR);
  await FileSystem.writeAsStringAsync(
    METADATA_DEST_PATH,
    JSON.stringify(metadata)
  );
}

async function copyDatabaseIfNeeded() {
  const { SQLITE_DIR, DB_DEST_PATH } = resolvePaths();
  await ensureDirExists(SQLITE_DIR);
  const dbInfo = await FileSystem.getInfoAsync(DB_DEST_PATH);
  const storedMetadata = await readLocalMetadata();

  const shouldReplace =
    !dbInfo.exists ||
    !storedMetadata ||
    storedMetadata.dataset_commit !== BUNDLED_METADATA.dataset_commit;

  if (shouldReplace) {
    console.log("[dataset] Database needs update. Initialization handled by DatabaseInitializer component.");

    // Write metadata after successful setup
    await writeLocalMetadata(BUNDLED_METADATA);

    console.log("[dataset] Database setup complete");
  } else {
    console.log("[dataset] Existing DB up-to-date, skipping setup");
  }
}

let ensurePromise: Promise<DatasetMetadata> | null = null;
let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function ensureDatasetReady() {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      console.log("[dataset] ensureDatasetReady start");
      resolvePaths();
      await copyDatabaseIfNeeded();
      const metadata = (await readLocalMetadata()) ?? BUNDLED_METADATA;
      console.log("[dataset] ensureDatasetReady complete", metadata);
      return metadata;
    })();
  }

  const metadata = await ensurePromise;
  return {
    metadata,
    databasePath: resolvePaths().DB_DEST_PATH,
  };
}

export async function getDatabase() {
  if (!dbInstance) {
    await ensureDatasetReady();
    // Database is now managed by DatabaseDecompressor, use the standard path
    dbInstance = SQLite.openDatabaseSync(DB_NAME);
  }
  return dbInstance;
}

export async function getDatasetMetadata() {
  await ensureDatasetReady();
  return (await readLocalMetadata()) ?? BUNDLED_METADATA;
}
