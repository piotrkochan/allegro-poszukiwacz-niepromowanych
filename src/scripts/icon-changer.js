import ext from "./utils/ext";

function updateIcon() {
  ext.tabs.query({ active: true }, (data) => {
    let icon = 'icon-gray-32x32.png';
    if (data.length > 0) {
      const url = data[0].url;
      if (url.startsWith("https://allegro.pl/kategoria") 
      || url.startsWith("https://allegro.pl/listing")
      || (url.startsWith("https://allegro.pl/uzytkownik") && !url.endsWith('sklep'))
      ) {
        icon = 'icon-32x32.png'
      }
    }
    chrome.browserAction.setIcon({ path: "icons/" + icon });
  })
}

if (ext.tabs) {
  ext.tabs.onUpdated.addListener(() => updateIcon());
  ext.tabs.onActivated.addListener(() => updateIcon());
}