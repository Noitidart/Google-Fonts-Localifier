import React, { PureComponent } from 'react'

import './index.css'

type Props = {
    meta: {
        touched: boolean,
        error?: string
    },
    input: {}
}

class FieldText extends PureComponent {
    render() {
        const {meta:{ touched, error }, input } = this.props;

        return (
            <div className="field--input-row">
                <input {...input} type="text" />
                { touched && error &&
                    <div className="field--input-error">{error}</div>
                }
            </div>
        )
    }
}

export default FieldText