import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import allReducers from './reducers';

const reduxDevTools =
  (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) ||
  function (f) {
    return f;
  };
//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

const store = createStore(
    allReducers,
    reduxDevTools,
    applyMiddleware(
      thunkMiddleware,
      createLogger()
    )
);

export default store;