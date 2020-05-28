const Path = require('path');

const { defaults } = require('jest-config');
const klawSync = require('klaw-sync');
const mm = require('micromatch');

// Note: rootDir is relative to the directory containing this file.
const rootDir = './src';
const { testMatch } = defaults;

const sequentialTestPathMatchPatterns = [
  '<rootDir>/xcoobee/api/EventSubscriptionsApi.spec.js',
  '<rootDir>/xcoobee/sdk/System.spec.js',
];

const parallelTestPathIgnorePatterns = [
  // '<rootDir>/xcoobee/api/ApiAccessTokenCache.spec.js',
  // '<rootDir>/xcoobee/api/BeesApi.spec.js',
  // '<rootDir>/xcoobee/api/CampaignApi.spec.js',
  // '<rootDir>/xcoobee/api/ConsentsApi.spec.js',
  // '<rootDir>/xcoobee/api/ConversationsApi.spec.js',
  // '<rootDir>/xcoobee/api/DirectiveApi.spec.js',
  // '<rootDir>/xcoobee/api/EndPointApi.spec.js',
  // '<rootDir>/xcoobee/api/EventsApi.spec.js',
  // '<rootDir>/xcoobee/api/FileApi.spec.js',
  // '<rootDir>/xcoobee/api/InboxApi.spec.js',
  // '<rootDir>/xcoobee/api/PolicyApi.spec.js',
  // '<rootDir>/xcoobee/api/TokenApi.spec.js',
  // '<rootDir>/xcoobee/api/UsersApi.spec.js',
  // '<rootDir>/xcoobee/api/UsersCache.spec.js',
  // '<rootDir>/xcoobee/sdk/Bees.spec.js',
  // '<rootDir>/xcoobee/sdk/Consents.spec.js',
  // '<rootDir>/xcoobee/sdk/Inbox.spec.js',
  // '<rootDir>/xcoobee/sdk/Users.spec.js',
];

let testPathIgnorePatterns = [
  ...parallelTestPathIgnorePatterns,
  ...sequentialTestPathMatchPatterns,
];

const sequential = process.argv.includes('--runInBand');
if (sequential) {
  const absRootDir = Path.resolve(__dirname, rootDir);
  let filenames = klawSync(absRootDir, { nodir: true })
    .map((file) => file.path)
    .map((file) => file.replace(absRootDir, ''))
    .map((file) => file.replace(/\\/g, '/'))
    .map((file) => `<rootDir>${file}`);
  filenames = mm(filenames, testMatch);
  testPathIgnorePatterns = mm.not(filenames, sequentialTestPathMatchPatterns);
}

module.exports = {
  rootDir,
  setupFiles: [
    '../setup.js',
  ],
  testMatch,
  testPathIgnorePatterns,
};
