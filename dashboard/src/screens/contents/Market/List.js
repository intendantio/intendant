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
            id: props.match.params.id,
            enabled: false,
            message: "",
            markets: [],
            pageMarket: 0,
            severity: "error"
        }
    }

    async install(pPackage) {
        let result = await new Request().post({ package: pPackage }).fetch("/api/markets/install")
        if (result.error) {
            this.setState({ severity: "error",enabled: true, message: result.code + " : " + result.message })
        } else {
            this.setState({severity: "info", enabled: true, message: pPackage + " was installed" })
            this.componentDidMount()
        }
    }

    async uninstall(pPackage) {
        let result = await new Request().post({ package: pPackage }).fetch("/api/markets/uninstall")
        if (result.error) {
            this.setState({severity: "error", enabled: true, message: result.code + " : " + result.message })
        } else {
            this.setState({severity: "info", enabled: true, message: pPackage + " was removed" })
            this.componentDidMount()
        }
    }
    componentDidUpdate() {
        if (this.props.match.params.id != this.state.id) {
            this.setState({
                id: this.props.match.params.id
            }, () => { this.componentDidMount() })
        }
    }

    async componentDidMount() {
        let resultModule = await new Request().get().fetch("/api/configurations/module")
        let resultSmartobject = await new Request().get().fetch("/api/configurations/smartobject")
        let result = await fetch("https://market.intendant.io")
        let resultMarket = await result.json()
        resultMarket = resultMarket.map(market => {
            market.alreadyInstall = false
            return market
        })
        resultModule.data.forEach(pModule => {
            resultMarket = resultMarket.map(market => {
                if (market.package == pModule.id) {
                    market.alreadyInstall = true
                }

                return market
            })
        })
        resultSmartobject.data.forEach(pModule => {
            resultMarket = resultMarket.map(market => {
                if (market.package == pModule.id) {
                    market.alreadyInstall = true
                }

                return market
            })
        })
        this.setState({ markets: resultMarket.filter(market => { return market.type == this.state.id }) })
        if (resultModule.error) {
            this.setState({ severity: "error",enabled: true, message: resultModule.code + " : " + resultModule.message })
        } else if (resultSmartobject.error) {
            this.setState({ severity: "error",enabled: true, message: resultSmartobject.code + " : " + resultSmartobject.message })
        } else {
            this.setState({ modules: resultModule.data, smartobjects: resultSmartobject.data })
        }
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
                                        Dependencies
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
                            {this.state.markets.slice(this.state.pageMarket * 10, (this.state.pageMarket + 1) * 10).map((pmodule) => (
                                <TableRow hover key={pmodule.reference} style={{ cursor: 'pointer' }}>
                                    <TableCell align="left">
                                        <Typography variant='body1'>
                                            {pmodule.name}
                                        </Typography>
                                    </TableCell><TableCell align="left">
                                        <Typography variant='body1'>
                                            None
                                        </Typography>
                                    </TableCell><TableCell align="center">
                                        <Typography variant='body1'>
                                            {
                                                pmodule.alreadyInstall ?
                                                    <Button size='small' startIcon={<Close />} onClick={() => {this.uninstall(pmodule.package)}} variant="outlined" >
                                                        Remove
                                                    </Button>
                                                    :
                                                    <Button size='small' startIcon={<GetApp />} onClick={() => {this.install(pmodule.package)}} variant="outlined" disableElevation  >
                                                        Install
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
                    <div style={{ flexDirection: 'row', display: 'flex' }}>
                        <Paper style={{ width: 50, height: 50, marginTop: 10, padding: 5, marginBottom: 10, textAlign: 'center', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                            <Link to={this.state.id == "smartobject" ? "/market/module" : "/market/smartobject"} style={{ textDecoration: 'none', color: 'white' }}>
                                <IconButton style={{ borderRadius: 0 }}>
                                    {this.state.id != "smartobject" ? <DevicesOther /> : <Category />}
                                </IconButton>
                            </Link>
                        </Paper>
                    </div>
                    <TablePagination
                        component="div"
                        count={this.state.markets.length}
                        rowsPerPage={10}
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