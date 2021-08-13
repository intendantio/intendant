import React from 'react'
import Package from '../../package.json'
import { Paper, TextField, Button, Typography, Switch, IconButton } from '@material-ui/core'
import Alert from '../components/Alert'
import Main from './Main'
import GetStarted from './GetStarted'
import Request from '../utils/Request'
import { Settings } from '@material-ui/icons'

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
            address: "localhost:8000",
            login: "admin",
            isMobile: false
        }
    }


    mediaQueries(query) {
        let mediaMatch = window.matchMedia(query);
        this.setState({ isMobile: mediaMatch.matches })
        const handler = e => this.setState({ isMobile: e.matches })
        mediaMatch.addListener(handler)
    }

    componentDidMount() {
        let service = localStorage.getItem("server")
        if (service) {
            this.setState({ address: service.replace("http://", "") })
        }
        this.mediaQueries('(max-width: 900px)')
    }

    async login() {
        if (await this.checkServer()) {
            let result = await new Request().post({ login: this.state.login, password: this.state.password }).fetch("/api/authentification")
            if (result.error) {
                this.setState({ enabled: true, message: result.code + " : " + result.message })
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
        try {
            let result = await fetch("http://" + this.state.address + "/api/ping", {}, 2000)
            let resultJSON = await result.json()
            if (resultJSON.message != "pong" || resultJSON.code != "ok") {
                this.setState({ enabled: true, message: 'Connection to server failed' })
                ok = false
            } else {
                if (resultJSON.getStarted) {
                    this.setState({ getStarted: true })
                    return false
                } else {
                    localStorage.setItem("server", "http://" + this.state.address)
                }
            }
        } catch (error) {
            this.setState({ enabled: true, message: 'Connection to server failed' })
            ok = false
        }
        return ok
    }

    render() {
        if (this.state.getStarted) {
            return (
                <GetStarted onFinish={() => { this.setState({ getStarted: false }) }} />
            )
        } else {
            if (this.state.authentification) {
                return (
                    <Paper elevation={3} style={{ padding: 30, width: this.state.isMobile ? '400px' : '25vw', textAlign: 'center' }}>
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
                                    <Button type='submit' variant='plain' on onSubmit={() => { this.login() }} onClick={() => { this.login() }}  >
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
                    <Main onDisconnect={() => { this.disconnect() }} />
                )
            }
        }
    }

}

export default Authentification;
