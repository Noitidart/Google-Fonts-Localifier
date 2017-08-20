// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import Font from './Font'

import './index.css'

import type { Shape as FontsShape } from '../../../flow-control/fonts'
import type { Shape as AppShape } from '../../../flow-control'


type Props = {
    fonts: FontsShape
}

class FontsDumb extends PureComponent<Props, void> {
    render() {
        const { fonts } = this.props;

        return (
            <div className="fonts">
                { fonts.entries.map( font => <Font key={font.url} font={font} /> ) }
            </div>
        )
    }
}

const FontsSmart = connect(
    function(state: AppShape) {
        return {
            fonts: state.fonts
        }
    }
)

const Fonts = FontsSmart(FontsDumb)

export default Fonts