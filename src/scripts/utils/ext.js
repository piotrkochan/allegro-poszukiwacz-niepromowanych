const apis = [
  'alarms',
  'bookmarks',
  'browserAction',
  'commands',
  'contextMenus',
  'cookies',
  'downloads',
  'events',
  'extension',
  'extensionTypes',
  'history',
  'i18n',
  'idle',
  'notifications',
  'pageAction',
  'runtime',
  'storage',
  'tabs',
  'webNavigation',
  'webRequest',
  'windows',
];

let extension = {}

apis.forEach(function (api) {
  try {
    if (chrome[api]) {
      extension = Object.assign(extension, {[api]: chrome[api]})
    }
  } catch (e) {}

  try {
    if (window[api]) {
      extension = Object.assign(extension, {[api]: window[api]})
    }
  } catch (e) {}

  try {
    if (browser[api]) {
      extension = Object.assign(extension, {[api]: browser[api]})
    }
  } catch (e) {}

  try {
    if (browser && browser.browserAction) {
      this.browserAction = browser.browserAction
    }
  } catch (e) {}

});

try {
  if (browser && browser.runtime) {
    extension.runtime = browser.runtime
  }
} catch (e) {}

try {
  if (browser && browser.browserAction) {
    extension.browserAction = browser.browserAction
  }
} catch (e) {}

module.exports = extension;