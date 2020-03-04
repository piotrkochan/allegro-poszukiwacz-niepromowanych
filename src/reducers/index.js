import {combineReducers} from 'redux';

import lookup from './lookup';
import contentScript from './contentScript';

export default combineReducers({
  lookup,
  contentScript
});