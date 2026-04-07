import * as SQLite from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { DatabaseDecompressor } from '../utils/DatabaseDecompressor';

// Try to import RNBootSplash, but don't fail if it's not available
let RNBootSplash: any = null;
try {
  RNBootSplash = require('react-native-bootsplash');
} catch (error) {
  console.log('RNBootSplash not available (expected in Expo Go)');
}

/**
 * Database initialization component
 * Handles decompression and setup of the SQLite database
 */
export const DatabaseInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Starting database initialization...');
        
        // Initialize and decompress the database
        await DatabaseDecompressor.initializeDatabase();
        
        // Clean up compressed files to save space
        await DatabaseDecompressor.cleanupCompressedFiles();
        
        // Test database connection
        const db = SQLite.openDatabaseSync('suttacentral.db');
        
        // Simple test query
        try {
          const result = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM suttas');
          const count = result?.count || 0;
          console.log(`Database initialized successfully with ${count} suttas`);
          
          // Hide boot splash after successful initialization (if available)
          if (RNBootSplash && RNBootSplash.hide) {
            RNBootSplash.hide({ fade: true }).catch((error: Error) => {
              console.warn('[bootsplash] hide failed', error);
            });
          }
          
          setIsInitializing(false);
        } catch (testError) {
          console.error('Database test query failed:', testError);
          setError('Database test failed');
          setIsInitializing(false);
        }
        
      } catch (err) {
        console.error('Database initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Initializing database...</Text>
        <Text style={{ marginTop: 8, fontSize: 12, opacity: 0.6 }}>
          This may take a moment on first launch
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', fontSize: 16, marginBottom: 16 }}>Database Error</Text>
        <Text style={{ textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  return <>{children}</>;
};
