import ext from "./utils/ext";
import storage from "./utils/storage";

var getRegularOfferHeaderElement = (doc) => {
  return Array.from(doc.querySelectorAll('h2'))
    .filter(x => x.textContent === 'Lista ofert');
}

var containsRegularOffers = (doc) => {
  return getRegularOfferHeaderElement(doc).length > 0;
}

var scrollToRegularOffers = (timeout) => {
  setTimeout(() => {
    const header = getRegularOfferHeaderElement(document);
    if (header) {
      header[0].scrollIntoView(true);
    }
  }, timeout || 1);
}

storage.get('found', (result) => {
  if (result.found === true) {
    if (containsRegularOffers(document)) {
      scrollToRegularOffers(2000);
    }
  }
  storage.set({ found: null });

})

let state = {}

function onRequest(request, sender, sendResponse) {
  switch (request.action) {
    case 'get-state':
      return sendResponse(state);
      break;
    case 'find-regular-offers':
      if (containsRegularOffers(document)) {
        scrollToRegularOffers();
        sendResponse({ state: 'found', page: -1});
        return false;
      }
      (async () => {
        let url = new URL(document.URL);
        let page = url.searchParams.get('p') || 1;
        let response, respDoc;
        const parser = new DOMParser();
        do {
          page = parseInt(page) + 1;
          url.searchParams.set('p', page);
          state = { state: 'trying', page };
          response = await fetch(url);

          respDoc = parser.parseFromString(await response.text(), "text/html");
        } while (response.status === 200 && !containsRegularOffers(respDoc));

        // just store info about found result, after reload
        // contentscript will scroll to the result.
        storage.set({ found: true });
        window.location.href = url;

        sendResponse({ state: 'found', page });
        state = {};
      })()
      break;
  }

  return true;
}

ext.runtime.onMessage.addListener(onRequest);
