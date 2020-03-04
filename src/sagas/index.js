// import {eventChannel, END} from 'redux-saga'
import {call, takeLatest, select, put, all, delay, takeLeading, race, take} from 'redux-saga/effects'
import {found, foundOnCurrentPage, notFound, requestContentScript, scanning} from "../actions";
import {
  CHECK_IF_CONTAINS_REGULAR_OFFER,
  CONTAINS_REGULAR_OFFERS,
  DOES_NOT_CONTAINS_ANY_OFFERS,
  DOES_NOT_CONTAINS_REGULAR_OFFERS,
  FOUND,
  FOUND_ON_CURRENT_PAGE,
  GO_TO_URL, LOOKUP_CANCEL, LOOKUP_REGULAR_OFFERS, PAGE_LOADED,
  REQUEST_CONTENT_SCRIPT,
  SCROLL_TO_REGULAR_OFFER
} from "../actionTypes";
import {containsOffers, containsRegularOffers} from "../documentSelectors";

function* scan() {
  const {currentUrl} = (yield select()).lookup;
  const parser = new DOMParser();
  const url = new URL(currentUrl);
  let page = parseInt(url.searchParams.get('p') || 1, 10);
  let response, respDoc;
  do {
    page += 1;
    yield put(scanning(page));
    url.searchParams.set('p', page.toString());
    try {
      response = yield fetch(url);
      respDoc = parser.parseFromString(yield response.text(), "text/html");
    } catch (e) {
      // yield put({type: 'SCAN_ERROR'});
      return;
    }
    if (!containsOffers(respDoc)) {
      yield put(notFound());
      break;
    }
  }
  while (response.status === 200 && respDoc && !containsRegularOffers(respDoc));
  yield put(found(url.toString()))
}

function* lookupFurther() {
  yield race([
    call(scan),
    take(LOOKUP_CANCEL),
  ]);
}

function* lookup() {
  yield put(requestContentScript(CHECK_IF_CONTAINS_REGULAR_OFFER));
  const {contains, notContains, noOffers} = yield race({
    contains: take(CONTAINS_REGULAR_OFFERS),
    notContains: take(DOES_NOT_CONTAINS_REGULAR_OFFERS),
    noOffers: take(DOES_NOT_CONTAINS_ANY_OFFERS),
    timeout: delay(4000),
  });
  if (noOffers) {
    alert('ale tu nic nie ma');
    return;
  }
  if (contains) {
    yield put(foundOnCurrentPage());
    return;
  }
  if (notContains) {
    yield lookupFurther();
  }
}

function* clearContentScriptAction({payload}) {
  if (payload.action !== "") {
    yield put(requestContentScript(""));
  }
}

function* onFound({payload}) {
  yield put(requestContentScript(GO_TO_URL, payload));
  yield take(PAGE_LOADED);
  yield onFoundOnCurrentPage();

}

function* onFoundOnCurrentPage() {
  yield put(requestContentScript(SCROLL_TO_REGULAR_OFFER));
}

export default function* rootSaga() {
  take(PAGE_LOADED);
  yield all([
    takeLeading(LOOKUP_REGULAR_OFFERS, lookup),
    takeLatest(REQUEST_CONTENT_SCRIPT, clearContentScriptAction),
    takeLatest(FOUND, onFound),
    takeLatest(FOUND_ON_CURRENT_PAGE, onFoundOnCurrentPage),
  ]);
}