import React, { PureComponent } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

import Body404 from './Body404'
import BodyCounter from './BodyCounter'
import BodyDashboard from './BodyDashboard'
import BodySettings from './BodySettings'

import './index.css'

const PAGES = [
    { path:'/',           label:'Dashboard', Body:BodyDashboard },
    { path:'/counter',    label:'Counter',   Body:BodyCounter  },
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