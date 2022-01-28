import React from 'react'
import Package from '../../package.json'
import { Paper, TextField, Button, Typography, Switch, IconButton } from '@mui/material'
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
            enabled: false,
            getStarted: false,
            message: "",
            password: "",
            customAddress: false,
            address: window.location.origin,
            login: "admin",
            loading: true
        }
    }



    async componentDidMount() {
        let server = localStorage.getItem("server")
        let authorization = localStorage.getItem("authorization")
        if(server && authorization) {
            let result = await new Request().get().fetch("/api/smartobjects")
            if(result.error == false) {
                this.setState({ enabled: false, message: "", authentification: false })
            }
        } else if (server) {
            this.setState({ address: server.replace("http://", "") })
        }
        this.setState({loading: false})
    }

    async login() {
        if (await this.checkServer()) {
            let result = await new Request().post({ login: this.state.login, password: this.state.password }).fetch("/api/authentification")
            if (result.error) {
                this.setState({ enabled: true, message: result.package + " : " + result.message })
            } else {
                localStorage.setItem("authorization", result.token)
                this.setState({ enabled: false, message: "", authentification: false })
            }
        }
    }

    disconnect() {
        localStorage.removeItem("authorization")
        this.setState({ authentification: true, password: "" })
    }

    async checkServer() {
        let ok = true
        let protocol = window.location.protocol + "//"
        if(this.state.address.split("://").length > 1) {
            protocol = ""
        }
        try {
            let result = await fetch(protocol + this.state.address + "/api/ping", {}, 2000)
            let resultJSON = await result.json()
            if (resultJSON.message != "pong") {
                this.setState({ enabled: true, message: 'Connection to server failed' })
                ok = false
            } else {
                localStorage.setItem("server",protocol + this.state.address)
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
        if(this.state.loading ) {
            return <div/>
        }
        if (this.state.getStarted) {
            return (
                <GetStarted isMobile={this.props.isMobile} onFinish={() => { this.setState({ getStarted: false }) }} />
            )
        } else {
            if (this.state.authentification) {
                return (
                    <Paper variant='outlined' style={{ padding: 30, width: this.props.isMobile ? '380px' : '25vw', textAlign: 'center' }}>
                        <div>
                            <div style={{ marginBottom: 50 }}>
                                <img  onClick={() => {this.setState({customAddress: !this.state.customAddress}) }}  src={process.env.PUBLIC_URL + "/logo.svg"} style={{ height: '15vh', width: '15vh', borderRadius: 7, cursor: 'pointer' }} />
                                <div style={{ fontSize: 55, fontWeight: 'bold', marginTop: 0, lineHeight: 0.5 }}>
                                    Intendant
                                </div>
                                <div style={{ fontSize: 20, fontWeight: 'bold', marginTop: 0, lineHeight: 1, marginTop: 15 }}>
                                    Administration
                                </div>
                            </div>
                            <form noValidate onSubmit={(e) => { e.preventDefault(); this.login() }} autoComplete="off" style={{ marginBottom: 10 }}>
                                {
                                    this.state.customAddress ?
                                        <div style={{ padding: 5 }}>
                                            <TextField value={this.state.address} fullWidth label="Server address" autoFocus onChange={(event) => { this.setState({ address: event.nativeEvent.target.value }) }} />
                                        </div>
                                        :
                                        null
                                }

                                <div style={{ padding: 5 }}>
                                    <TextField value={this.state.login} fullWidth label="Login" autoComplete="current-login" inputProps={{ maxLength: 12 }} onChange={(event) => { this.setState({ login: event.nativeEvent.target.value }) }} />
                                </div>
                                <div style={{ padding: 5 }}>
                                    <TextField value={this.state.password} fullWidth label="Password" type='password' autoComplete="current-login" inputProps={{ maxLength: 12 }} onChange={(event) => { this.setState({ password: event.nativeEvent.target.value }) }} />
                                </div>
                                <div style={{ padding: 5, marginTop: 5, textAlign: 'end' }}>
                                    <Button color='inherit' type='submit' variant='plain' on onSubmit={() => { this.login() }} onClick={() => { this.login() }}  >
                                        Connection
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                            {this.state.message}
                        </Alert>
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
