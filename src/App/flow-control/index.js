// @flow

import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { reducer as form } from 'redux-form'

import { fork, all } from 'redux-saga/effects'

import counter, { sagas as counterSagas } from './counter'
import downloads, { sagas as downloadsSagas } from './downloads'

const sagaMiddleware = createSagaMiddleware();
const reducers = combineReducers({ counter, downloads, form });
const sagas = [ ...counterSagas, ...downloadsSagas ];

const store = createStore(reducers, applyMiddleware(sagaMiddleware));


function* rootSaga() {
    yield all(sagas.map(saga => fork(saga)));
}
sagaMiddleware.run(rootSaga);

// store.subscribe(function() {
//     console.log('store updated:', store.getState());
// })

export default store