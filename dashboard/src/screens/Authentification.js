import React from 'react'
import Package from '../../package.json'
import { Paper, TextField, Button, Typography, Box, IconButton } from '@mui/material'
import Alert from '../components/Alert'
import Main from './Main'
import GetStarted from './GetStarted'
import Request from '../utils/Request'
import { Settings } from '@mui/icons-material'

class Authentification extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authentification: true,
            getStarted: false,
            password: "",
            customAddress: true,
            address: window.location.origin,
            login: "admin",
            loading: true
        }
    }



    async componentDidMount() {
        let server = localStorage.getItem("server")
        let authorization = localStorage.getItem("authorization")
        if (server && authorization) {
            let result = await new Request().get().fetch("/api/smartobjects")
            if (result.error == false) {
                this.setState({ enabled: false, authentification: false })
            }
        } else if (server) {
            this.setState({ address: server.replace("http://", "") })
        }
        this.setState({ loading: false })
    }

    async login() {
        if (await this.checkServer()) {
            let result = await new Request().post({ login: this.state.login, password: this.state.password }).fetch("/api/authentification")
            if (result.error) {
                this.props.setMessage(result.package + " : " + result.message)
            } else {
                localStorage.setItem("authorization", result.token)
                this.setState({ enabled: false, message: "", authentification: false })
            }
        }
    }

    disconnect() {
        console.log("disconnect")
        localStorage.removeItem("authorization")
        this.setState({ authentification: true, password: "" })
    }

    async checkServer() {
        let ok = true
        let protocol = window.location.protocol + "//"
        if (this.state.address.split("://").length > 1) {
            protocol = ""
        }
        try {
            let result = await fetch(protocol + this.state.address + "/api/ping", {}, 2000)
            let resultJSON = await result.json()
            if (resultJSON.message != "pong") {
                this.setState({ enabled: true, message: 'Connection to server failed' })
                ok = false
            } else {
                localStorage.setItem("server", protocol + this.state.address)
                if (resultJSON.getStarted) {
                    this.setState({ getStarted: true })
                    return false
                }
            }
        } catch (error) {
            this.setState({ enabled: true, message: 'Connection to server failed' })
            ok = false
        }
        return ok
    }

    render() {
        if (this.state.loading) {
            return <div />
        }
        if (this.state.getStarted) {
            return (
                <GetStarted isMobile={this.props.isMobile} onFinish={() => { this.setState({ getStarted: false }) }} />
            )
        } else {
            if (this.state.authentification) {
                return (
                    <Paper variant='outlined' style={{ padding: 10, width: '25vw', minWidth: 330, textAlign: 'center' }}>
                        <Box style={{ padding: 10 }}>
                            <Box style={{ marginBottom: 20 }}>
                                <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ height: '15vh', width: '15vh', minWidth: 125, minHeight: 125, borderRadius: 7 }} />
                                <Typography variant='h3' fontWeight='bold'>
                                    Intendant
                                </Typography>
                                <Typography variant='h6' fontWeight='bold'>
                                    Administration
                                </Typography>
                            </Box>
                            <form noValidate onSubmit={(e) => { e.preventDefault(); this.login() }} autoComplete="off" >
                                {
                                    this.state.customAddress ?
                                            <TextField style={{ marginTop: 5, marginBottom: 5 }} value={this.state.address} fullWidth label="Server address" autoFocus onChange={(event) => { this.setState({ address: event.nativeEvent.target.value }) }} />
                                        :
                                        null
                                }
                                <TextField style={{ marginTop: 5, marginBottom: 5 }} value={this.state.login} fullWidth label="Login" autoComplete="current-login" inputProps={{ maxLength: 12 }} onChange={(event) => { this.setState({ login: event.nativeEvent.target.value }) }} />
                                <TextField style={{ marginTop: 5, marginBottom: 5 }} value={this.state.password} fullWidth label="Password" type='password' autoComplete="current-login" inputProps={{ maxLength: 12 }} onChange={(event) => { this.setState({ password: event.nativeEvent.target.value }) }} />
                                <Box style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button color='inherit' type='submit' variant='plain' on onSubmit={() => { this.login() }} onClick={() => { this.login() }}  >
                                        Connection
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Paper>
                )
            } else {
                return (
                    <Main isMobile={this.props.isMobile} onDisconnect={() => { this.disconnect() }} />
                )
            }
        }
    }

}

export default Authentification;
