import ext from "./utils/ext";
import storage from "./utils/storage";

const scrollOffset = 70;

const initialState = {
  state: '',
  page: -1,
  lookupMap: {}
};

let searchState = initialState;

let getRegularOfferHeaderElement = (doc) => {
  return  Array.from(doc.querySelectorAll('h2'))
    .concat(Array.from(doc.querySelectorAll('h3')))
    .filter(x => x.textContent === 'Oferty');
};

let containsAnyOffers = (doc) => {
  return Array.from(doc.querySelectorAll('h2'))
    .concat(Array.from(doc.querySelectorAll('h3')))
    .filter(x => x.textContent.startsWith('Oferty'))
    .length > 0;
};

let containsRegularOffers = (doc) => {
  return getRegularOfferHeaderElement(doc).length > 0; // && document.querySelectorAll('article[data-role=offer]').length <= 60;
};

let scrollToRegularOffers = () => {
  const header = getRegularOfferHeaderElement(document);
  if (header) {
    const yCoordinate = header[0].getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: yCoordinate - scrollOffset,
      behavior: 'smooth'
    });
  }
};

storage.get('found', (result) => {
  if (result.found === true) {
    if (containsRegularOffers(document)) {
      scrollToRegularOffers(2000);
    }
  }
  storage.set({ found: null });
});

function onRequest(request, sender, sendResponse) {
  switch (request.action) {
    case 'get-state':
      return sendResponse(searchState);
    case 'check-page-contains-offers':
      return sendResponse({
        found: containsAnyOffers(document)
      });
    case 'find-regular-offers':
      if (containsRegularOffers(document)) {
        scrollToRegularOffers();
        sendResponse({ state: 'found', page: -1 });
        return false;
      }
      (async () => {
        let left = 1;
        let right = parseInt(document.querySelector('div[role=navigation] > span:last-of-type').textContent);

        const parser = new DOMParser();
        let response, respDoc;

        let url;
        let foundOn = -1;

        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          searchState = { ...searchState, state: 'searching', page: mid };

          url = new URL(document.URL);
          url.searchParams.set('p', mid);

          response = await fetch(url);
          respDoc = parser.parseFromString(await response.text(), "text/html");

          if (response.status === 429) {
            window.location.href = url;
            break;
          }
          if (containsRegularOffers(respDoc)) {
            foundOn = mid;
            right = mid - 1;
          } else {
            left = mid + 1;
          }
        }
        if (foundOn > 1) {
          sendResponse({ state: 'found', page: foundOn });
          storage.set({ found: true });
          window.location.href = url;
        }
      })();
      break;
  }
  return true;
}

ext.runtime.onMessage.addListener(onRequest);
