import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { Buffer } from 'buffer';
import * as fflate from 'fflate';
import { File } from 'expo-file-system';

const DB_URL = "https://pub-0c70566437df41cfb795a6a4cb09522b.r2.dev/suttacentral.db.gz";
const DB_NAME = 'suttacentral.db';
const GZIP_NAME = 'suttacentral.db.gz';

export type ProgressCallback = (progress: number, phase: 'downloading' | 'decompressing') => void;

class DatabaseService {
  private static getDocumentDirectory(): string {
    const documentDir = (FileSystem as any).documentDirectory ||
      (FileSystem as any).Paths?.document?.uri ||
      (FileSystem as any).Paths?.document?.path;
    return documentDir || '';
  }

  static async checkDatabaseExists(): Promise<boolean> {
    if (Platform.OS === 'web') return true; // Handled differently on web
    const dbPath = `${this.getDocumentDirectory()}${DB_NAME}`;
    const info = await FileSystem.getInfoAsync(dbPath);
    return info.exists;
  }

  static async initialize(onProgress: ProgressCallback): Promise<void> {
    const docDir = this.getDocumentDirectory();
    const gzipPath = `${docDir}${GZIP_NAME}`;
    const dbPath = `${docDir}${DB_NAME}`;

    // 1. Download
    const gzipInfo = await FileSystem.getInfoAsync(gzipPath);
    let hasValidGzip = false;
    
    if (gzipInfo.exists && gzipInfo.size > 0) {
      console.log('Gzip file already exists, skipping download...');
      onProgress(1, 'downloading');
      hasValidGzip = true;
    } else {
      console.log('Starting download...');
      const downloadResumable = FileSystem.createDownloadResumable(
        DB_URL,
        gzipPath,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          onProgress(progress, 'downloading');
        }
      );

      try {
        const result = await downloadResumable.downloadAsync();
        if (!result) throw new Error('Download failed');
        console.log('Download finished:', result.uri);
        hasValidGzip = true;
      } catch (err) {
        console.error('Download failed', err);
        throw err;
      }
    }

    try {
      if (!hasValidGzip) throw new Error('No valid gzip file found to decompress');

      // 2. Decompress
      onProgress(0, 'decompressing');

      const gzipData = await FileSystem.readAsStringAsync(gzipPath, {
        encoding: 'base64',
      });

      const buffer = Buffer.from(gzipData, 'base64');

      try {
        console.log('Using fflate for decompression');
        const decompressed = fflate.gunzipSync(new Uint8Array(buffer)); // This is ~200MB in memory, totally fine.
        
        // Ensure file exists before opening stream
        const fileInfo = await FileSystem.getInfoAsync(dbPath);
        if (!fileInfo.exists) {
            await FileSystem.writeAsStringAsync(dbPath, '');
        }

        const dbFile = new File(dbPath);
        
        console.log('Opening file stream...');
        const stream = dbFile.writableStream();
        const writer = stream.getWriter();
        
        console.log('Writing uncompressed database directly to filesystem...');
        await writer.write(decompressed);
        await writer.close();
        
      } catch (e) {
        console.warn('Decompression or File Stream failed:', e);
        throw new Error(`Extraction failed: ${(e as Error).message}`);
      }

      // 3. Cleanup
      await FileSystem.deleteAsync(gzipPath, { idempotent: true });
      onProgress(1, 'decompressing');
      console.log('Database initialized successfully');

    } catch (error) {
      console.error('Initialization failed:', error);
      throw error;
    }
  }

  static async deleteDatabase(): Promise<void> {
    const dbPath = `${this.getDocumentDirectory()}${DB_NAME}`;
    await FileSystem.deleteAsync(dbPath, { idempotent: true });
  }
}

export default DatabaseService;
