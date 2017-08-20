// @flow

import React, { PureComponent } from 'react'
import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import { PAGES } from '../../Pages'

import './index.css'

type Props = {
    // router props
    location: *
    // match: *
    // history: *
}

class Nav extends PureComponent<Props, void> {
    render() {
        const { location } = this.props;

        return (
            <div className="nav">
                { PAGES.map( ({path, label}) => (
                    <NavLink className="topnav-link" activeClassName="topnav-link-selected" key={path} to={path} location={location} exact>
                        {label}
                    </NavLink>
                )) }
            </div>
        )
    }
}

export default withRouter(Nav)