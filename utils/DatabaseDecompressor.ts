import * as Asset from 'expo-asset';
import * as ExpoConstants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

// Import fzstd for decompression

/**
 * Decompress database from compressed asset to device storage
 * Supports both zstd and gzip compression
 */
export class DatabaseDecompressor {
  private static readonly DB_NAME = 'suttacentral.db';
  private static readonly ZSTD_NAME = 'suttacentral.db.zst';
  private static readonly GZIP_NAME = 'suttacentral.db.gz';
  private static readonly ASSET_NAME = 'suttacentral_db_gz';

  /**
   * Get document directory path
   */
  private static getDocumentDirectory(): string {
    if (Platform.OS === 'web') {
      return '/';
    }
    
    // Try multiple approaches to get the document directory
    const documentDirectory = (FileSystem as any).documentDirectory || 
                            (FileSystem as any).bundleDirectory ||
                            (ExpoConstants.default?.expoFileSystem?.documentDirectory) ||
                            '';
    
    if (!documentDirectory) {
      console.error('Document directory not available');
      throw new Error('Document directory is unavailable');
    }
    
    console.log('Document directory:', documentDirectory);
    return documentDirectory;
  }

  /**
   * Check if database exists on device storage
   */
  static async databaseExists(): Promise<boolean> {
    const fileInfo = await FileSystem.getInfoAsync(
      `${this.getDocumentDirectory()}${this.DB_NAME}`
    );
    return fileInfo.exists;
  }

  /**
   * Copy compressed asset to device storage
   */
  private static async copyCompressedAsset(compressionType: 'zstd' | 'gzip'): Promise<void> {
    const assetName = compressionType === 'zstd' ? this.ZSTD_NAME : this.GZIP_NAME;
    const documentDir = this.getDocumentDirectory();
    const destinationPath = `${documentDir}${assetName}`;
    
    try {
      console.log(`Loading asset: ${assetName}`);
      console.log(`Document directory: ${documentDir}`);
      console.log(`Destination path: ${destinationPath}`);
      
      // Check if destination directory exists
      const dirInfo = await FileSystem.getInfoAsync(documentDir);
      console.log('Document directory exists:', dirInfo.exists);
      
      // Use expo-asset to load the gzip asset
      try {
        console.log('Loading asset using expo-asset...');
        const asset = Asset.Asset.fromModule(`../assets/databases/${this.ASSET_NAME}`);
        console.log(`Asset created: ${typeof asset}`);
        
        // Download the asset if needed
        await asset.downloadAsync();
        console.log(`Asset downloaded, localUri: ${asset.localUri}`);
        
        // Copy the asset to device storage
        if (asset.localUri) {
          await FileSystem.copyAsync({
            from: asset.localUri,
            to: destinationPath,
          });
          console.log(`Successfully copied ${assetName} using expo-asset`);
        } else {
          throw new Error('Asset localUri is undefined');
        }
      } catch (assetError) {
        console.warn(`Failed to load ${assetName} via expo-asset:`, assetError);
        
        // Fallback to require() approach
        console.log('Trying require() fallback...');
        const assetModule = require(`../assets/databases/${this.ASSET_NAME}`);
        console.log(`Asset loaded via require(), type: ${typeof assetModule}`);
        
        // Write the asset data to device storage
        await FileSystem.writeAsStringAsync(destinationPath, assetModule, {
          encoding: 'base64',
        });
        
        console.log(`Successfully wrote ${assetName} from require() to device storage`);
      }
      
      console.log(`Successfully processed ${assetName}`);
    } catch (error) {
      console.error(`Failed to copy ${assetName}:`, error);
      throw new Error(`Failed to copy ${assetName}: ${(error as Error).message}`);
    }
  }

  /**
   * Decompress zstd file using fzstd (pure JavaScript)
   */
  private static async decompressZstd(): Promise<void> {
    const zstdPath = `${this.getDocumentDirectory()}${this.ZSTD_NAME}`;
    const dbPath = `${this.getDocumentDirectory()}${this.DB_NAME}`;

    try {
      console.log('Decompressing zstd file with fzstd...');
      
      // Import fzstd (pure JavaScript implementation)
      const { decompress } = require('fzstd');
      
      // Read the compressed file as base64
      const compressedData = await FileSystem.readAsStringAsync(zstdPath, {
        encoding: 'base64',
      });
      
      // Convert to binary Buffer
      const binaryData = Buffer.from(compressedData, 'base64');
      
      // Decompress using fzstd
      const decompressed = decompress(binaryData);
      
      // Write decompressed database as base64
      await FileSystem.writeAsStringAsync(dbPath, Buffer.from(decompressed).toString('base64'), {
        encoding: 'base64',
      });
      
      console.log('Successfully decompressed zstd file');
    } catch (error) {
      console.error('Failed to decompress zstd file:', error);
      throw new Error(`Failed to decompress zstd file: ${(error as Error).message}`);
    }
  }

  /**
   * Decompress gzip file using built-in Node.js zlib
   */
  private static async decompressGzip(): Promise<void> {
    const gzipPath = `${this.getDocumentDirectory()}${this.GZIP_NAME}`;
    const dbPath = `${this.getDocumentDirectory()}${this.DB_NAME}`;

    try {
      console.log('Decompressing gzip file...');
      
      // Read gzip file as base64
      const gzipData = await FileSystem.readAsStringAsync(gzipPath, {
        encoding: 'base64',
      });

      // Convert base64 to binary
      const binaryData = Buffer.from(gzipData, 'base64');

      // Decompress using Node.js zlib (available in React Native)
      const zlib = require('zlib');
      const decompressed = zlib.gunzipSync(binaryData);

      // Write decompressed data as base64
      await FileSystem.writeAsStringAsync(dbPath, decompressed.toString('base64'), {
        encoding: 'base64',
      });

      console.log('Gzip decompression completed');
    } catch (error) {
      console.error('Gzip decompression failed:', error);
      throw error;
    }
  }

  /**
   * Initialize database on first launch
   * Tries gzip first (more reliable), falls back to zstd
   */
  static async initializeDatabase(): Promise<void> {
    if (await this.databaseExists()) {
      console.log('Database already exists');
      return;
    }

    console.log('Initializing database...');

    // Try gzip first (more reliable and faster)
    try {
      await this.copyCompressedAsset('gzip');
      await this.decompressGzip();
      console.log('Database initialized with gzip compression');
      return;
    } catch (gzipError) {
      console.warn('Gzip initialization failed, trying zstd:', gzipError);
    }

    // Fallback to zstd
    try {
      await this.copyCompressedAsset('zstd');
      await this.decompressZstd();
      console.log('Database initialized with zstd compression (fzstd)');
    } catch (zstdError) {
      console.error('Zstd initialization also failed:', zstdError);
      throw new Error('Failed to initialize database with both gzip and zstd');
    }
  }

  /**
   * Clean up compressed files after successful decompression
   */
  static async cleanupCompressedFiles(): Promise<void> {
    const files = [this.ZSTD_NAME, this.GZIP_NAME];
    
    for (const fileName of files) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(
          `${this.getDocumentDirectory()}${fileName}`
        );
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(`${this.getDocumentDirectory()}${fileName}`);
          console.log(`Cleaned up ${fileName}`);
        }
      } catch (error) {
        console.warn(`Failed to clean up ${fileName}:`, error);
      }
    }
  }
}

/**
 * Usage example:
 * 
 * import { DatabaseDecompressor } from './utils/DatabaseDecompressor';
 * 
 * // In your app initialization
 * try {
 *   await DatabaseDecompressor.initializeDatabase();
 *   await DatabaseDecompressor.cleanupCompressedFiles();
 *   // Now you can open the database normally
 *   const db = SQLite.openDatabase('suttacentral.db');
 * } catch (error) {
 *   console.error('Database initialization failed:', error);
 * }
 */
