import React from 'react'
import SmartObject from './contents/SmartObject/List'
import DetailSmartObject from './contents/SmartObject/Detail'
import RedirectSmartObject from './contents/SmartObject/Redirect'
import NewSmartObject from './contents/SmartObject/New'
import ListProcess from './contents/Process/List'
import NewProcess from './contents/Process/New'
import DetailProcess from './contents/Process/Detail'
import Routine from './contents/Routine/List'
import NewRoutine from './contents/Routine/New'
import DetailRoutine from './contents/Routine/Detail'
import Module from './contents/Module/List'
import DetailModule from './contents/Module/Detail'
import Market from './contents/Market/List'
import Widget from './contents/Widget/List'
import NewWidget from './contents/Widget/New'
import Rapport from './contents/Rapport/List'
import NewRapport from './contents/Rapport/New'
import User from './contents/User/List'
import NewUser from './contents/User/New'
import QrCode from './contents/QrCode/QrCode'
import NewPassword from './contents/User/NewPassword'
import Sidebar from '../components/Sidebar'
import Localisation from './contents/Localisation/List'
import NewLocalisation from './contents/Localisation/New'
import DetailLocalisation from './contents/Localisation/Detail'
import Authorisation from './contents/Authorisation/List'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

class Main extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isMobile: false
        }
    }

    componentDidMount() {
        this.mediaQueries('(max-width: 900px),(max-height: 600px)')
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
                <main id='main' style={{ paddingTop:  this.state.isMobile ? 20 : '4vh', width:  '100vw', paddingLeft:'5vw', paddingRight: '5vw', overflowX:  'hidden', overflowY: 'visible' }} >
                    <div style={{ marginLeft: this.state.isMobile ? 0 : 240, height: '100vh' }}>
                        <Switch>
                            <Route exact path="/" component={SmartObject} />
                            <Route exact path="/smartobject" component={SmartObject} />
                            <Route exact path="/smartobject/new" component={NewSmartObject} />
                            <Route exact path="/smartobject/redirect/:object" component={RedirectSmartObject} />
                            <Route exact path="/smartobject/:id" component={DetailSmartObject} />
                            <Route exact path="/module" component={Module} />
                            <Route exact path="/module/:id" component={DetailModule} />
                            <Route exact path="/routine" component={Routine} />
                            <Route exact path="/routine/new" component={NewRoutine} />
                            <Route exact path="/routine/:id" component={DetailRoutine} />
                            <Route exact path="/rapport" component={Rapport} />
                            <Route exact path="/rapport/new" component={NewRapport} />
                            <Route exact path="/widget" component={Widget} />
                            <Route exact path="/widget/new" component={NewWidget} />
                            <Route exact path="/widget/authorization" component={Widget} />
                            <Route exact path="/widget/authorization" component={Widget} />
                            <Route exact path="/process" component={ListProcess} />
                            <Route exact path="/process/new" component={NewProcess} />
                            <Route exact path="/process/:id" component={DetailProcess} />
                            <Route exact path="/qrcode/:id" component={QrCode} />
                            <Route exact path="/user" component={User} />
                            <Route exact path="/user/new" component={NewUser} />
                            <Route exact path="/user/:id/password" component={NewPassword} />
                            <Route exact path="/market" component={Market} />
                            <Route exact path="/localisation" component={Localisation} />
                            <Route exact path="/localisation/new" component={NewLocalisation} />
                            <Route exact path="/localisation/:id" component={DetailLocalisation} />
                            <Route exect path="/authorisation" component={Authorisation} />
                        </Switch>
                    </div>
                </main>
            </Router>
        )
    }
}

export default Main