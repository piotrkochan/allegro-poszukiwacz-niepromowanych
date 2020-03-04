import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga'
import {wrapStore} from 'webext-redux';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware()
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

wrapStore(store);

// const scrollOffset = 70;
//
// const getRegularOfferHeaderElement = (doc) => {
//   return Array.from(doc.querySelectorAll('h2'))
//     .filter(x => x.textContent === 'Oferty');
// };
//
// const containsRegularOffers = (doc) => {
//   return getRegularOfferHeaderElement(doc).length > 0;
// };
//
// const scrollToRegularOffers = () => {
//   const header = getRegularOfferHeaderElement(document);
//   if (header) {
//     const yCoordinate = header[0].getBoundingClientRect().top + window.pageYOffset;
//
//     window.scrollTo({
//       top: yCoordinate - scrollOffset,
//       behavior: 'smooth'
//     });
//   }
// };
//
// chrome.storage.get('found', (result) => {
//   if (result.found === true) {
//     if (containsRegularOffers(document)) {
//       scrollToRegularOffers(2000);
//     }
//   }
//   chrome.storage.set({ found: null });
// });
//
// let state = {};
//
// function onRequest(request, sender, sendResponse) {
//   switch (request.action) {
//     case 'get-state':
//       return sendResponse(state);
//     case 'check-page-contains-offers':
//       const found = document.querySelector('.opbox-listing--base') !== null;
//       return sendResponse({ found });
//     case 'find-regular-offers':
//       if (containsRegularOffers(document)) {
//         scrollToRegularOffers();
//         sendResponse({ state: 'found', page: -1 });
//         return false;
//       }
//       (async () => {
//         let url = new URL(document.URL);
//         let page = url.searchParams.get('p') || 1;
//         let response, respDoc;
//         const parser = new DOMParser();
//         do {
//           page = parseInt(page) + 1;
//           url.searchParams.set('p', page);
//           state = { state: 'trying', page };
//           response = await fetch(url);
//
//           respDoc = parser.parseFromString(await response.text(), "text/html");
//         } while (response.status === 200 && !containsRegularOffers(respDoc));
//
//         // just store info about found result, after reload
//         // content script will scroll to the result.
//         storage.set({ found: true });
//         window.location.href = url;
//
//         sendResponse({ state: 'found', page });
//         state = {};
//       })();
//       break;
//   }
//
//   return true;
// }
//
// chrome.runtime.onMessage.addListener(onRequest);