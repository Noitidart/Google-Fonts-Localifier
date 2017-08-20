// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { up, dn, upAsync } from '../../../flow-control/counter'

import type { Shape as CounterShape } from '../../../flow-control/counter'
import type { Shape as AppShape } from '../../../flow-control'

type Props = {
    counter: CounterShape,
    dispatch: *
}

class CounterDumb extends PureComponent<Props, void> {
    handleUp = () => this.props.dispatch(up())
    handleUpAsync = () => this.props.dispatch(upAsync(5))
    handleDn = () => this.props.dispatch(dn())
    render() {
        const { counter } = this.props;

        return (
            <div>
                <div>
                    <b>Count:</b> {counter}
                </div>
                <button onClick={this.handleUp}>Up</button>
                <button onClick={this.handleDn}>Down</button>
                <button onClick={this.handleUpAsync}>Up Async x5</button>
            </div>
        )
    }
}

const CounterSmart = connect(
    function (state: AppShape) {
        return {
            counter: state.counter
        }
    }
)

const Counter = CounterSmart(CounterDumb)

export default Counter