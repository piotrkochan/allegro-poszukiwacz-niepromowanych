// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: (process.env.NODE_ENV || "development"),
  TARGET: (process.env.TARGET || 'chrome'),
  ARCHIVE_DIST: (process.env.ARCHIVE_DIST || false),
  PORT: (process.env.PORT || 3000)
};
