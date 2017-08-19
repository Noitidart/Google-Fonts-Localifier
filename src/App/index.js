// @flow

import React, { PureComponent } from 'react'
import logo from './logo.svg'
import './index.css'

type Rawr = number;
const rawr:Rawr = 'asd';

class App extends PureComponent<void, void> {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
            </div>
        )
    }
}

export default App
