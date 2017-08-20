// @flow

import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects'

import { requestDownload } from '../downloads'

import { getFont, extractUrls } from './utils'

import type { Font } from './types'

export type Shape = {
    lastId: number,
    entries: Font[]
}

const INITIAL = {
    lastId: -1,
    entries: []
}
export const sagas = [];

const A = ([actionType]: string[]) => 'FONTS_' + actionType; // Action type prefixer

//
const ADD = A`ADD`;
type AddAction = { type:typeof ADD, font:Font };
function add(font: Font): AddAction {
    return {
        type: ADD,
        font
    }
}

//
const INCREMENT = A`INCREMENT`;
type IncrementAction = { type:typeof INCREMENT };
function increment(): IncrementAction {
    return {
        type: INCREMENT
    }
}

//
const REQUEST = A`REQUEST`;
type RequestAction = { type:typeof REQUEST, url:string, css:string, promise:*, resolve:*, reject:* };
export function requestFontAdd(url: string, css: string): RequestAction {
    let resolve, reject;
    return {
        type: REQUEST,
        url,
        css,
        promise: new Promise( (...args)=>([resolve,reject] = args) ),
        resolve,
        reject
    }
}
const requestWorker = function* requestWorker(action: RequestAction) {
    const { url, css, resolve, reject } = action;
    let { fonts:state } = yield select();

    const duplicate = getFont(url, state);
    console.log('duplicate:', duplicate);
    if (duplicate) {
        console.log('requestWorker, discarding font as already there, duplicate:', duplicate);
        console.log('reject:', reject);
        reject(duplicate.id);
        return;
    }

    console.log('fonts, lastId will increment, it is now:', state.lastId);
    yield put(increment());
    ({ fonts:state } = yield select());
    console.log('fonts, lastId incremented, it is now:', state.lastId)
    const id = state.lastId;
    resolve(id); // resolve meaning request was accepted


    const downloadIds = yield all(extractUrls(css).map(function*(url) {
        // resolves with downloadId if download created, rejects if already exists
        try {
            const action = yield put(requestDownload(url));
            return yield action.promise;
        } catch(ex) {
            console.log(`ex when getting downloadId for downloadUrl of "${url}" ex:`, ex);
            return ex;
        }
    }));

    yield put(add({ id, url, css, downloadIds }));

}
const requestWatcher = function* requestWatcher() {
    yield takeEvery(REQUEST, requestWorker);
}
sagas.push(requestWatcher);

//
type Action =
  | AddAction
  | IncrementAction
  | RequestAction;

export default function reducer(state: Shape = INITIAL, action: Action) {
    switch(action.type) {
        case INCREMENT: {
            return {
                ...state,
                lastId: state.lastId + 1
            }
        }
        case ADD: {
            const { font } = action;
            return {
                ...state,
                entries: [...state.entries, font]
            }
        }
        default: return state;
    }
}