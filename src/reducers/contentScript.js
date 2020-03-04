import {REQUEST_CONTENT_SCRIPT} from "../actionTypes";

const initialState = {
  action: null,
  payload: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_CONTENT_SCRIPT:
      return action.payload;
    default:
      return state;
  }
};
