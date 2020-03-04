const urls = [
 "https://allegro.pl/kategoria",
 "https://allegro.pl/listing",
 "https://allegro.pl/uzytkownik",
];

const getIcon = (tabs) => {
  const inactive = 'assets/icon-gray-32x32.png';
  const active = 'assets/icon-32x32.png';
  if (tabs.length === 0) {
    return inactive;
  }
  if (urls.some(x => (tabs[0].url || "").startsWith(x))) {
    return active;
  }
  return inactive;
};

const updateIcon = () => {
  chrome.tabs.query({active: true}, (data) => {
    chrome.browserAction.setIcon({path: getIcon(data)});
  });
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.onUpdated.addListener(() => updateIcon());
  chrome.tabs.onActivated.addListener(() => updateIcon());
});