import ext from "./utils/ext";
import storage from "./utils/storage";

var popup = document.getElementById("app");

var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

ext.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  const url = new URL(activeTab.url);
  if (url.origin !== "https://allegro.pl" &&
    (url.pathname !== 'listing' && url.pathname.includes('/kategoria/'))) {
    return;
  }
  const requestStateInterval = setInterval(() => {
    chrome.tabs.sendMessage(activeTab.id, { action: 'get-state' }, {}, (response) => {
      if (response.state === 'trying') {
        renderMessage('szukam ofert niepromowanych na stronie: <strong>' + response.page + '</strong>...');
      }
    });
  }, 500)

  chrome.tabs.sendMessage(activeTab.id, { action: 'find-regular-offers' }, (response) => {
    if (!response || response.page === -1) {
      clearInterval(requestStateInterval);
      return window.close();
    }
    if (response.state === 'found') {
      renderMessage('Znalazłem na stronie: ' + response.page);
      clearInterval(requestStateInterval);
      return setTimeout(() => window.close(), 2000);
    }
  });

  return;
});

var optionsLink = document.querySelector(".github-link");
optionsLink.addEventListener("click", function (e) {
  e.preventDefault();
  ext.tabs.create({ 'url': 'https://github.com/piotrkochan' });
})
