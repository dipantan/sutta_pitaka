// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for database file extensions
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db',
  // Adds support for `.gz` files for gzip compressed databases
  'gz',
  // Adds support for `.zst` files for compressed databases
  'zst'
);

module.exports = config;
