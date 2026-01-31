const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Workaround for Windows path issue
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;