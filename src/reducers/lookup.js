import {
  CONTAINS_REGULAR_OFFERS,
  DOES_NOT_CONTAINS_REGULAR_OFFERS,
  SCANNING
} from "../actionTypes";

export const LookupStatus = {
  Scanning: 0,
  Found: 1,
  NotFound: 2
};

const initialState = {
  foundOnCurrent: false,
  scanningPage: 0,
  currentUrl: null,
  status: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTAINS_REGULAR_OFFERS:
      return {...state, foundOnCurrent: true};
    case DOES_NOT_CONTAINS_REGULAR_OFFERS:
      return {...state, foundOnCurrent: false, currentUrl: action.payload.url};
    case SCANNING:
      return {...state, scanningPage: action.payload.page};
    default:
      return state;
  }
};
