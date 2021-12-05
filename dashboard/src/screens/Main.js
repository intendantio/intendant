import React from 'react'
import { Toolbar, AppBar } from '@material-ui/core'
import SmartObject from './contents/SmartObject/List'
import DetailSmartObject from './contents/SmartObject/Detail'
import NewSmartObject from './contents/SmartObject/New'
import Authorization from './contents/Authorization/List'
import ListProcess from './contents/Process/List'
import NewProcess from './contents/Process/New'
import DetailProcess from './contents/Process/Detail'
import Routine from './contents/Routine/List'
import NewRoutine from './contents/Routine/New'
import DetailRoutine from './contents/Routine/Detail'
import Module from './contents/Module/List'
import DetailModule from './contents/Module/Detail'
import Configuration from './contents/Configuration/List'
import Market from './contents/Market/List'
import Widget from './contents/Widget/List'
import NewWidget from './contents/Widget/New'
import DetailWidget from './contents/Widget/Detail'
import User from './contents/User/List'
import NewUser from './contents/User/New'
import NewPassword from './contents/User/NewPassword'
import Sidebar from '../components/Sidebar'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

class Main extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isMobile: false
        }
    }

    componentDidMount() {
        this.mediaQueries('(max-width: 900px)')
    }

    mediaQueries(query) {
        let mediaMatch = window.matchMedia(query);
        this.setState({ isMobile: mediaMatch.matches })
        const handler = e => this.setState({ isMobile: e.matches })
        mediaMatch.addListener(handler)
    }

    render() {
        return (
            <Router basename='/admin'>
                <Sidebar isMobile={this.state.isMobile} onDisconnect={() => { this.props.onDisconnect() }} />
                <main style={{ padding: 20, width: this.state.isMobile ? '95vw' :  '80vw', height: '100vh' }} >
                    <div style={{ marginLeft: this.state.isMobile ? 0 : 240, marginTop: this.state.isMobile ? 0 : 32 }}>
                        <Switch>
                            <Route exact path="/smartobject" component={SmartObject} />
                            <Route exact path="/smartobject/new" component={NewSmartObject} />
                            <Route exact path="/smartobject/:id" component={DetailSmartObject} />
                            <Route exact path="/module" component={Module} />
                            <Route exact path="/module/:id" component={DetailModule} />
                            <Route exact path="/routine" component={Routine} />
                            <Route exact path="/routine/new" component={NewRoutine} />
                            <Route exact path="/routine/:id" component={DetailRoutine} />
                            <Route exact path="/widget" component={Widget} />
                            <Route exact path="/widget/new" component={NewWidget} />
                            <Route exact path="/widget/authorization" component={Widget} />
                            <Route exact path="/widget/:id" component={DetailWidget} />
                            <Route exact path="/process" component={ListProcess} />
                            <Route exact path="/process/new" component={NewProcess} />
                            <Route exact path="/process/:id" component={DetailProcess} />
                            <Route exact path="/user" component={User} />
                            <Route exact path="/user/new" component={NewUser} />
                            <Route exact path="/user/:id/password" component={NewPassword} />
                            <Route exact path="/configuration" component={Configuration} />
                            <Route exact path="/market" component={Market} />
                            <Route exact path="/authorization" component={Authorization} />
                        </Switch>
                    </div>
                </main>
            </Router>
        )
    }
}

export default Main