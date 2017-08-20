export function getDownload(url, state) {
    return state.entries.find( download => download.url === url );
}

export function blobToDataUrl(blob) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(blob);
    })
}

export async function dataUrlToBlob(dataurl) {
    const res = fetch(dataurl);
    return await res.blob();
}