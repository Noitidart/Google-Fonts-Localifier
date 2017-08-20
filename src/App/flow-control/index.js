// @flow

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { reducer as form } from 'redux-form'

import { fork, all } from 'redux-saga/effects'

import counter, { sagas as counterSagas } from './counter'
import downloads, { sagas as downloadsSagas } from './downloads'
import fonts, { sagas as fontsSagas } from './fonts'
import rehydrated from './rehydrated'

import type { Shape as CounterShape } from './counter'
import type { Shape as DownloadsShape } from './downloads'
import type { Shape as FontsShape } from './fonts'
import type { Shape as RehydratedShape } from './rehydrated'

export type Shape = {
    counter: CounterShape,
    downloads: DownloadsShape,
    fonts: FontsShape,
    rehydrated: RehydratedShape
}

const sagaMiddleware = createSagaMiddleware();
const reducers = combineReducers({ counter, downloads, fonts, form, rehydrated });
const sagas = [ ...counterSagas, ...downloadsSagas, ...fontsSagas ];

const store = createStore(reducers, compose(applyMiddleware(sagaMiddleware), autoRehydrate()));

function* rootSaga() {
    yield all(sagas.map(saga => fork(saga)));
}
sagaMiddleware.run(rootSaga);

export const persist = persistStore(store, { blacklist:['form','rehydrated'] });

// store.subscribe(function() {
//     console.log('store updated:', store.getState());
// })

export default store