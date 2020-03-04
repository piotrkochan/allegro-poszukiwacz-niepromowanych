import {FOUND, FOUND_ON_CURRENT_PAGE, NOT_FOUND, REQUEST_CONTENT_SCRIPT, SCANNING} from "./actionTypes";

export const requestContentScript = (action, payload) => ({type: REQUEST_CONTENT_SCRIPT, payload: {action, payload}});
export const scanning = page => ({type: SCANNING, payload: {page}});
export const found = url => ({type: FOUND, payload: {url}});
export const foundOnCurrentPage = () => ({type: FOUND_ON_CURRENT_PAGE});
export const notFound = () => ({type: NOT_FOUND});