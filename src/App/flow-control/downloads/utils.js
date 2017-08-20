export function getDownload(url, state) {
    return state.entries.find( download => download.url === url );
}