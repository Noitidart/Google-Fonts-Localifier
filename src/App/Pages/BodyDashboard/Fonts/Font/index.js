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
    zip?: {
        url: string, // blob url
        name: string // name of the zip by font family
    }
}

type FamilyName = string;
type WeightedStyle =
    | '100' | '100i'
    | '200' | '200i'
    | '300' | '300i'
    | '400' | '400i'
    | '500' | '500i'
    | '600' | '600i'
    | '700' | '700i'
    | '800' | '800i'
    | '900' | '900i';
type Familys = { [FamilyName]:WeightedStyle[] }

class FontDumb extends PureComponent<Props, State> {
    state = {
        isZipping: false
    }
    render() {
        const { font, downloads } = this.props;
        const { prepareZip, getZipName, destroyZip } = this;
        const { isZipping, zip } = this.state;

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
                    { !zip && <button disabled={isDownloading || isZipping} onClick={prepareZip}>Prepare Zip</button> }
                    { zip && <a href={zip.url} download={zip.name} onClick={destroyZip}>Save Zip As</a> }
                </div>
            </div>
        )
    }

    destroyZip = () => {
        // URL.revokeObjectURL(this.state.zipUrl);
        // this.setState(() => ({ zipUrl:undefined }));
    }
    prepareZip = async () => {
        this.setState(() => ({ isZipping:true }));
        const { font, downloads } = this.props;

        const zip = new Zip();

        let css = font.css;
        console.log('css orig:', css);
        let ix = 0;

        const zippingDownloads = [];
        const familys:Familys = {};
        const familyWeights = {};
        const familyStyles = {};
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
            let weight = cssBlock.match(/font-weight: (\d+)/);
            weight = weight ? weight[1] : 400;
            // console.log('weight:', weight);
            let style = cssBlock.match(/font-style: ([^;]+)/);
            style = style ? style[1] : 'normal'; // css default
            // console.log('style:', style);
            const family = cssBlock.match(/font-family: ([^;]+)/)[1].replace(/['"]/g, '');
            // console.log('family:', family);
            const names = cssBlock.match(/local\('[^']+/g).map( name => name.substr(name.indexOf(`'`)+1) );
            // console.log('names:', names);
            let unicodes = cssBlock.match(/unicode-range: ([^;]+)/);
            unicodes = unicodes ? unicodes[1].replace(/, /g, '--') : 'U+0-10FFFF';
            // console.log('unicodes:', unicodes);

            if (!familys[family]) familys[family] = {};
            familys[family][`${weight}${style === 'italic' ? 'i' : ''}`] = 1;

            // const fileName = `${family}---${weight}---${unicodes}.${ext}`;
            const fileName = `${names[0]}---${unicodes}.${ext}`;
            // console.log('fileName:', fileName);

            css = css.replace(orig, `url('${fileName}')`);
            zippingDownloads.push(zip.file(fileName, blob));
        }

        console.log('familys:', familys);
        await Promise.all(zippingDownloads);


        zip.file('style.css', css);

        const blob = await zip.generateAsync({ type:'blob' });
        console.log('blob:', blob);
        const url = URL.createObjectURL(blob);
        console.log('url:', url);
        const name = this.getFileName(familys);
        this.setState(() => ({ isZipping:false, zip:{ url, name } }));
    }
    getFileName(familys:Familys) {
        const name = [];

        for (const [familyName, weightedStyles] of Object.entries(familys)) {
            name.push(familyName + '-' + Object.keys(weightedStyles).sort().join(','));
        }

        return name.sort().join('--') + '.zip';
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