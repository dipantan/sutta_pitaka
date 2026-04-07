import { DatabaseDecompressor } from '../utils/DatabaseDecompressor';

/**
 * Test script for database decompression
 * Run this to verify the decompression logic works before integration
 */
export const testDatabaseDecompression = async () => {
  console.log('Testing database decompression...');
  
  try {
    // Check if database already exists
    const exists = await DatabaseDecompressor.databaseExists();
    console.log('Database exists:', exists);
    
    if (exists) {
      console.log('Database already exists, skipping decompression test');
      return;
    }
    
    // Test initialization
    console.log('Starting decompression...');
    await DatabaseDecompressor.initializeDatabase();
    console.log('Decompression completed successfully');
    
    // Test cleanup
    await DatabaseDecompressor.cleanupCompressedFiles();
    console.log('Cleanup completed');
    
    // Verify database exists now
    const existsAfter = await DatabaseDecompressor.databaseExists();
    console.log('Database exists after decompression:', existsAfter);
    
    if (existsAfter) {
      console.log('Database decompression test PASSED');
    } else {
      console.error('Database decompression test FAILED');
    }
  } catch (error) {
    console.error('Database decompression test FAILED:', error);
    throw error;
  }
};

// Uncomment to run test
// testDatabaseDecompression();
