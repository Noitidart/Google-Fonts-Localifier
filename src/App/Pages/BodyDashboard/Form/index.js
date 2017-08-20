import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { SubmissionError, Field, reduxForm } from 'redux-form'

import './index.css'

class FormDumb extends PureComponent {
    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit}>

            </form>
        )
    }
}

const FormControlled = reduxForm({ form:'dashboard' })

const FormSmart = connect(
    function(state) {
        const { downloads } = state;
        return {
            downloads
        }
    }
)

const Form = FormSmart(FormControlled(FormDumb))

export default Form