import React from 'react'
import Package from '../../package.json'
import { Paper, TextField, Button, Typography } from '@material-ui/core'
import Alert from '../components/Alert'
import Main from './Main'
import Request from '../utils/Request'

class GetStarted extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authentification: true,
            enabled: false,
            message: "",
            password: "",
            confirmePassword: "",
            login: "admin",
            isMobile: false
        }
    }

    componentDidMount() {
        this.mediaQueries('(max-width: 900px)')
    }
    
    mediaQueries(query) {
        let mediaMatch = window.matchMedia(query);
        this.setState({ isMobile: mediaMatch.matches })
        const handler = e => this.setState({ isMobile: e.matches })
        mediaMatch.addListener(handler)
    }


    async register() {
        if (this.state.password == this.state.confirmePassword) {
            let result = await new Request().put({ password: this.state.password }).fetch("/api/getstarted")
            if (result.error) {
                this.setState({ enabled: true, message: result.package + " : " + result.message })
            } else {
                this.props.onFinish()
            }
        } else {
            this.setState({ enabled: true, message: 'Password and password confirmation is not the same' })
        }
    }


    render() {
        return (
            <Paper elevation={3} style={{ padding: 30, width: this.state.isMobile ? '400px' : '30vw', textAlign: 'center' }}>
                <div >
                    <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ height: '15vh', width: '15vh', borderRadius: 7 }} />
                    <div style={{ fontSize: 70, fontWeight: 'bold', marginTop: 0, lineHeight: 0.5 }}>
                        Intendant
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 'bold', marginTop: 0, lineHeight: 1, marginTop: 30 }}>
                        At the first launch, you must set the admin password
                    </div>
                </div>
                <div noValidate autoComplete="off" style={{ marginBottom: 10}}>
                    <div style={{ marginTop: 10 }}>
                        <TextField value={this.state.password} fullWidth label="Password" type='password' inputProps={{ maxLength: 12 }} onChange={(event) => { this.setState({ password: event.nativeEvent.target.value }) }} />
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <TextField value={this.state.confirmePassword} fullWidth label="Confirmation" type='password' inputProps={{ maxLength: 12 }} onChange={(event) => { this.setState({ confirmePassword: event.nativeEvent.target.value }) }} />
                    </div>
                    <div style={{  marginTop: 15, textAlign: 'end' }}>
                        <Button variant='plain' onClick={() => { this.register() }}  >
                            Let's get started
                        </Button>
                    </div>
                </div>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </Paper>
        )
    }

}

export default GetStarted;
