import React from 'react'
import { IconButton, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from '@mui/material'
import { Save } from '@mui/icons-material'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

class NewSmartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enabled: false,
            message: "",
            profiles: [],
            profile: "",
            login: "",
            password: "",
            confirmationPassword: ""
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/profiles")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({ enabled: false, message: "", profiles: result.data })
        }
    }

    async add() {
        if (this.state.login.length == 0) {
            this.setState({ enabled: true, message: "Missing login" })
        } else if (this.state.password.length == 0) {
            this.setState({ enabled: true, message: "Missing password" })
        } else if (this.state.password != this.state.confirmationPassword) {
            this.setState({ enabled: true, message: "Passwords are not the same" })
        } else {
            let result = await new Request().post({ login: this.state.login, password: this.state.password, profile: this.state.profile }).fetch("/api/users")
            if (result.error) {
                this.setState({ enabled: true, message: result.package + " : " + result.message })
            } else {
                this.props.history.push('/user')
            }
        }
    }

    render() {
        return (
            <div>
                <Paper variant='outlined' elevation={2} style={{ padding: 10, justifyContent: 'left' }}>
                    <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', alignSelf: 'start', alignContent: 'start', alignItems: 'start', padding: 10 }}>
                            <TextField placeholder='login' variant="outlined" value={this.state.login} onChange={(event) => { this.setState({ login: event.currentTarget.value }) }} />
                            <TextField type='password' placeholder='password' variant="outlined" value={this.state.password} style={{ marginTop: 10 }} onChange={(event) => { this.setState({ password: event.currentTarget.value }) }} />
                            <TextField placeholder='password confirmation' type='password' variant="outlined" value={this.state.confirmationPassword} style={{ marginTop: 10 }} onChange={(event) => { this.setState({ confirmationPassword: event.currentTarget.value }) }} />
                            <FormControl variant="outlined" style={{ width: '100%', marginTop: 10 }} >
                                <InputLabel>Profile</InputLabel>
                                <Select label="Profile" value={this.state.profile} onChange={(event) => { this.setState({ profile: event.target.value }) }} >
                                    {
                                        this.state.profiles.map((profile,index) => {
                                            return (
                                                <MenuItem key={index} value={profile.id} >{profile.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </Paper>
                <Paper style={{ width: 'min-content', height: 'min-content', padding: 2, alignContent: 'center', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 5 }}>
                    <IconButton onClick={() => { this.add() }} style={{ borderRadius: 0 }} variant='outlined'>
                        <Save />
                    </IconButton>
                </Paper>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

export default NewSmartobject