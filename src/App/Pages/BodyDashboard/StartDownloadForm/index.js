import React, { PureComponent } from 'react'
import { SubmissionError, Field, reduxForm } from 'redux-form'

import { timeout } from 'cmn/src/all'
import { requestFontAdd } from '../../../flow-control/fonts'
import { requestDownload } from '../../../flow-control/downloads'

import FieldText from './Fields/FieldText'

import './index.css'

type Props = {
    // redux-form
    submitting: boolean
}

class StartDownloadFormDumb extends PureComponent<Props, void> {
    constructor(props) {
        super(props);
        this.handleSubmit = this.props.handleSubmit(this.handleSubmit);
    }

    componentDidMount() {
        this.props.dispatch(this.props.change('url', 'https://fonts.googleapis.com/css?family=Roboto+Slab:100,300,400,700|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i')); // DEBUG:
    }
    render() {
        const { submitting, error } = this.props;
        const { handleSubmit } = this;

        return (
            <form onSubmit={handleSubmit}>
                { error && !submitting && <div className="form--error">{error}</div> }
                <div>
                    <label>URL: </label>
                    <Field type="text" component={FieldText} name="url" disabled={submitting} />
                </div>
                <div>
                    <button disabled={submitting}>Download</button>
                    { submitting && <span>Validating with server...</span> }
                </div>
            </form>
        )
    }

    handleSubmit = async (values, dispatch) => {
        console.log('values:', values);
        let res;
        try {
            res = await timeout(10000, fetch(values.url));
        } catch(ex) {
            if (ex.message === 'TIMEOUT') throw new SubmissionError({ _error:'Connection timed out, please try again later.' });
            console.log('ex:', ex);
            throw new SubmissionError({ _error:'A network error occured, please try again later. ' + ex.message });
        }
        console.log('res.status:', res.status, res);

        if (res.status !== 200) throw new SubmissionError({ url:`Server validation failed with ${res.status} status` });

        // for (const header of res.headers.values()) {
        //     console.log('header:', header);
        //  }

        const css = await res.text();

        const fontFaceIx = css.indexOf('@font-face');
        console.log('fontFaceIx:', fontFaceIx);
        if (fontFaceIx === -1 || fontFaceIx > 100) {
            // its probably not a google font css file, usually @font-face is found on the second line, first line is a comment
            throw new SubmissionError({ url:'Not a font stylesheet' });
        }
        console.log('res.text:', css);

        // add it to downloads system
        try {
            const request = await dispatch(requestFontAdd(values.url, css)).promise;
        } catch(ex) {
            console.log('ex on font add request:', ex);
            throw new SubmissionError({ url:'This is a duplicate URL' });
        }

        this.props.reset();

    }
}

const StartDownloadFormControlled = reduxForm({ form:'start-font-download' })

const StartDownloadForm = StartDownloadFormControlled(StartDownloadFormDumb)

export default StartDownloadForm