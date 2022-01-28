import React from 'react'
import { Drawer, IconButton, Button, List, AppBar, Typography, Toolbar, Box, Divider, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material'
import { ShoppingCart, House, Menu, DevicesOther, ExitToApp, AccountTree, Category, DeviceHub, BarChart, Extension, Settings, Person, ArrowBack, ArrowBackIos } from '@mui/icons-material'
import { Link } from "react-router-dom"

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

class Sidebar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            information: {
                status: "",
                version: ""
            },
            loading: true
        }
        this.getStatus()
    }

    navigate() {
        this.setState({ open: false })
        document.getElementById('main').scroll({
            top: 0,
            left: 0
        })
    }

    getStatus() {
        setTimeout(() => {
            this.setState({
                loading: false,
                information: {
                    status: "",
                    version: "1.0.0"
                }
            })
        }, 1000)
    }

    render() {
        if (this.props.isMobile) {
            let pathname = location.pathname.split("/")
            return (
                <>
                    <AppBar elevation={0} variant='outlined' position="static" >
                        <Toolbar >
                            <IconButton
                                onClick={() => { this.setState({ open: true }) }}
                                size="large"
                                color="inherit"
                                edge='start'
                            >
                                <Menu />
                            </IconButton>
                            <Link to="/smartobject" onClick={() => { this.navigate() }} style={{ paddingTop: 10, paddingBottom: 10, display: 'flex', textDecoration: 'none', color: 'white', flexDirection: 'row', alignItems: 'center' }}>
                                <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ minHeight: 30, minWidth: 30, height: '3vh', width: '3vh', borderRadius: 7, marginRight: 10 }} />
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                    {capitalizeFirstLetter(pathname.length > 2 ? pathname[2] : "Intendant")}
                                </Typography>
                            </Link>
                        </Toolbar>
                    </AppBar>
                    <Drawer elevation={0} onClose={() => this.setState({ open: false })} anchor="left" open={this.state.open} style={{ width: 240 }} >
                        <Box style={{ width: 240, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', overflowX: 'hidden' }}>
                            <List style={{ width: '100%' }}>
                                <Box style={{ display: 'flex', justifyContent: 'flex-start', padding: 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                                    <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ minHeight: 40, minWidth: 40, height: '7vh', width: '7vh', borderRadius: 7, marginLeft: 15 }} />
                                    <Box>
                                        <Typography variant='h5' style={{ paddingTop: 15, paddingLeft: 10 }}>
                                            Intendant
                                        </Typography>
                                        <Typography variant='subtitle1' style={{ paddingTop: 0, paddingBottom: 15, paddingLeft: 10 }}>
                                            Smart home
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider />
                                <Link to="/localisation" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"localisation"}>
                                        <ListItemIcon>
                                            <House />
                                        </ListItemIcon>
                                        <ListItemText primary={"Room"} />
                                    </ListItem>
                                </Link>
                                <Link to="/smartobject" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"smartobject"}>
                                        <ListItemIcon>
                                            <DevicesOther />
                                        </ListItemIcon>
                                        <ListItemText primary={"Smartobject"} />
                                    </ListItem>
                                </Link>
                                <Link to="/module" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"module"}>
                                        <ListItemIcon>
                                            <Category />
                                        </ListItemIcon>
                                        <ListItemText primary={"Module"} />
                                    </ListItem>
                                </Link>
                                <Link to="/widget" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"widget"} >
                                        <ListItemIcon>
                                            <Extension />
                                        </ListItemIcon>
                                        <ListItemText primary={"Widget"} />
                                    </ListItem>
                                </Link>
                                <Link to="/process" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"process"} >
                                        <ListItemIcon>
                                            <DeviceHub />
                                        </ListItemIcon>
                                        <ListItemText primary={"Process"} />
                                    </ListItem>
                                </Link>
                                <Link to="/routine" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"routine"} >
                                        <ListItemIcon>
                                            <AccountTree />
                                        </ListItemIcon>
                                        <ListItemText primary={"Routine"} />
                                    </ListItem>
                                </Link>
                                <Link to="/rapport" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"rapport"} >
                                        <ListItemIcon>
                                            <BarChart />
                                        </ListItemIcon>
                                        <ListItemText primary={"Rapport"} />
                                    </ListItem>
                                </Link>
                                <Link to="/user" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"user"} >
                                        <ListItemIcon>
                                            <Person />
                                        </ListItemIcon>
                                        <ListItemText primary={"User"} />
                                    </ListItem>
                                </Link>
                                <Link to="/market" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
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
                            <Box style={{ padding: 16 }}>
                                {
                                    this.state.loading ?
                                        <>
                                            <Typography variant='h6' >
                                                <Skeleton animation="wave" variant="text" />
                                            </Typography>
                                            <Typography variant='body2' >
                                                <Skeleton animation="wave" variant="text" />
                                            </Typography>
                                        </>
                                        :
                                        <>
                                            <Typography variant='body2'>
                                                {"Subscription free"}
                                            </Typography>
                                            <Typography variant='caption'>
                                                {"Version " + this.state.information.version + " - License GPL-3.0+"}
                                            </Typography>
                                        </>
                                }
                            </Box>
                        </Box>
                    </Drawer >
                </>

            )
        }
        return (
            <Drawer variant="persistent" anchor="left" open={true} style={{ width: 240 }} >
                <Box style={{ width: 240, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', overflowX: 'hidden' }}>
                    <List style={{ width: '100%' }}>
                        <Box style={{ display: 'flex', justifyContent: 'flex-start', padding: 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                            <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ minHeight: 40, minWidth: 40, height: '7vh', width: '7vh', borderRadius: 7, marginLeft: 15 }} />
                            <Box>
                                <Typography variant='h5' style={{ paddingTop: 15, paddingLeft: 10 }}>
                                    Intendant
                                </Typography>
                                <Typography variant='subtitle1' style={{ paddingTop: 0, paddingBottom: 15, paddingLeft: 10 }}>
                                    Smart home
                                </Typography>
                            </Box>
                        </Box>
                        <Divider />
                        <Link to="/localisation" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"localisation"}>
                                <ListItemIcon>
                                    <House />
                                </ListItemIcon>
                                <ListItemText primary={"Room"} />
                            </ListItem>
                        </Link>
                        <Link to="/smartobject" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"smartobject"}>
                                <ListItemIcon>
                                    <DevicesOther />
                                </ListItemIcon>
                                <ListItemText primary={"Smartobject"} />
                            </ListItem>
                        </Link>
                        <Link to="/module" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"module"}>
                                <ListItemIcon>
                                    <Category />
                                </ListItemIcon>
                                <ListItemText primary={"Module"} />
                            </ListItem>
                        </Link>
                        <Link to="/widget" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"widget"} >
                                <ListItemIcon>
                                    <Extension />
                                </ListItemIcon>
                                <ListItemText primary={"Widget"} />
                            </ListItem>
                        </Link>
                        <Link to="/process" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"process"} >
                                <ListItemIcon>
                                    <DeviceHub />
                                </ListItemIcon>
                                <ListItemText primary={"Process"} />
                            </ListItem>
                        </Link>
                        <Link to="/routine" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"routine"} >
                                <ListItemIcon>
                                    <AccountTree />
                                </ListItemIcon>
                                <ListItemText primary={"Routine"} />
                            </ListItem>
                        </Link>
                        <Link to="/rapport" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"rapport"} >
                                <ListItemIcon>
                                    <BarChart />
                                </ListItemIcon>
                                <ListItemText primary={"Rapport"} />
                            </ListItem>
                        </Link>
                        <Link to="/user" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"user"} >
                                <ListItemIcon>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText primary={"User"} />
                            </ListItem>
                        </Link>
                        <Link to="/market" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
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
                    <Box style={{ padding: 16 }}>
                        {
                            this.state.loading ?
                                <>
                                    <Typography variant='h6' >
                                        <Skeleton animation="wave" variant="text" />
                                    </Typography>
                                    <Typography variant='body2' >
                                        <Skeleton animation="wave" variant="text" />
                                    </Typography>
                                </>
                                :
                                <>
                                    <Typography variant='body2'>
                                        {"Subscription free"}
                                    </Typography>
                                    <Typography variant='caption'>
                                        {"Version " + this.state.information.version + " - License GPL-3.0+"}
                                    </Typography>
                                </>
                        }
                    </Box>
                </Box>
            </Drawer>
        )
    }

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default Sidebar