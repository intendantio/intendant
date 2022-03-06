import React from 'react'
import Smartobject from './contents/Smartobject/List'
import DetailSmartObject from './contents/Smartobject/Detail'
import GallerySmartobject from './contents/Smartobject/Gallery'
import NewSmartObject from './contents/Smartobject/New'
import ListProcess from './contents/Process/List'
import NewProcess from './contents/Process/New'
import DetailProcess from './contents/Process/Detail'
import Automation from './contents/Automation/List'
import NewAutomation from './contents/Automation/New'
import DetailAutomation from './contents/Automation/Detail'
import Module from './contents/Module/List'
import DetailModule from './contents/Module/Detail'
import GalleryModule from './contents/Module/Gallery'
import Widget from './contents/Widget/List'
import NewWidget from './contents/Widget/New'
import Rapport from './contents/Rapport/List'
import NewRapport from './contents/Rapport/New'
import DetailRapport from './contents/Rapport/Detail'
import User from './contents/User/List'
import NewUser from './contents/User/New'
import DetailUser from './contents/User/Detail'
import Sidebar from '../components/Sidebar'
import Room from './contents/Room/List'
import NewRoom from './contents/Room/New'
import DetailRoom from './contents/Room/Detail'
import OAuthSmartobject from './contents/Smartobject/OAuth'
import Authorisation from './contents/Authorisation/List'

import Context from '../utils/Context'


import { BrowserRouter as Router, Switch, Route, useHistory, } from "react-router-dom"



function Main(mainProps) {


    return (
        <Context.Consumer>
            {({ title, setTitle, setActionType, actionType, setMessage }) => (
                <Router basename='/admin'>
                    <Sidebar title={title} actionType={actionType} isMobile={mainProps.isMobile} onDisconnect={() => { mainProps.onDisconnect() }} />
                    <main id='main' style={{ paddingTop: mainProps.isMobile ? 8 : '4vh', width: '100vw', paddingLeft: '5vw', paddingRight: '5vw', overflowX: 'hidden', overflowY: 'visible' }} >
                        <div style={{ marginLeft: mainProps.isMobile ? 0 : 240, height: '96vh' }}>
                            <Switch>
                                <Route exact path="/" render={(props) => <Room setMessage={setMessage} setTitle={setTitle} setActionType={setActionType} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/smartobject" render={(props) => <Smartobject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/smartobject/new/:id" render={(props) => <NewSmartObject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/smartobject/oauth/:id" render={(props) => <OAuthSmartobject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/smartobject/gallery" render={(props) => <GallerySmartobject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/smartobject/:id" render={(props) => <DetailSmartObject setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/module" render={(props) => <Module setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/module/gallery" render={(props) => <GalleryModule setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/module/:id" render={(props) => <DetailModule setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/automation" render={(props) => <Automation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/automation/new" render={(props) => <NewAutomation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/automation/:id" render={(props) => <DetailAutomation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={true} {...props} />} />
                                <Route exact path="/rapport" render={(props) => <Rapport setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/rapport/new" render={(props) => <NewRapport setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/rapport/:id" render={(props) => <DetailRapport setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/widget" render={(props) => <Widget setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/widget/new" render={(props) => <NewWidget setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/process" render={(props) => <ListProcess setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/process/new" render={(props) => <NewProcess setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/process/:id" render={(props) => <DetailProcess setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/user" render={(props) => <User setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/user/new" render={(props) => <NewUser setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/user/:id" render={(props) => <DetailUser setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/room" render={(props) => <Room setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/room/new" render={(props) => <NewRoom setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/room/:id" render={(props) => <DetailRoom setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                                <Route exact path="/authorisation" render={(props) => <Authorisation setActionType={setActionType} setMessage={setMessage} setTitle={setTitle} isMobile={mainProps.isMobile} {...props} />} />
                            </Switch>
                        </div>
                    </main>
                </Router>
            )}
        </Context.Consumer>

    )
}

export default Main