// @flow

import { takeEvery, select, call, put, fork } from 'redux-saga/effects'

import { getDownload, blobToDataUrl } from './utils'

import type { Download, DownloadNoUrl } from './types'

export type Shape = {
    lastId: number,
    entries: Download[]
}

const INITIAL = {
    lastId: -1,
    entries: []
}
export const sagas = [];

const A = ([actionType]: string[]) => 'DOWNLOADS_' + actionType; // Action type prefixer

//
const UPDATE = A`UPDATE`;
type UpdateAction = { type:typeof UPDATE, id:number, props:DownloadNoUrl };
function update(id: number, props: {}): UpdateAction {
    // props is object of new keys to overwrite download with
    delete props.url;
    props.updatedAt = Date.now();
    return {
        type: UPDATE,
        id,
        props
    }
}

//
const ADD = A`ADD`;
type AddAction = { type:typeof ADD, download:Download };
function add(download: Download): AddAction {
    return {
        type: ADD,
        download
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
type RequestAction = { type:typeof REQUEST, url:string, promise:*, resolve:*, reject:* };
export function requestDownload(url: string): RequestAction {
    let resolve, reject;
    return {
        type: REQUEST,
        url,
        promise: new Promise( (...args)=>([resolve,reject] = args) ),
        resolve,
        reject
    }
}
const requestWorker = function* requestWorker(action: RequestAction) {
    console.log('ENTERED requestWorker :: downloads');
    const { url, resolve, reject } = action;
    let { downloads:state } = yield select();

    console.log('requestWorker, downloads:', state);

    const duplicate = getDownload(url, state);
    if (duplicate) {
        console.log('requestWorker, discarding download as already there, duplicate:', duplicate);
        reject(duplicate.id);
        return;
    }

    console.log('downloads, lastId will increment, it is now:', state.lastId);
    yield put(increment());
    ({ downloads:state } = yield select());
    console.log('downloads, lastId incremented, it is now:', state.lastId)
    const id = state.lastId;
    resolve(id); // resolve meaning request was accepted

    yield put(add({ id, url, isDownloading:true, createdAt:Date.now() }));

    let res;
    try {
        res = yield call(fetch, url);
    } catch(ex) {
        yield put(update(id, { isDownloading:false, error:ex.message }));
        return;
    }

    if (res.status < 200 || res.status > 299) {
        yield put(update(id, { isDownloading:false, error:`Fetch failed with ${res.status} status` }))
        return;
    }

    const blob = yield res.blob();

    const dataurl = yield call(blobToDataUrl, blob);

    yield put(update(id, { isDownloading:false, dataurl }));

}
const requestWatcher = function* requestWatcher() {
    yield takeEvery(REQUEST, requestWorker);
}
sagas.push(requestWatcher);

//
type Action =
  | AddAction
  | IncrementAction
  | RequestAction
  | UpdateAction;

export default function reducer(state: Shape = INITIAL, action: Action) {
    switch(action.type) {
        case INCREMENT: {
            return {
                ...state,
                lastId: state.lastId + 1
            }
        }
        case ADD: {
            const { download } = action;
            return {
                ...state,
                entries: [...state.entries, download]
            }
        }
        case UPDATE: {
            const { id, props } = action;
            return {
                ...state,
                entries: state.entries.map( download => download.id !== id ? download : { ...download, ...props } )
            }
        }
        default: return state;
    }
}