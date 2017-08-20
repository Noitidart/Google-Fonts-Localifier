import React, { PureComponent } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Body404 from './Body404'
import BodyCounter from './BodyCounter'
import BodyDashboard from './BodyDashboard'
import BodySettings from './BodySettings'

import './index.css'

import type { Shape as AppShape } from '../flow-control'

const PAGES = [
    { path:'/',           label:'Dashboard', Body:BodyDashboard },
    { path:'/counter',    label:'Counter',   Body:BodyCounter  },
    { path:'/settings',   label:'Settings',  Body:BodySettings  }
]

type Props = {
    rehydrated: boolean
}

class PagesDumb extends PureComponent<Props, void> {
    render() {
        const { rehydrated } = this.props;
        return (
            <div>
                { !rehydrated &&
                    <div className="rehydrating">Rehydrating</div>
                }
                { rehydrated &&
                    <Switch>
                        { PAGES.map( ({ Body, path }) => <Route path={path} key={path} exact component={Body} /> ) }
                        <Route component={Body404} />
                    </Switch>
                }
            </div>
        )
    }
}

const PagesSmart = connect(
    function(state:AppShape) {
        return {
            rehydrated: state.rehydrated
        }
    }
)

const PagesRouted = withRouter

const Pages = PagesRouted(PagesSmart(PagesDumb))

export { PAGES }
export default Pages