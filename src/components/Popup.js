import React from 'react';
import {connect} from 'react-redux';

const Popup = ({dispatch, scanningPage}) => {
  return <>
    <strong>Scanning page: {scanningPage}</strong>
    <button onClick={() => dispatch({type: "LOOKUP_REGULAR_OFFERS"})}>Search offers</button>
  </>
};
const mapStateToProps = state => ({
  scanningPage: state.lookup.scanningPage
});
export default connect(mapStateToProps)(Popup);