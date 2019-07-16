import ext from "./utils/ext";

let popup = document.getElementById("app");

let renderMessage = (message) => {
  let displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
};

ext.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let activeTab = tabs[0];
  const url = new URL(activeTab.url);
  if (url.origin !== "https://allegro.pl" &&
    (url.pathname !== 'listing' && url.pathname.includes('/kategoria/'))) {
    return;
  }
  const requestStateInterval = setInterval(() => {
    chrome.tabs.sendMessage(activeTab.id, { action: 'get-state' }, {}, (response) => {
      if (response.state === 'trying') {
        renderMessage('szukam niepropowanych na stronie: <strong>' + response.page + '</strong>...');
      }
    });
  }, 500);

  chrome.tabs.sendMessage(activeTab.id, { action: 'find-regular-offers' }, (response) => {
    if (!response) {
      clearInterval(requestStateInterval);
      return window.close();
    }
    if (response.state === 'found') {
      clearInterval(requestStateInterval);
      if (response.page > 0) {
        renderMessage('Znaleziono na stronie: ' + response.page);
        return setTimeout(() => window.close(), 2000);
      } else {
        renderMessage('Znaleziono na aktualnej stronie');
        return setTimeout(() => window.close(), 1000);
      }
    }
  });
});

const optionsLink = document.querySelector(".github-link");

optionsLink.addEventListener("click", (event) => {
  event.preventDefault();
  ext.tabs.create({ 'url': 'https://github.com/piotrkochan/allegro-poszukiwacz-niepromowanych' });
});
