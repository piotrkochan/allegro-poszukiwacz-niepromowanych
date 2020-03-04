import {Store} from 'webext-redux';
import {
  CHECK_IF_CONTAINS_REGULAR_OFFER,
  CONTAINS_REGULAR_OFFERS, DOES_NOT_CONTAINS_ANY_OFFERS,
  DOES_NOT_CONTAINS_REGULAR_OFFERS, GET_OFFERS_PAGE, GO_TO_URL, OFFERS_PAGE, PAGE_LOADED, SCROLL_TO_REGULAR_OFFER
} from "../actionTypes";
import {containsOffers, containsRegularOffers, getRegularOfferHeaderElement} from "../documentSelectors";

const proxyStore = new Store();

const scrollToRegularOffers = () => {
  const header = getRegularOfferHeaderElement(document);
  if (header) {
    const yCoordinate = header[0].getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: yCoordinate - 60,
      behavior: 'smooth'
    });
  }
};

function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState());
    if (JSON.stringify(nextState) !== JSON.stringify(currentState)) {
      currentState = nextState;
      onChange(store.dispatch, currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

proxyStore.ready().then(() => {
  proxyStore.dispatch({type: PAGE_LOADED});
  observeStore(proxyStore, state => state.contentScript, (dispatch, {action, payload}) => {
    switch (action) {
      case CHECK_IF_CONTAINS_REGULAR_OFFER:
        if (!containsOffers(document)) {
          dispatch({type: DOES_NOT_CONTAINS_ANY_OFFERS});
        } else if (containsRegularOffers(document)) {
          dispatch({type: CONTAINS_REGULAR_OFFERS});
        } else {
          dispatch({type: DOES_NOT_CONTAINS_REGULAR_OFFERS, payload: {url: document.URL}});
        }
        break;
      case SCROLL_TO_REGULAR_OFFER:
        scrollToRegularOffers();
        break;
      case GO_TO_URL:
        window.location.href = payload.url;
        scrollToRegularOffers();
        break;
      default:
        return null
    }
  })
})
;


// const anchor = document.createElement('div');
// anchor.id = 'rcr-anchor';
//
// document.body.insertBefore(anchor, document.body.childNodes[0]);
//
// const Test = ({count, dispatch}) => <>
//   <strong>{count}</strong>
//   <button onClick={() => dispatch({type: 'ADD_COUNT'})}>dispatch from content</button>
//   </>;
//
// const mapStateToProps = state => {
//   return {count: state.red}
// };
//
// const TestW = connect(mapStateToProps)(Test);
//
// storeWithMiddleware.ready().then(() => {
//   render(
//     <Provider store={storeWithMiddleware}>
//       <TestW />
//     </Provider>
//     , document.getElementById('rcr-anchor'));
// });