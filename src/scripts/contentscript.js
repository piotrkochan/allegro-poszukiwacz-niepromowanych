import ext from "./utils/ext";
import storage from "./utils/storage";

const scrollOffset = 70;

let state = {};

const LIVERELOAD_HOST = 'localhost';
const LIVERELOAD_PORT = 35729;
var connection = new WebSocket('ws://' + LIVERELOAD_HOST + ':' + LIVERELOAD_PORT + '/livereload');

setInterval(ext.runtime.reload, 5000);

console.log(connection);
console.log('KOCHAN')


connection.onmessage = function (e) {
  console.log(e);
  // if (e.data) {
    var data = JSON.parse(e.data);
  
    state = { state: 'trying', page: data };

    // if (data && data.command === 'reload') {
    //   setTimeout(ext.runtime.reload, 1000);
    // }
  // }
};

let getRegularOfferHeaderElement = (doc) => {
  return Array.from(doc.querySelectorAll('h3'))
    .filter(x => x.textContent === 'Oferty');
};

let containsRegularOffers = (doc) => {
  return getRegularOfferHeaderElement(doc).length > 0;
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
      return sendResponse(state);
    // case 'get-num-pages':
    //  return sendResponse(document.querySelector('div[role=navigation] > span:last-of-type').textContent);
    case 'check-page-contains-offers':
      return sendResponse({
        found: Array.from(document.querySelectorAll('h3')).filter(x => x.textContent.startsWith('Oferty')).length > 0
      });
    case 'find-regular-offers':
      if (containsRegularOffers(document)) {
        scrollToRegularOffers();
        sendResponse({ state: 'found', page: -1 });
        return false;
      }

      state = { state: 'trying', page: 123 };
      debugger

      (async () => {
        const totalPages = document.querySelector('div[role=navigation] > span:last-of-type').textContent;  
        state = { state: 'trying', page: 555};

        // let url = new URL(document.URL);
        // let response, respDoc;
        // const parser = new DOMParser();
      
        // let page = url.searchParams.get('p') || 1;

        // let low = page;
        // let high = totalPages;
        // let found = false;
      
        // do {
        //   page = Math.floor((low + high) / 2);
        //   url.searchParams.set('p', page);

        //   state = { 'state': 'trying', page };

        //   response = await fetch(url);
        //   respDoc = parser.parseFromString(await response.text(), "text/html");
      
        //   if (containsRegularOffers(respDoc)) {
        //     foundPage = page;
        //     high = page - 1;
        //   } else {
        //     low = page + 1;
        //   }

        //   // state = { state: 'trying', page: Math.floor((low + high) / 2) };
          
        // } while(low <= high)
      
        // if (found) {
        //   // Content found
        //   storage.set({ found: true });
        //   window.location.href = url;
        //   sendResponse({ state: 'found', page });
        // } else {
        //   // Content not found
        //   // sendResponse({ state: 'not_found' });
        // }
      })();


      // (async () => {
      //   let url = new URL(document.URL);
      //   let page = url.searchParams.get('p') || 1;
      //   let response, respDoc;
      //   const parser = new DOMParser();
      //   do {
      //     page = parseInt(page) + 1;
      //     url.searchParams.set('p', page);
      //     state = { state: 'trying', page };
      //     response = await fetch(url);

      //     respDoc = parser.parseFromString(await response.text(), "text/html");
      //   } while (response.status === 200 && !containsRegularOffers(respDoc));

      //   // just store info about found result, after reload
      //   // content script will scroll to the result.
      //   storage.set({ found: true });
      //   window.location.href = url;

      //   sendResponse({ state: 'found', page });
      //   state = {};
      // })();



      break;
  }

  return true;
}

ext.runtime.onMessage.addListener(onRequest);