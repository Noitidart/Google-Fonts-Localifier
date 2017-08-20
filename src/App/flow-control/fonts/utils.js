export function getFont(url, state) {
    return state.entries.find( font => font.url === url );
}


export function extractUrls(css) {
    const urls = [];
    const patt = /url\(([^\)]+)/g;
    let match;
    while (match = patt.exec(css)) {
        urls.push(match[1]);
    }
    console.log('urls:', urls, 'css:', css);
    return urls;
}