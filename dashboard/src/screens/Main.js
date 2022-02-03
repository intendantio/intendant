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
import NewPassword from './contents/User/NewPassword'
import Sidebar from '../components/Sidebar'
import Room from './contents/Room/List'
import NewRoom from './contents/Room/New'
import DetailRoom from './contents/Room/Detail'
import Authorisation from './contents/Authorisation/List'

import Context from '../utils/Context'


import { BrowserRouter as Router, Switch, Route, useHistory, } from "react-router-dom"



function Main(mainProps) {


    return (
        <Context.Consumer>
            {({ title, setTitle, setActionType, actionType }) => (
                <Router basename='/admin'>
                    <Sidebar title={title} actionType={actionType} isMobile={mainProps.isMobile} onDisconnect={() => { props.onDisconnect() }} />
                    <main id='main' style={{ paddingTop: mainProps.isMobile ? 20 : '4vh', width: '100vw', paddingLeft: '5vw', paddingRight: '5vw', overflowX: 'hidden', overflowY: 'visible' }} >
                        <div style={{ marginLeft: mainProps.isMobile ? 0 : 240, height: '100vh' }}>
                            <Switch>
                                <Route exact path="/" render={(props) => <Room setTitle={setTitle} setActionType={setActionType} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/smartobject" render={(props) => <SmartObject setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/smartobject/new" render={(props) => <NewSmartObject setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/smartobject/redirect/:object" render={(props) => <RedirectSmartObject setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/smartobject/:id" render={(props) => <DetailSmartObject setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/module" render={(props) => <Module setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/module/:id" render={(props) => <DetailModule setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/routine" render={(props) => <Routine setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/routine/new" render={(props) => <NewRoutine setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/routine/:id" render={(props) => <DetailRoutine isMobile={true} {...props} />} />
                                <Route exact path="/rapport" render={(props) => <Rapport setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/rapport/new" render={(props) => <NewRapport setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/rapport/:id" render={(props) => <DetailRapport setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/widget" render={(props) => <Widget setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/widget/new" render={(props) => <NewWidget setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/process" render={(props) => <ListProcess setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/process/new" render={(props) => <NewProcess setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/process/:id" render={(props) => <DetailProcess setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/user" render={(props) => <User setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/user/new" render={(props) => <NewUser setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/user/:id/password" render={(props) => <NewPassword setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/market" render={(props) => <Market setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/room" render={(props) => <Room setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/room/new" render={(props) => <NewRoom setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/room/:id" render={(props) => <DetailRoom setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/authorisation" render={(props) => <Authorisation setActionType={setActionType} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                            </Switch>
                        </div>
                    </main>
                </Router>
            )}
        </Context.Consumer>

    )
}

export default Main