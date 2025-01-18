const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  url: require.resolve('react-native-url-polyfill'),
};

module.exports = defaultConfig;
