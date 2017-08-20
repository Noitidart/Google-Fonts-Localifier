// @flow

import React, { PureComponent } from 'react'

import Form from './Form'

import './index.css'

class BodyDashboard extends PureComponent<void, void> {
    render() {
        return (
            <div>
                <p className="App-intro">
                    Use the form to fetch and download fonts
                </p>
                <Form />
            </div>
        )
    }
}

export default BodyDashboard