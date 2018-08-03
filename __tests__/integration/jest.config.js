module.exports = {
  // Note: rootDir is relative to the directory containing this file.
  rootDir: './src',
  setupFiles: [
    '../setup.js',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/xcoobee/api/BeesApi.spec.js',
    '<rootDir>/xcoobee/api/CampaignApi.spec.js',
    '<rootDir>/xcoobee/api/ConversationsApi.spec.js',
    '<rootDir>/xcoobee/api/EndPointApi.spec.js',
    '<rootDir>/xcoobee/api/EventsApi.spec.js',
    '<rootDir>/xcoobee/api/EventSubscriptionsApi.spec.js',
    '<rootDir>/xcoobee/api/FileApi.spec.js',
    '<rootDir>/xcoobee/api/PolicyApi.spec.js',
    '<rootDir>/xcoobee/api/TokenApi.spec.js',
    '<rootDir>/xcoobee/api/UsersApi.spec.js',
    '<rootDir>/xcoobee/sdk/ApiAccessTokenCache.spec.js',
    '<rootDir>/xcoobee/sdk/Bees.spec.js',
    '<rootDir>/xcoobee/sdk/Consents.spec.js',
    '<rootDir>/xcoobee/sdk/System.spec.js',
    '<rootDir>/xcoobee/sdk/Users.spec.js',
    '<rootDir>/xcoobee/sdk/UsersCache.spec.js',
  ],
};
