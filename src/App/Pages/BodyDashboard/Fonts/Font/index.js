// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Zip from 'jszip'

import { depth0Or1Equal } from 'cmn/src/recompose'
import { arrayToObject, wait } from 'cmn/src/all'

import './index.css'

import type { Font as FontType } from '../../../../flow-control/fonts/types'
import type { Shape as FontsShape } from '../../../../flow-control/fonts'
import type { Download } from '../../../../flow-control/downloads/types'
import type { Shape as AppShape } from '../../../../flow-control'

type OwnProps = {
    font: Font
}
type Props = {
    ...OwnProps,
    downloads: Download[] // only the download entries for this font
}

type State = {
    isZipping: false,
    zipUrl?: *
}

class FontDumb extends PureComponent<Props, State> {
    state = {
        isZipping: false
    }
    render() {
        const { font, downloads } = this.props;
        const { prepareZip, getZipName, destroyZip } = this;
        const { isZipping, zipUrl } = this.state;

        console.log('font.id:', font.id, 'downloads:', downloads);
        const cntDownloading = downloads.filter( download => download.isDownloading ).length;
        const isDownloading = cntDownloading > 0;

        return (
            <div className="font">
                <div className="font--row">
                    <div>URL</div>
                    <div>{font.url}</div>
                </div>
                { isDownloading &&
                    <div className="font--row">
                        <div>Download in progress - {cntDownloading} downloads remaining</div>
                    </div>
                }
                { isZipping &&
                    <div className="font--row">
                        <div>Zipping assets</div>
                    </div>
                }
                <div className="font--row">
                    { !zipUrl && <button disabled={isDownloading || isZipping} onClick={prepareZip}>Prepare Zip</button> }
                    { zipUrl && <a href={zipUrl} download={getZipName()} onClick={destroyZip}>Save Zip As</a> }
                </div>
            </div>
        )
    }

    destroyZip = () => {
        // URL.revokeObjectURL(this.state.zipUrl);
        // this.setState(() => ({ zipUrl:undefined }));
    }
    getZipName = () => {
        const familys = this.props.font.url.match(/[=|]([^:]+)/g);
        return familys.map(family => family.substr(1).replace(/\+/g, ' ')).join('--') + '.zip';
    }
    prepareZip = async () => {
        this.setState(() => ({ isZipping:true }));
        const { font, downloads } = this.props;

        const zip = new Zip();

        let css = font.css;
        let ix = 0;

        const zippingDownloads = [];
        for (const download of downloads) {
            const { url, blob } = download;
            const ext = url.substr(url.lastIndexOf('.')+1);
            const orig = `url(${url})`;

            const ixOrig = css.indexOf(orig);
            const ixOpen = css.lastIndexOf('{', ixOrig);
            const ixClose = css.indexOf('}', ixOrig);
            const len = ixClose - ixOpen;

            let cssBlock = css.substr(ixOpen, len);
            cssBlock = cssBlock.substr(cssBlock.lastIndexOf('{'));
            // console.log('cssBlock:', cssBlock);
            const weight = cssBlock.match(/font-weight: (\d+)/)[1];
            // console.log('weight:', weight);
            const style = cssBlock.match(/font-style: ([^;]+)/)[1];
            // console.log('style:', style);
            const family = cssBlock.match(/font-family: ([^;]+)/)[1].replace(/['"]/g, '');
            // console.log('family:', family);
            const names = cssBlock.match(/local\('[^']+/g).map( name => name.substr(name.indexOf(`'`)+1) );
            // console.log('names:', names);
            const unicodes = cssBlock.match(/unicode-range: ([^;]+)/)[1].replace(/, /g, '--');
            // console.log('unicodes:', unicodes);

            // const fileName = `${family}---${weight}---${unicodes}.${ext}`;
            const fileName = `${names[0]}---${unicodes}.${ext}`;
            // console.log('fileName:', fileName);

            css = css.replace(orig, `url(${fileName})`);
            zippingDownloads.push(zip.file(fileName, blob));
        }

        await Promise.all(zippingDownloads);

        zip.file('style.css', css);

        const blob = await zip.generateAsync({ type:'blob' });
        console.log('blob:', blob);
        const url = URL.createObjectURL(blob);
        console.log('url:', url);
        this.setState(() => ({ isZipping:false, zipUrl:url }));
    }
}

const FontSmart = connect(
    function (state: AppShape, props: OwnProps) {
        const { font } = props;
        const downloadIds = arrayToObject(font.downloadIds, 'VALUE');
        const downloads = state.downloads.entries.filter( download => download.id in downloadIds);
        return {
            downloads
        }
    },
    undefined,
    undefined,
    {
        areStatePropsEqual: (props, propsOld) => depth0Or1Equal(props, propsOld, { downloads:0 })
    }
)

const Font = FontSmart(FontDumb)

export default Font