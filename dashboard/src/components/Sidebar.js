import React from 'react'
import { Drawer, List, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import {ShoppingCart, DevicesOther, ExitToApp, AccountTree, Category, DeviceHub, Https, Extension, Settings, Person} from '@mui/icons-material'
import { Link } from "react-router-dom"

class Sidebar extends React.Component {

    render() {
        if(this.props.isMobile) {
            return null
        }
        return (
            <Drawer variant="persistent" anchor="left" open={true} style={{ width: 240 }} >
                <div style={{ width: 240, display:'flex', justifyContent:'space-between' }}>
                    <List>
                        <div style={{display:'flex', justifyContent:'flex-start', padding: 5, alignContent:'center', alignSelf:'center', alignItems:'center'}}>
                        <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ height: '7vh', width: '7vh', borderRadius: 7, marginLeft: 15 }} />
                        <div>
                        <Typography variant='h5' style={{ textAlign: 'start', fontWeight: 'bold', paddingTop: 15, paddingLeft: 10 }}>
                            Intendant
                        </Typography>
                        <Typography variant='subtitle1' style={{ textAlign: 'start', fontWeight: 'bold', paddingTop: 0, paddingBottom: 15, paddingLeft: 10 }}>
                            Administration
                        </Typography>
                        </div>  
                            </div>
                    
                        <Divider />
                        <Link to="/smartobject" style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"smartobject"}>
                                <ListItemIcon>
                                    <DevicesOther />
                                </ListItemIcon>
                                <ListItemText primary={"Smartobject"} />
                            </ListItem>
                        </Link>
                        <Link to="/module" style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"module"}>
                                <ListItemIcon>
                                    <Category />
                                </ListItemIcon>
                                <ListItemText primary={"Module"} />
                            </ListItem>
                        </Link>
                        <Link to="/widget" style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"widget"} >
                                <ListItemIcon>
                                    <Extension />
                                </ListItemIcon>
                                <ListItemText primary={"Widget"} />
                            </ListItem>
                        </Link>
                        <Link to="/process" style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"process"} >
                                <ListItemIcon>
                                    <DeviceHub />
                                </ListItemIcon>
                                <ListItemText primary={"Process"} />
                            </ListItem>
                        </Link>
                        <Link to="/routine" style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"configuration"} >
                                <ListItemIcon>
                                    <AccountTree />
                                </ListItemIcon>
                                <ListItemText primary={"Routine"} />
                            </ListItem>
                        </Link>
                        <Link to="/user" style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"user"} >
                                <ListItemIcon>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText primary={"User"} />
                            </ListItem>
                        </Link>
                        <Link to="/market" style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"market"} >
                                <ListItemIcon>
                                    <ShoppingCart />
                                </ListItemIcon>
                                <ListItemText primary={"Market"} />
                            </ListItem>
                        </Link>
                        <Divider />
                        <ListItem button key={"disconnect"} onClick={() => {this.props.onDisconnect()}} >
                            <ListItemIcon>
                                <ExitToApp />
                            </ListItemIcon>
                            <ListItemText primary={"Disconnect"} />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        )
    }

}

export default Sidebar