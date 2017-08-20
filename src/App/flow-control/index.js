// @flow

import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { reducer as form } from 'redux-form'

import { fork, all } from 'redux-saga/effects'

import counter, { sagas as counterSagas } from './counter'
import downloads, { sagas as downloadsSagas } from './downloads'
import fonts, { sagas as fontsSagas } from './fonts'

import type { Shape as CounterShape } from './counter'
import type { Shape as DownloadsShape } from './downloads'
import type { Shape as FontsShape } from './fonts'

export type Shape = {
    counter: CounterShape,
    downloads: DownloadsShape,
    fonts: FontsShape
}

const sagaMiddleware = createSagaMiddleware();
const reducers = combineReducers({ counter, downloads, fonts, form });
const sagas = [ ...counterSagas, ...downloadsSagas, ...fontsSagas ];

const store = createStore(reducers, applyMiddleware(sagaMiddleware));


function* rootSaga() {
    yield all(sagas.map(saga => fork(saga)));
}
sagaMiddleware.run(rootSaga);

store.subscribe(function() {
    console.log('store updated:', store.getState());
})

export default store