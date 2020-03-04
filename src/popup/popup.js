import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Store} from 'webext-redux';
import Popup from "../components/Popup";

const store = new Store();

store.ready().then(() => {
  render(
    <Provider store={store}>
      <Popup/>
    </Provider>
    , document.getElementById('root')
  );
});
