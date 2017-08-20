// @flow

import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import store from './flow-control'

import Header from './Header'
import Pages from './Pages'

import './index.css'

class App extends PureComponent<void, void> {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div className="App">
                        <Header />
                        <Pages />
                    </div>
                </BrowserRouter>
            </Provider>
        )
    }
}

export default App
