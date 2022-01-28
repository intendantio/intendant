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
import DetailRapport from './contents/Rapport/Detail'
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

function Main(mainProps) {

    console.log(mainProps)
    return (
        <Router basename='/admin'>
            <Sidebar isMobile={mainProps.isMobile} onDisconnect={() => { props.onDisconnect() }} />
            <main id='main' style={{ paddingTop: mainProps.isMobile ? 20 : '4vh', width: '100vw', paddingLeft: '5vw', paddingRight: '5vw', overflowX: 'hidden', overflowY: 'visible' }} >
                <div style={{ marginLeft: mainProps.isMobile ? 0 : 240, height: '100vh' }}>
                    <Switch>
                        <Route exact path="/" render={(props) => <SmartObject isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/smartobject" render={(props) => <SmartObject isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/smartobject/new" render={(props) => <NewSmartObject isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/smartobject/redirect/:object" render={(props) => <RedirectSmartObject isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/smartobject/:id" render={(props) => <DetailSmartObject isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/module" render={(props) => <Module isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/module/:id" render={(props) => <DetailModule isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/routine" render={(props) => <Routine isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/routine/new" render={(props) => <NewRoutine isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/routine/:id" render={(props) => <DetailRoutine isMobile={true} {...props} />} />
                        <Route exact path="/rapport" render={(props) => <Rapport isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/rapport/new" render={(props) => <NewRapport isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/rapport/:id" render={(props) => <DetailRapport isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/widget" render={(props) => <Widget isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/widget/new" render={(props) => <NewWidget isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/process" render={(props) => <ListProcess isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/process/new" render={(props) => <NewProcess isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/process/:id" render={(props) => <DetailProcess isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/qrcode/:id" render={(props) => <QrCode isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/user" render={(props) => <User isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/user/new" render={(props) => <NewUser isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/user/:id/password" render={(props) => <NewPassword isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/market" render={(props) => <Market isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/localisation" render={(props) => <Localisation isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/localisation/new" render={(props) => <NewLocalisation isMobile={mainProps.isMobile} {...props} />} />
                        <Route exact path="/localisation/:id" render={(props) => <DetailLocalisation isMobile={mainProps.isMobile} {...props} />} />
                        <Route exect path="/authorisation" render={(props) => <Authorisation isMobile={mainProps.isMobile} {...props} />} />
                    </Switch>
                </div>
            </main>
        </Router>
    )
}

export default Main