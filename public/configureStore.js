import { createStore, combineReducers } from 'redux';

import AuthReducer from './reducers/AuthReducer.js';

export default () => createStore(combineReducers({
    auth: AuthReducer
}));