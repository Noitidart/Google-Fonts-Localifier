import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'

import BodyDashboard from './BodyDashboard'
import BodySettings from './BodySettings'
import Body404 from './Body404'

import './index.css'

const PAGES = [
    { path:'/',           label:'Dashboard', Body:BodyDashboard },
    { path:'/settings',   label:'Settings',  Body:BodySettings  }
]

class PagesDumb extends PureComponent<void, void> {
    render() {
        return (
            <div>
                <Switch>
                    { PAGES.map( ({ Body, path }) => <Route path={path} key={path} exact component={Body} /> ) }
                    <Route component={Body404} />
                </Switch>
            </div>
        )
    }
}

const PagesRouted = withRouter;

const Pages = PagesRouted(PagesDumb)

export { PAGES }
export default Pages