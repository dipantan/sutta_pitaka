import { File } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import * as SQLite from "expo-sqlite";
import * as fflate from "fflate";
import { Platform } from "react-native";

const DB_URL =
  "https://pub-0c70566437df41cfb795a6a4cb09522b.r2.dev/suttacentral.db.gz";
const DB_NAME = "suttacentral.db";
const GZIP_NAME = "suttacentral.db.gz";
const DECOMPRESS_CHUNK_SIZE = 512 * 1024;

export type ProgressCallback = (
  progress: number,
  phase: "downloading" | "decompressing",
) => void;

class DatabaseService {
  private static async yieldToUI(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }

  private static getDocumentDirectory(): string {
    let dir =
      (FileSystem as any).documentDirectory ||
      (FileSystem as any).Paths?.document?.uri ||
      (FileSystem as any).Paths?.document?.path ||
      "";
    if (dir && !dir.endsWith("/")) dir += "/";
    return dir;
  }

  private static getSqliteDirectoryPath(): string {
    const defaultDir = (SQLite as any).defaultDatabaseDirectory;
    if (defaultDir && typeof defaultDir === "string" && defaultDir.length > 0) {
      return defaultDir.replace(/\/*$/, "");
    }

    let dir = this.getDocumentDirectory();
    if (dir.startsWith("file://")) {
      dir = dir.slice(7);
    }
    return `${dir.replace(/\/*$/, "")}/SQLite`;
  }

  private static getSqliteDirectoryUri(): string {
    return `file://${this.getSqliteDirectoryPath()}/`;
  }

  static async checkDatabaseExists(): Promise<boolean> {
    if (Platform.OS === "web") return true;
    const sqliteDirUri = this.getSqliteDirectoryUri();
    const dbPath = `${sqliteDirUri}${DB_NAME}`;

    console.log(`[DatabaseService] Checking DB at: ${dbPath}`);

    try {
      const info = await FileSystem.getInfoAsync(dbPath);
      if (!info.exists) {
        console.log("[DatabaseService] DB file does not exist");
        return false;
      }

      console.log(
        `[DatabaseService] DB file exists, size: ${info.size || 0} bytes`,
      );

      // If file exists, verify it has the expected table
      if (info.size && info.size < 100 * 1024) {
        console.log(
          "[DatabaseService] DB file is too small, treating as invalid",
        );
        return false;
      }

      const db = await SQLite.openDatabaseAsync(DB_NAME);
      const result = await db.getFirstAsync<{ count: number }>(
        "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='menus'",
      );
      const hasMenus = !!result && result.count > 0;
      console.log(`[DatabaseService] menus table check: ${hasMenus}`);
      return hasMenus;
    } catch (e) {
      console.warn("[DatabaseService] DB health check failed:", e);
      return false;
    }
  }

  static async initialize(onProgress: ProgressCallback): Promise<void> {
    const docDir = this.getDocumentDirectory();
    const sqliteDir = this.getSqliteDirectory();
    const gzipPath = `${docDir}${GZIP_NAME}`;
    const dbPath = `${sqliteDir}${DB_NAME}`;

    console.log("[DatabaseService] Initializing database...");
    console.log(`[DatabaseService] docDir: ${docDir}`);
    console.log(`[DatabaseService] dbPath: ${dbPath}`);

    // Ensure SQLite directory exists
    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
    if (!dirInfo.exists) {
      console.log("[DatabaseService] Creating SQLite directory...");
      await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
    }

    // 1. Download
    console.log("[DatabaseService] Starting download...");
    const downloadResumable = FileSystem.createDownloadResumable(
      DB_URL,
      gzipPath,
      {},
      (downloadProgress) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        onProgress(progress, "downloading");
      },
    );

    try {
      const result = await downloadResumable.downloadAsync();
      if (!result) throw new Error("Download failed");
      onProgress(1, "downloading");
      console.log("[DatabaseService] Download complete");
    } catch (err) {
      console.error("[DatabaseService] Download failed", err);
      throw err;
    }

    // 2. Decompress
    try {
      onProgress(0, "decompressing");
      console.log("[DatabaseService] Streaming gzip decompression...");
      const gzipFile = new File(gzipPath);
      const gzipInfo = await FileSystem.getInfoAsync(gzipPath);
      const totalCompressedBytes = Math.max(1, gzipInfo.size || 0);

      if (!gzipInfo.exists) {
        throw new Error("Compressed database file not found after download");
      }

      const outputFile = new File(dbPath);
      outputFile.create({ intermediates: true, overwrite: true });

      const inputHandle = gzipFile.open();
      const outputHandle = outputFile.open();

      let compressedRead = 0;
      let nextProgressUpdateAt = 0;

      try {
        await new Promise<void>((resolve, reject) => {
          let settled = false;
          const safeResolve = () => {
            if (!settled) {
              settled = true;
              resolve();
            }
          };
          const safeReject = (error: unknown) => {
            if (!settled) {
              settled = true;
              reject(error);
            }
          };

          const gunzip = new fflate.Gunzip((data, final) => {
            if (settled) return;

            try {
              if (data && data.length > 0) {
                outputHandle.writeBytes(data);
              }

              if (final) {
                safeResolve();
              }
            } catch (writeError) {
              safeReject(writeError);
            }
          });

          const feedChunks = async () => {
            try {
              while (compressedRead < totalCompressedBytes) {
                const remaining = totalCompressedBytes - compressedRead;
                const chunkSize = Math.min(DECOMPRESS_CHUNK_SIZE, remaining);
                const chunk = inputHandle.readBytes(chunkSize);

                if (!chunk || chunk.length === 0) {
                  safeReject(
                    new Error(
                      "Unexpected end of compressed file during decompression",
                    ),
                  );
                  return;
                }

                compressedRead += chunk.length;
                const isFinal = compressedRead >= totalCompressedBytes;
                try {
                  gunzip.push(chunk, isFinal);
                } catch (inflateError) {
                  safeReject(inflateError);
                  return;
                }

                if (compressedRead >= nextProgressUpdateAt || isFinal) {
                  onProgress(
                    Math.min(0.99, compressedRead / totalCompressedBytes),
                    "decompressing",
                  );
                  nextProgressUpdateAt = compressedRead + 2 * 1024 * 1024;
                }

                await DatabaseService.yieldToUI();
              }

              if (compressedRead >= totalCompressedBytes && !settled) {
                safeResolve();
              }
            } catch (streamErr) {
              safeReject(streamErr);
            }
          };

          void feedChunks();
        });
      } finally {
        inputHandle.close();
        outputHandle.close();
      }

      // Cleanup
      console.log("[DatabaseService] Cleaning up gzip file...");
      await FileSystem.deleteAsync(gzipPath, { idempotent: true });

      onProgress(1, "decompressing");
      console.log("[DatabaseService] Database initialized successfully");
    } catch (error) {
      console.error("[DatabaseService] Initialization process failed:", error);
      throw error;
    }
  }

  static async deleteDatabase(): Promise<void> {
    const dbPath = `${this.getSqliteDirectory()}${DB_NAME}`;
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
  }
}

export default DatabaseService;
