// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { depth0Or1Equal } from 'cmn/src/recompose'
import { arrayToObject } from 'cmn/src/all'

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

class FontDumb extends PureComponent<void, void> {
    render() {
        const { font, downloads } = this.props;

        console.log('font.id:', font.id, 'downloads:', downloads);
        return (
            <div className="font">
                <div className="font--row">
                    <div>URL</div>
                    <div>{font.url}</div>
                </div>
                <div className="font--row">
                    <button>Download</button>
                </div>
            </div>
        )
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