// @flow

import React, { PureComponent } from 'react'

import './index.css'

class Body404 extends PureComponent<void, void> {
    render() {
        return (
            <div>
                <p className="App-intro">
                    Uh-oh
                </p>
                This page does not exist!
            </div>
        )
    }
}

export default Body404