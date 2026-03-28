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

  const documentDirectory = (FileSystem as any).documentDirectory as string | null;
  const cacheDirectory = (FileSystem as any).cacheDirectory as string | null;
  const baseDirectory = documentDirectory ?? cacheDirectory ?? null;

  if (!baseDirectory) {
    throw new Error("Expo FileSystem documentDirectory is unavailable.");
  }

  resolvedPaths = {
    SQLITE_DIR: `${baseDirectory}SQLite`,
    DATASET_DIR: `${baseDirectory}dataset`,
    DB_DEST_PATH: `${baseDirectory}SQLite/${DB_NAME}`,
    METADATA_DEST_PATH: `${baseDirectory}dataset/${METADATA_FILENAME}`,
  };

  return resolvedPaths;
}

const DB_ASSET = require("../assets/databases/suttacentral.db");
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

async function copyAssetToFile(assetModule: any, destination: string) {
  try {
    console.log("[dataset] Resolving asset for", destination);
    
    // Use direct bundled asset path to avoid expo-asset compatibility issues
    const assetPath = (assetModule as any).default || assetModule;
    
    if (typeof assetPath === 'string') {
      // Direct bundled asset path
      await FileSystem.copyAsync({ from: assetPath, to: destination });
      console.log("[dataset] Asset copied from bundled path to", destination);
      return;
    }
    
    throw new Error("Unable to resolve bundled asset path");
  } catch (error) {
    console.error("[dataset] copyAssetToFile failed", error);
    throw error;
  }
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
    console.log(
      "[dataset] Copying bundled DB →",
      DB_DEST_PATH,
      "(existing metadata:",
      storedMetadata?.dataset_commit,
      ")"
    );
    await FileSystem.deleteAsync(DB_DEST_PATH, { idempotent: true });
    console.log("[dataset] Copying asset to", DB_DEST_PATH);
    await copyAssetToFile(DB_ASSET, DB_DEST_PATH);
    await writeLocalMetadata(BUNDLED_METADATA);
    console.log("[dataset] DB copy complete");
  } else {
    console.log("[dataset] Existing DB up-to-date, skipping copy");
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
    dbInstance = SQLite.openDatabaseSync(DB_NAME);
  }
  return dbInstance;
}

export async function getDatasetMetadata() {
  await ensureDatasetReady();
  return (await readLocalMetadata()) ?? BUNDLED_METADATA;
}
