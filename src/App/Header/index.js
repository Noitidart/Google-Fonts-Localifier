// @flow

import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

import Nav from './Nav'
// import logo from './logo.svg'
import logo from '../images/icon/32dp-2x.png'

import './index.css'

class Header extends PureComponent<void, void> {
    render() {
        return (
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>
                    <span style={{fontWeight:700}}>Google</span> Fonts Localifier
                </h2>
                <Nav />
            </div>
        )
    }
}

export default withRouter(Header)