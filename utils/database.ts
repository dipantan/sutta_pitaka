import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
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
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();
  const source = asset.localUri ?? asset.uri;
  if (!source) {
    throw new Error("Bundled asset missing local URI");
  }
  await FileSystem.copyAsync({ from: source, to: destination });
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
    await FileSystem.deleteAsync(DB_DEST_PATH, { idempotent: true });
    await copyAssetToFile(DB_ASSET, DB_DEST_PATH);
    await writeLocalMetadata(BUNDLED_METADATA);
  }
}

let ensurePromise: Promise<DatasetMetadata> | null = null;
let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function ensureDatasetReady() {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      resolvePaths();
      await copyDatabaseIfNeeded();
      const metadata = (await readLocalMetadata()) ?? BUNDLED_METADATA;
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
