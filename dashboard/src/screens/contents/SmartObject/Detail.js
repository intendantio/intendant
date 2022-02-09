import React from 'react'
import JSONPretty from 'react-json-pretty'
import { Paper, Alert, Typography, TableContainer, Table, FormControl, Box, Select, MenuItem, TableBody, Divider, ListItem, TableCell, TableRow, Button, TextField, FormControlLabel, IconButton, Switch } from '@mui/material'
import { FileCopy, Delete, Close, Add, Send } from '@mui/icons-material'
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
            rooms: [],
            loading: null,
            referenceArguments: "",
            valueArguments: "",
            executeInformation: ""
        }
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultRoom = await new Request().get().fetch("/api/rooms")
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects/" + this.state.id)
        if (resultProfile.error || resultSmartobject.error || resultRoom.error) {
            this.props.history.push('/smartobject')
        } else {
            this.setState({ smartobject: resultSmartobject.data, profiles: resultProfile.data, rooms: resultRoom.data })
        }
        this.setState({ loading: null })
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/smartobjects/" + id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/smartobject')
        }
    }

    async executeAction(action, settings) {
        this.setState({ loading: action })
        let tmp = {}
        for (let index = 0; index < settings.length; index++) {
            let argument = settings[index];
            let value = this.state["settings-" + argument.id]
            if (value == undefined) {
                value = argument.default
            }
            tmp[argument.id] = value
        }
        let result = await new Request().post({ settings: tmp }).fetch("/api/smartobjects/" + this.state.id + "/actions/" + action)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message, loading: null })
        } else {
            if (result.data) {
                this.setState({ executeInformation: JSON.stringify(result.data) })
            }
            this.componentDidMount()
        }
    }

    async deleteSmartobjectArguments(pArguments) {
        let result = await new Request().delete().fetch("/api/smartobjects/" + pArguments.smartobject + "/arguments/" + pArguments.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async insertSmartobjectArguments(id, reference, value) {
        let result = await new Request().post({ reference: reference, value: value }).fetch("/api/smartobjects/" + id + "/arguments")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ referenceArguments: "", valueArguments: "" })
            this.componentDidMount()
        }
    }

    async insertProfile(smartobject, profile) {
        let result = await new Request().post({ idProfile: profile.id, }).fetch("/api/smartobjects/" + smartobject.id + "/profiles")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async deleteProfile(smartobject, profile) {
        let result = await new Request().delete().fetch("/api/smartobjects/" + smartobject.id + "/profiles/" + profile.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async updateRoom(smartobject, room) {
        let result = await new Request().post({ idRoom: room.id, }).fetch("/api/smartobjects/" + smartobject.id + "/room")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }


    setRoom(id) {
        this.state.rooms.forEach(pRoom => {
            if (pRoom.id === id) {
                this.state.smartobject.room = pRoom
                this.updateRoom(this.state.smartobject, pRoom)
            }
        })
    }

    render() {
        if (this.state.smartobject) {
            return (
                <div>
                    <Paper variant="outlined" style={{ padding: 10, marginBottom: 10, justifyContent: 'left' }}>
                        <div style={{ padding: 10, }}>
                            <Typography variant='h5' >
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
                            <Paper variant="outlined" style={{ marginTop: 10 }}>
                                <TableContainer>
                                    <Table >
                                        <TableBody >
                                            {this.state.smartobject.arguments.map((pArgument, index) => (
                                                <TableRow key={index} >
                                                    <TableCell style={{ borderBottom: 0 }} align="left">
                                                        <Typography variant='subtitle1'>
                                                            {pArgument.reference}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left" style={{ width: '70%', borderBottom: 0 }}>
                                                        <Typography variant='subtitle1'>
                                                            {pArgument.value.slice(0, 50) + (pArgument.value.length > 50 ? " (...)" : "")}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right" style={{ padding: 4, borderBottom: 0 }}>
                                                        <IconButton onClick={() => { navigator.clipboard.writeText(pArgument.value) }} style={{ borderRadius: 5, margin: 0 }}>
                                                            <FileCopy />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align="right" style={{ padding: 4, borderBottom: 0 }}>
                                                        <IconButton onClick={() => { this.deleteSmartobjectArguments(pArgument) }} style={{ borderRadius: 5, margin: 0 }}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow key={-1} >
                                                <TableCell style={{ borderBottom: 0 }} align="left">
                                                    <TextField value={this.state.referenceArguments} onChange={(event) => { this.setState({ referenceArguments: event.nativeEvent.target.value }) }} placeholder='Name' style={{ width: '100%' }}>
                                                    </TextField>
                                                </TableCell>
                                                <TableCell style={{ borderBottom: 0 }} align="left">
                                                    <TextField value={this.state.valueArguments} onChange={(event) => { this.setState({ valueArguments: event.nativeEvent.target.value }) }} placeholder='Value' style={{ width: '100%' }}>
                                                    </TextField>
                                                </TableCell>
                                                <TableCell style={{ borderBottom: 0 }} align="left">
                                                </TableCell>
                                                <TableCell align="right" style={{ padding: 4, borderBottom: 0 }}>
                                                    <IconButton onClick={() => { this.insertSmartobjectArguments(this.state.smartobject.id, this.state.referenceArguments, this.state.valueArguments) }} style={{ borderRadius: 5, margin: 0 }}>
                                                        <Add />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </div>
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Typography variant='h5' >
                                {"Action"}
                            </Typography>
                            {
                                this.state.smartobject.actions.map((action, index) => {
                                    return (
                                        <Paper variant="outlined" key={index} style={{ padding: 10, marginTop: 10, marginBottom: 10, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%' }}>
                                            <Box >
                                                <Button style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }} disabled={this.state.loading == action.id} onClick={() => { this.executeAction(action.id, action.settings) }} variant={'contained'}  >
                                                    <Typography variant='body2'  >
                                                        {action.name}
                                                    </Typography>
                                                </Button>
                                            </Box>
                                            {
                                                action.settings.length > 0 ?
                                                    <Box style={{ display: 'grid', gridRowGap: '10px', gridTemplateColumns: this.props.isMobile ? 'repeat(1,min-content)' : 'repeat(4,min-content)', marginTop: 10, marginBottom: 10 }}>
                                                        {
                                                            action.settings.map((setting, pIndex) => {
                                                                return <Action  key={pIndex} options={setting.options} setState={this.setState.bind(this)} action={setting} />
                                                            })
                                                        }
                                                    </Box> : null
                                            }
                                        </Paper>
                                    )
                                })
                            }
                        </div>
                        {
                            this.state.executeInformation.length > 0 ?
                                <Alert style={{ overflow: 'auto', margin: 10 }} severity="success" action={
                                    <IconButton onClick={() => { this.setState({ executeInformation: "" }) }} style={{ alignSelf: 'start' }} color="inherit" size="small">
                                        <Close />
                                    </IconButton>
                                }>
                                    <JSONPretty id="json-pretty" data={JSON.parse(this.state.executeInformation)}></JSONPretty>
                                </Alert>
                                :
                                null
                        }
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Typography variant='h5' >
                                Localisation
                            </Typography>
                            <FormControl variant="outlined" style={{ marginRight: 10, width: '300px', marginTop: 10 }} >
                                <Select value={this.state.smartobject.room.id} onChange={(event) => { this.setRoom(event.target.value) }} >
                                    {
                                        this.state.rooms.map((pRoom, index) => {
                                            return <MenuItem key={index} value={pRoom.id} >{pRoom.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </Paper>
                    <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                        <IconButton onClick={() => { this.delete(this.state.id) }} style={{ borderRadius: 5 }}>
                            <Delete />
                        </IconButton>
                    </Paper>
                </div>
            )
        } else {
            return (
                null
            )
        }
    }
}

export default DetailSmartObject