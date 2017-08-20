// @flow

import React, { PureComponent } from 'react'

import StartDownloadForm from './StartDownloadForm'
import Fonts from './Fonts'

import './index.css'

class BodyDashboard extends PureComponent<void, void> {
    render() {
        return (
            <div>
                <p className="App-intro">
                    Use the form to fetch and download fonts
                </p>
                <div className="dashboard">
                    <StartDownloadForm />
                    <Fonts />
                </div>
            </div>
        )
    }
}

export default BodyDashboard