import React from 'react'
import { IconButton, Typography, TablePagination, TableRow, Table, TableCell, TableContainer, TableBody, Paper, TableHead, Button } from '@material-ui/core'

import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'
import { Link } from "react-router-dom"
import { Category, DevicesOther, Close, GetApp } from '@material-ui/icons'

class Configuration extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enabled: false,
            message: "",
            markets: [],
            pageMarket: 0,
            severity: "error",
            loading: false
        }
    }

    async install(pPackage) {
        this.setState({ loading: true })
        let result = await new Request().post({ package: pPackage }).fetch("/api/markets/install")
        if (result.error) {
            this.setState({ loading: false, severity: "error", enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({ severity: "info", enabled: true, message: pPackage + " was installed" })
            this.componentDidMount()
        }
    }

    async upgrade(pPackage) {
        this.setState({ loading: true })
        let result = await new Request().post({ package: pPackage }).fetch("/api/markets/upgrade")
        if (result.error) {
            this.setState({ loading: false, severity: "error", enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({ severity: "info", enabled: true, message: pPackage + " was upgraded" })
            this.componentDidMount()
        }
    }

    async uninstall(pPackage) {
        this.setState({ loading: true })
        let result = await new Request().post({ package: pPackage }).fetch("/api/markets/uninstall")
        if (result.error) {
            this.setState({ loading: false, severity: "error", enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({ severity: "info", enabled: true, message: pPackage + " was removed" })
            this.componentDidMount()
        }
    }

    async componentDidMount() {
        let resultModule = await new Request().get().fetch("/api/configurations/module")
        let resultSmartobject = await new Request().get().fetch("/api/configurations/smartobject")
        let resultPing = await new Request().get().fetch("/api/ping")
        let result = await fetch("https://market.intendant.io")
        let resultMarket = await result.json()
        resultMarket = resultMarket.map(market => {
            market.mode = "install"
            market.currentVersion = "0.0.0"
            return market
        })
        resultMarket = resultMarket.map(market => {
            if (market.name == "@intendant/core") {
                if (resultPing.version != market.version) {
                    market.mode = "upgrade"
                } else {
                    market.mode = "none"
                }
                market.currentVersion = resultPing.version
            }
            return market
        })
        resultModule.data.forEach(pModule => {
            resultMarket = resultMarket.map(market => {
                if (market.name == pModule.name) {
                    market.currentVersion = pModule.version
                    if (market.version == pModule.version) {
                        market.mode = "remove"
                    } else {
                        market.mode = "update"
                    }
                }
                return market

            })
        })
        resultSmartobject.data.forEach(pModule => {
            resultMarket = resultMarket.map(market => {
                if (market.name == pModule.name) {
                    market.currentVersion = pModule.version
                    if (market.version == pModule.version) {
                        market.mode = "remove"
                    } else {
                        market.mode = "update"
                    }
                }

                return market
            })
        })
        this.setState({ markets: resultMarket })
        if (resultModule.error) {
            this.setState({ severity: "error", enabled: true, message: resultModule.package + " : " + resultModule.message })
        } else if (resultSmartobject.error) {
            this.setState({ severity: "error", enabled: true, message: resultSmartobject.package + " : " + resultSmartobject.message })
        } else {
            this.setState({ modules: resultModule.data, smartobjects: resultSmartobject.data })
        }
        this.setState({ loading: false })
    }

    render() {
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left'>
                                    <Typography variant='body1'>
                                        Name
                                    </Typography>
                                </TableCell>
                                <TableCell align='left'>
                                    <Typography variant='body1'>
                                        Type
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography variant='body1'>
                                        Version
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography variant='body1'>
                                        Action
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.markets.slice(this.state.pageMarket * 20, (this.state.pageMarket + 1) * 20).map((pmodule) => (
                                <TableRow hover key={pmodule.reference} style={{ cursor: 'pointer' }}>
                                    <TableCell align="left">
                                        <Typography variant='body1'>
                                            {pmodule.name}
                                        </Typography>
                                    </TableCell><TableCell align="left">
                                        <Typography variant='body1'>
                                            {pmodule.type}
                                        </Typography>
                                    </TableCell><TableCell align="center">
                                        <Typography variant='body1'>
                                            {pmodule.version}
                                        </Typography>
                                    </TableCell><TableCell align="center">
                                        <Typography variant='body1'>
                                            {
                                                    pmodule.mode == "none" ? 
                                                    <Typography variant='body1'>
                                                        Updated
                                                    </Typography>
                                                        :
                                                    pmodule.mode == "remove" ?
                                                        <Button disabled={this.state.loading} size='small' startIcon={<Close />} onClick={() => { this.uninstall(pmodule.name) }} variant="outlined" >
                                                            Remove
                                                        </Button>
                                                        :
                                                        pmodule.mode == "upgrade" ?
                                                            <Button disabled={this.state.loading} size='small' startIcon={<GetApp />} onClick={() => { this.uninstall(pmodule.name) }} variant="outlined" >
                                                                Upgrade
                                                            </Button>
                                                            :
                                                            pmodule.mode == "install" ?
                                                                <Button disabled={this.state.loading} size='small' startIcon={<GetApp />} onClick={() => { this.install(pmodule.name) }} variant="outlined" disableElevation  >
                                                                    Install
                                                                </Button>
                                                                :
                                                                pmodule.mode == "update" ?
                                                                    <Button disabled={this.state.loading} size='small' startIcon={<GetApp />} onClick={() => { this.install(pmodule.name) }} variant="outlined" disableElevation  >
                                                                        Update
                                                                    </Button>
                                                                    :
                                                                    <Button disabled={true} size='small' startIcon={<GetApp />} onClick={() => { this.install(pmodule.name) }} variant="outlined" disableElevation  >
                                                                        Unknown
                                                                    </Button>
                                            }
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                    <TablePagination
                        component="div"
                        count={this.state.markets.length}
                        rowsPerPage={20}
                        page={this.state.pageMarket}
                        rowsPerPageOptions={[]}
                        onChangePage={(event, page) => { this.setState({ pageMarket: page }) }}
                    />
                </div>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={this.state.severity}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

export default Configuration