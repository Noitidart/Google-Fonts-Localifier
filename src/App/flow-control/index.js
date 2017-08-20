// @flow

import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { reducer as form } from 'redux-form'

import { fork, all } from 'redux-saga/effects'

import counter, { sagas as counterSagas } from './counter'

const sagaMiddleware = createSagaMiddleware();
const reducers = combineReducers({ counter, form });
const sagas = [ ...counterSagas ];

const store = createStore(reducers, applyMiddleware(sagaMiddleware));


function* rootSaga() {
    yield all(sagas.map(saga => fork(saga)));
}
sagaMiddleware.run(rootSaga);

// store.subscribe(function() {
//     console.log('store updated:', store.getState());
// })

export default store