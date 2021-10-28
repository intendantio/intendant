import React from 'react'
import JSONPretty from 'react-json-pretty'
import { Paper, Typography, TableContainer, TableBody, Divider, ListItem, TableCell, TableRow, Button, TextField, FormControlLabel, IconButton, Switch } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FileCopy, Delete, Close, Add } from '@material-ui/icons'
import AlertComponent from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'

class DetailSmartObject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            smartobject: null,
            profiles: [],
            enabled: false,
            message: "",
            referenceSettings: "",
            valueSettings: "",
            executeInformation: ""
        }
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects/" + this.state.id)
        if (resultProfile.error || resultSmartobject.error) {
            this.props.history.push('/smartobject')
        } else {
            this.setState({ smartobject: resultSmartobject.data, profiles: resultProfile.data })
        }
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/smartobjects/" + id)
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            this.props.history.push('/smartobject')
        }
    }

    async executeAction(action, settings) {
        let tmp = {}
        for (let index = 0; index < settings.length; index++) {
            let argument = settings[index];
            let value = this.state["argument-" + argument.id]
            if (value == undefined) {
                value = argument.default
            }
            tmp[argument.id] = value
        }
        let result = await new Request().post({ settings: tmp }).fetch("/api/smartobjects/" + this.state.id + "/actions/" + action)
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            if (result.data) {
                this.setState({ executeInformation: JSON.stringify(result.data) })
            }
            this.componentDidMount()
        }
    }

    async deleteSmartobjectSettings(settings) {
        let result = await new Request().delete().fetch("/api/smartobjects/" + settings.smartobject + "/settings/" + settings.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async insertSmartobjectSettings(id, reference, value) {
        let result = await new Request().post({ reference: reference, value: value }).fetch("/api/smartobjects/" + id + "/settings")
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            this.setState({ referenceSettings: "", valueSettings: "" })
            this.componentDidMount()
        }
    }

    async insertProfile(smartobject, profile) {
        let result = await new Request().post({idProfile: profile.id, }).fetch("/api/smartobjects/" + smartobject.id + "/profiles")
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async deleteProfile(smartobject, profile) {
        let result = await new Request().delete().fetch("/api/smartobjects/" + smartobject.id + "/profiles/" + profile.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    render() {
        if (this.state.smartobject) {
            return (
                <div>
                    <Paper elevation={2} style={{ padding: 10, marginBottom: 10, justifyContent: 'left' }}>
                        <div style={{ padding: 10 }}>
                            <Typography variant='h4' >
                                {this.state.smartobject.reference}
                            </Typography>
                            <Typography variant='subtitle1' >
                                {this.state.smartobject.module}
                            </Typography>
                        </div>
                        <Divider />
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Typography variant='h5' >
                                Configuration
                            </Typography>
                            <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', flexDirection: 'row' }}>
                                <TableContainer component={Paper} >
                                    <TableBody>
                                        {this.state.smartobject.settings.map((setting) => (
                                            <TableRow key={setting.id} >
                                                <TableCell align="left">
                                                    <Typography variant='subtitle1'>
                                                        {setting.reference}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left" style={{ width: '70%' }}>
                                                    <Typography variant='subtitle1'>
                                                        {setting.value.slice(0, 50) + (setting.value.length > 50 ? " (...)" : "")}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right" style={{ padding: 4 }}>
                                                    <IconButton onClick={() => { navigator.clipboard.writeText(setting.value) }} style={{ borderRadius: 5, margin: 0 }}>
                                                        <FileCopy />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="right" style={{ padding: 4 }}>
                                                    <IconButton onClick={() => { this.deleteSmartobjectSettings(setting) }} style={{ borderRadius: 5, margin: 0 }}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow key={"-1"} >
                                            <TableCell align="left">
                                                <TextField value={this.state.referenceSettings} onChange={(event) => { this.setState({ referenceSettings: event.nativeEvent.target.value }) }} placeholder='Name' style={{ width: '100%' }}>
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="left">
                                                <TextField value={this.state.valueSettings} onChange={(event) => { this.setState({ valueSettings: event.nativeEvent.target.value }) }} placeholder='Value' style={{ width: '100%' }}>
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="right" style={{ padding: 4 }}>
                                                <IconButton onClick={() => { this.insertSmartobjectSettings(this.state.smartobject.id, this.state.referenceSettings, this.state.valueSettings) }} style={{ borderRadius: 5, margin: 0 }}>
                                                    <Add />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </TableContainer>
                            </div>
                        </div>
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Typography variant='h5' >
                                {"Action"}
                            </Typography>
                            {
                                this.state.smartobject.actions.map(action => {
                                    return (
                                        <Paper style={{ padding: 10, marginTop: 10, marginBottom: 10, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%' }}>
                                            <Button onClick={() => { this.executeAction(action.id, action.settings) }} variant='outlined' style={{ width: '250px', height: '100%' }} >
                                                {action.name}
                                            </Button>
                                            
                                            {
                                                action.settings.length > 0 ?
                                                    <div style={{ display: 'grid', gridRowGap:'10px', gridTemplateColumns: 'repeat(5,min-content)' , marginTop: 10, marginBottom: 10 }}>
                                                        {
                                                            action.settings.map(setting => {
                                                                return <Action flexDirection='column' orientation='horizontal' setState={this.setState.bind(this)} action={setting} />
                                                            })
                                                        }
                                                    </div> : null
                                            }
                                        </Paper>
                                    )
                                })
                            }
                        </div>
                        {
                            this.state.executeInformation.length > 0 ?
                                <div style={{ padding: 10 }}>
                                    <Alert severity="success" action={
                                        <IconButton onClick={() => { this.setState({ executeInformation: "" }) }} style={{ alignSelf: 'start' }} color="inherit" size="small">
                                            <Close />
                                        </IconButton>
                                    }>
                                        <JSONPretty id="json-pretty" data={JSON.parse(this.state.executeInformation)}></JSONPretty>
                                    </Alert>
                                </div>
                                :
                                null
                        }
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Typography variant='h5' >
                                Authorization
                            </Typography>
                            {
                                this.state.profiles.map(profile => {
                                    let state = false
                                    this.state.smartobject.profiles.forEach(pprofile => {
                                        if (pprofile.profile == profile.id) {
                                            state = true
                                        }
                                    })
                                    return (
                                        <ListItem style={{ padding: 1 }}  >
                                            <FormControlLabel control={
                                                <Switch
                                                    checked={state}
                                                    onChange={() => { 
                                                        state ? this.deleteProfile(this.state.smartobject,profile) : this.insertProfile(this.state.smartobject,profile)
                                                    }}
                                                    color="primary"
                                                />
                                            } label={profile.name} />
                                        </ListItem>
                                    )
                                })
                            }
                        </div>
                    </Paper>
                    <Paper style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                        <IconButton onClick={() => { this.delete(this.state.id) }} style={{ borderRadius: 5 }}>
                            <Delete />
                        </IconButton>
                    </Paper>
                    <AlertComponent onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                        { this.state.message }
                    </AlertComponent>
                </div>
            )
        } else {
            return (
                <AlertComponent onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </AlertComponent>
            )
        }
    }
}

export default DetailSmartObject