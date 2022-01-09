import React from 'react'
import { IconButton, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from '@mui/material'
import { Save } from '@mui/icons-material'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

class NewPassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enabled: false,
            id: props.match.params.id,
            message: "",
            confirmationPassword: "",
            password: ""
        }
    }

    async changePassword() {
        if(this.state.password.length == 0) {
            this.setState({ enabled: true, message: "Missing password" })
        } else if(this.state.confirmationPassword.length == 0) {
            this.setState({ enabled: true, message: "Missing confirmation password" })
        } else if(this.state.password != this.state.confirmationPassword) {
            this.setState({ enabled: true, message: "Passwords are not the same" })
        } else {
            let result = await new Request().post({password: this.state.password}).fetch("/api/users/" + this.state.id + "/password")
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
                <Paper variant="outlined" style={{ padding: 10, justifyContent: 'left' }}>
                    <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', alignSelf: 'start', alignContent: 'start', alignItems: 'start', padding: 10 }}>
                            <TextField placeholder='password' type='password' variant="outlined" value={this.state.password} onChange={(event) => { this.setState({ password: event.currentTarget.value }) }} />
                            <TextField placeholder='password confirmation' type='password' variant="outlined" value={this.state.confirmationPassword} style={{marginTop: 10}} onChange={(event) => { this.setState({ confirmationPassword: event.currentTarget.value }) }} />
                        </div>
                    </div>
                </Paper>
                <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <IconButton onClick={() => { this.changePassword() }} style={{ borderRadius: 0 }} variant='outlined'>
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

export default NewPassword