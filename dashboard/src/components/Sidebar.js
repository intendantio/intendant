import React from 'react'
import { Drawer, List, Typography, Box, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { ShoppingCart, House, Menu, DevicesOther, ExitToApp, AccountTree, Category, DeviceHub, Https, Extension, Settings, Person } from '@mui/icons-material'
import { Link } from "react-router-dom"

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

class Sidebar extends React.Component {

    render() {
        if (this.props.isMobile) {
            return (
                <BottomNavigation
                    elevation={10}
                    style={{ zIndex: 2, justifyContent: 'space-between' }}
                    sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0, right: 0, overflowX: 'visible' }}
                    onChange={(event, newValue) => {

                    }}
                >
                    <Link to="/smartobject" style={{ textDecoration: 'none', color: 'white' }}>
                        <BottomNavigationAction style={{ color: 'white' }} label="Recents" icon={<DevicesOther />} />
                    </Link>
                    <Link to="/localisation" style={{ textDecoration: 'none', color: 'white' }}>
                        <BottomNavigationAction style={{ color: 'white' }} label="Favorites" icon={<House />} />
                    </Link>
                    <Link to="/module" style={{ textDecoration: 'none', color: 'white' }}>
                        <BottomNavigationAction style={{ color: 'white' }} label="Nearby" icon={<Category />} />
                    </Link>
                    <Link to="/widget" style={{ textDecoration: 'none', color: 'white' }}>
                        <BottomNavigationAction style={{ color: 'white' }} label="Nearby" icon={<Extension />} />
                    </Link>
                    <Link to="/widget" style={{ textDecoration: 'none', color: 'white' }}>
                        <BottomNavigationAction style={{ color: 'white' }} label="Nearby" icon={<Menu />} />
                    </Link>
                </BottomNavigation>
            )
        }
        return (
            <Drawer variant="persistent" anchor="left" open={true} style={{ width: 240 }} >
                <Box style={{ width: 240, display: 'flex', justifyContent: 'space-between', overflowX: 'hidden' }}>
                    <List style={{ width: '100%' }}>
                        <Box style={{ display: 'flex', justifyContent: 'flex-start', padding: 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                            <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ minHeight: 40, minWidth: 40, height: '7vh', width: '7vh', borderRadius: 7, marginLeft: 15 }} />
                            <Box>
                                <Typography variant='h5' style={{ paddingTop: 15, paddingLeft: 10 }}>
                                    Intendant
                                </Typography>
                                <Typography variant='subtitle1' style={{ paddingTop: 0, paddingBottom: 15, paddingLeft: 10 }}>
                                    Administration
                                </Typography>
                            </Box>
                        </Box>

                        <Divider />
                        <Link to="/smartobject" style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"smartobject"}>
                                <ListItemIcon>
                                    <DevicesOther />
                                </ListItemIcon>
                                <ListItemText primary={"Smartobject"} />
                            </ListItem>
                        </Link>
                        <Link to="/localisation" style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"localisation"}>
                                <ListItemIcon>
                                    <House />
                                </ListItemIcon>
                                <ListItemText primary={"Room"} />
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
                        <ListItem button key={"disconnect"} onClick={() => { this.props.onDisconnect() }} >
                            <ListItemIcon>
                                <ExitToApp />
                            </ListItemIcon>
                            <ListItemText primary={"Disconnect"} />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        )
    }

}

export default Sidebar