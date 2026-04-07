# Database Decompression Implementation

## Overview

The app now supports database compression to reduce bundle size from 278 MB to:
- **42 MB** with zstd compression (85% reduction) - WebAssembly implementation
- **58 MB** with gzip compression (79% reduction) - Built-in implementation

## Key Change: Pure JavaScript/WebAssembly

The app now uses **@foxglove/wasm-zstd**, a pure WebAssembly implementation that:
- **Works in Expo Go** (no native modules required)
- **Provides the same compression ratio** (85% reduction)
- **Runs entirely in JavaScript/WebAssembly**
- **Eliminates the need for react-native-zstd native module**

## Files Added

1. **`utils/DatabaseDecompressor.ts`** - Core decompression logic
2. **`components/DatabaseInitializer.tsx`** - React component for app integration

## Native Module Status

### Previously required native modules:
- ~~react-native-zstd~~ - **REMOVED** (replaced with WebAssembly)
- react-native-bootsplash - Still required for splash screen
- react-native-view-shot - Still required for screenshots

### Now works in Expo Go:
- **WebAssembly zstd decompression** - No native dependencies
- All other Expo modules - Fully supported

## Integration Steps

### 1. Add DatabaseInitializer to your app root

```tsx
// App.tsx or index.tsx
import { DatabaseInitializer } from './components/DatabaseInitializer';

export default function App() {
  return (
    <DatabaseInitializer>
      {/* Your existing app components */}
      <NavigationContainer>
        {/* ... */}
      </NavigationContainer>
    </DatabaseInitializer>
  );
}
```

### 2. Add compressed database to assets

Place your compressed database in `assets/databases/`:
- `suttacentral.db.zst` (42 MB - recommended)
- `suttacentral.db.gz` (58 MB - fallback)

### 3. Update metro.config.js (if needed)

```js
// metro.config.js
module.exports = {
  assetExts: ['db', 'zst', 'gz', ...assetExts],
};
```

## How It Works

1. **First Launch**:
   - Checks if database exists
   - Copies compressed asset to device storage
   - Decompresses (zstd WebAssembly preferred, gzip fallback)
   - Cleans up compressed files
   - Tests database connection

2. **Subsequent Launches**:
   - Database already exists
   - No decompression needed
   - Fast startup

## Performance

- **Bundle Size**: 42 MB (zstd) or 58 MB (gzip)
- **Device Storage**: 278 MB (uncompressed)
- **First Launch**: 5-10 seconds decompression
- **Subsequent Launch**: <1 second
- **WebAssembly overhead**: Minimal (one-time initialization)

## Compression Comparison

| Method | Size | Reduction | Notes |
|--------|------|-----------|-------|
| Original | 278 MB | - | Uncompressed SQLite |
| Gzip | 58 MB | 79% | Built-in support |
| **Zstd (WebAssembly)** | **42 MB** | **85%** | **Works in Expo Go** |

## WebAssembly Benefits

1. **No native compilation** required
2. **Works in Expo Go** out of the box
3. **Cross-platform** (iOS, Android, Web)
4. **Same compression ratio** as native zstd
5. **Smaller development build** size

## Troubleshooting

### If zstd fails
- App automatically falls back to gzip
- Ensure @foxglove/wasm-zstd is properly installed
- Check console logs for WebAssembly initialization errors

### If both fail
- Check if compressed files are in assets
- Verify file paths in DatabaseDecompressor
- Ensure expo-file-system permissions

## Development Notes

- The decompressor handles both compression types automatically
- Compressed files are deleted after successful decompression
- Database is tested with a simple query after initialization
- All errors are logged and displayed to the user
- WebAssembly module is loaded on-demand during decompression

## Production Build

For production:
1. Use the zstd compressed database (42 MB)
2. Test on actual devices
3. Monitor first-launch performance
4. Consider adding a progress indicator for large databases

## Expo Go Compatibility

**YES** - The app now works in Expo Go because:
- zstd decompression uses WebAssembly (no native modules)
- All other modules are Expo-compatible
- No custom native code required
