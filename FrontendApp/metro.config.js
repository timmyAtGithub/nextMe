const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname, {
  resolver: {
    unstable_enablePackageExports: true
  }
});

config.transformer.unstable_allowRequireContext = true;
config.resolver.unstable_enablePackageExports = true;

module.exports = config;