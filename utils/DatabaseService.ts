import { Buffer } from "buffer";
import { File } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import * as SQLite from "expo-sqlite";
import * as fflate from "fflate";
import { Platform } from "react-native";

const DB_URL =
  "https://pub-0c70566437df41cfb795a6a4cb09522b.r2.dev/suttacentral.db.gz";
const DB_NAME = "suttacentral.db";
const GZIP_NAME = "suttacentral.db.gz";

export type ProgressCallback = (
  progress: number,
  phase: "downloading" | "decompressing",
) => void;

class DatabaseService {
  private static getDocumentDirectory(): string {
    let dir =
      (FileSystem as any).documentDirectory ||
      (FileSystem as any).Paths?.document?.uri ||
      (FileSystem as any).Paths?.document?.path ||
      "";
    if (dir && !dir.endsWith("/")) dir += "/";
    return dir;
  }

  private static getSqliteDirectory(): string {
    return `${this.getDocumentDirectory()}SQLite/`;
  }

  static async checkDatabaseExists(): Promise<boolean> {
    if (Platform.OS === "web") return true;
    const sqliteDir = this.getSqliteDirectory();
    const dbPath = `${sqliteDir}${DB_NAME}`;

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
      console.log("[DatabaseService] Reading gzip file as base64...");
      const gzipData = await FileSystem.readAsStringAsync(gzipPath, {
        encoding: "base64",
      });

      console.log("[DatabaseService] Converting base64 to buffer...");
      const buffer = Buffer.from(gzipData, "base64");

      console.log("[DatabaseService] Gunzipping...");
      const decompressed = fflate.gunzipSync(new Uint8Array(buffer));
      console.log(
        `[DatabaseService] Decompressed size: ${decompressed.length} bytes`,
      );

      // Write using Expo File Stream API (Safe for Expo Go)
      console.log("[DatabaseService] Writing database to disk...");

      const dbFile = (File as any) ? new File(dbPath) : null;
      if (dbFile) {
        // Clear/Create existing file first
        await FileSystem.writeAsStringAsync(dbPath, "");

        const stream = dbFile.writableStream();
        const writer = stream.getWriter();

        const chunkSize = 512 * 1024; // 512KB chunks for stability
        for (let i = 0; i < decompressed.length; i += chunkSize) {
          const chunk = decompressed.slice(
            i,
            Math.min(i + chunkSize, decompressed.length),
          );
          await writer.write(chunk);

          if (i % (5 * 1024 * 1024) === 0) {
            onProgress(
              Math.min(0.99, i / decompressed.length),
              "decompressing",
            );
          }
        }
        await writer.close();
      } else {
        console.log(
          "[DatabaseService] File API not found, falling back to base64 write (Memory Heavy!)",
        );
        const base64 = Buffer.from(decompressed).toString("base64");
        await FileSystem.writeAsStringAsync(dbPath, base64, {
          encoding: "base64",
        });
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
