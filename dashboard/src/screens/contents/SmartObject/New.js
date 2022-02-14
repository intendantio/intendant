import React from 'react'
import { MenuItem, TextField, Select, Button, Card, Grid, FormControl, Typography, Paper, Box, Divider } from '@mui/material'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'
import * as AbstractIcon from '@mui/icons-material'
import Loading from '../../../components/Loading'

class NewSmartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            loading: true,
            reference: "",
            activeStep: 0,
            package: {
                name: "",
                settings: [],
                submit: {
                    type: "none"
                }
            },
            rooms: [],
            room: {
                id: ""
            },
            docs: {
                steps: [],
                conditions: [],
                video: ""
            }
        }
    }

    async componentDidMount() {

        let result = await fetch("https://market.intendant.io/docs?id=" + this.props.match.params.id)
        let resultJSON = await result.json()

        if (resultJSON.conditions == undefined) {
            this.props.setMessage("Missing docs")
            this.props.history.push('/smartobject')
            return
        }
        if (resultJSON.steps == undefined) {
            this.props.setMessage("Missing docs")
            this.props.history.push('/smartobject')
            return
        }
        if (resultJSON.video == undefined) {
            this.props.setMessage("Missing docs")
            this.props.history.push('/smartobject')
            return
        }
        if (resultJSON.package == undefined) {
            this.props.setMessage("Missing docs")
            this.props.history.push('/smartobject')
            return
        }

        let resultRooms = await new Request().get().fetch("/api/rooms")

        if (resultRooms.data.length == 0) {
            this.props.setMessage("You must have a minimum of one room")
            this.props.history.push('/room')
        }
        this.setState({
            loading: false,
            docs: resultJSON,
            package: resultJSON.package,
            rooms: resultRooms.data,
            room: resultRooms.data[0]
        })
    }

    setModule(name) {
        this.state.types.forEach(pModule => {
            if (pModule.name === name) {
                this.setState({
                    module: false
                }, () => {
                    this.setState({
                        module: pModule
                    })
                })
            }
        })
    }

    setLocalisation(id) {
        this.state.rooms.forEach(pLocalisation => {
            if (pLocalisation.id === id) {
                this.setState({
                    room: pLocalisation
                })
            }
        })
    }

    updateSettings(key, value) {
        let tmp = {}
        tmp["settings-" + key] = value
        this.setState(tmp)
    }

    async add() {
        if (this.state.reference === "") {
            this.props.setMessage("Missing-parameter : reference is empty")
        } else if (this.state.room === false) {
            this.props.setMessage("Missing-parameter : room not selected")
        } else if (this.state.module.name === "") {
            this.props.setMessage("Missing-parameter : type not selected")
        } else {
            let settings = []
            for (let index = 0; index < this.state.module.settings.length; index++) {
                let setting = this.state.module.settings[index];
                settings.push({
                    reference: setting.id,
                    value: this.state["settings-" + setting.id] ? this.state["settings-" + setting.id] : ""
                })
            }
            let result = await new Request().post({ room: this.state.room.id, module: this.state.module.name, reference: this.state.reference, settings: settings }).fetch("/api/smartobjects")
            if (result.error) {
                this.props.setMessage(result.package + " : " + result.message)
            } else {
                this.props.history.push('/smartobject')
            }
        }
    }

    getSettings(setting) {
        switch (setting.type) {
            case "oauth":
                if (this.state.reference.length == 0) {
                    return (
                        <Button variant='outlined' color='inherit'>
                            {
                                "Missing reference"
                            }
                        </Button>
                    )
                }

            default:
                break;
        }
    }

    getSubmitButton() {
        if (this.state.reference.length == 0) {
            return (
                <Button size='large' variant='contained' disabled style={{ height: '100%', textTransform: 'none' }} color='inherit'>
                    <Typography color="text.secondary">
                        {this.state.package.submit.name}
                    </Typography>
                </Button>
            )
        } else if (this.state.package.submit.type == "oauth") {
            return (
                <a href={this.state.package.submit.url + "?reference=" + this.state.reference + "&room=" + this.state.room.id + "&redirect_uri=" + window.location.origin + "/admin/smartobject/oauth/" + this.props.match.params.id}>
                    <Button size='large' variant='contained' style={{ height: '100%', textTransform: 'none' }} >
                        <Typography color='white' >
                            {this.state.package.submit.name}
                        </Typography>
                    </Button>
                </a>
            )
        } else if (this.state.package.submit.type == "disabled") {
            return (
                <Button size='large' disabled variant='contained' style={{ height: '100%', textTransform: 'none' }} >
                    <Typography color="text.secondary" >
                        {this.state.package.submit.name}
                    </Typography>
                </Button>
            )
        }
    }

    setRoom(id) {
        this.state.rooms.forEach(pRoom => {
            if (pRoom.id === id) {
                this.setState({
                    room: pRoom
                })
            }
        })
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >{"New smartobject"}</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >{"New " + this.state.package.name}</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card variant="outlined" style={{ padding: 10, flexDirection: this.props.isMobile ? 'column' : 'row', display: 'flex' }}>
                                <TextField onChange={(event) => { this.setState({ reference: event.nativeEvent.target.value }) }} style={{ width: '100%', marginRight: 10, marginBottom: this.props.isMobile ? 10 : 0 }} label="Name" variant="outlined" />
                                <FormControl fullWidth variant="outlined" >
                                    <Select value={this.state.room.id} onChange={(event) => { this.setRoom(event.target.value) }} >
                                        {
                                            this.state.rooms.map((pRoom, index) => {
                                                return <MenuItem key={index} value={pRoom.id} >{pRoom.name}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card variant='outlined' style={{ padding: 10 }}>
                                <Typography variant='h6' color='white' >
                                    {"Condition"}
                                </Typography>
                                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                                {
                                    this.state.docs.conditions.map((condition, index) => {
                                        return (
                                            <Box key={index} style={{ flexDirection: 'row', display: 'flex', padding: 5 }}>
                                                <Typography variant='body2' >
                                                    {condition.text}
                                                </Typography>
                                            </Box>
                                        )
                                    })
                                }
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Card variant='outlined' style={{ padding: 10 }}>
                                <Typography variant='h6' color='white' >
                                    {"Step"}
                                </Typography>
                                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                                {
                                    this.state.docs.steps.map((step, index) => {
                                        return (
                                            <Box key={index} style={{ flexDirection: 'row', display: 'flex', padding: 5 }}>
                                                <Typography variant='body2' >
                                                    {(index + 1) + " - " + step.text}
                                                </Typography>
                                            </Box>
                                        )
                                    })
                                }
                            </Card>
                        </Grid>
                        {
                            this.state.docs.video.length > 0 &&
                            <Grid item xs={12} md={12} lg={12}>
                                <Card variant='outlined' style={{ padding: 10 }}>
                                    <Typography variant='h6' color='white' >
                                        {"Video tutorial"}
                                    </Typography>
                                    <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                                    <Typography variant='body2' >
                                        <a target='_blank' style={{ color: 'white', textDecoration: 'none' }} href={this.state.docs.video}>
                                            {this.state.docs.video}
                                        </a>
                                    </Typography>
                                </Card>
                            </Grid>
                        }
                    </Grid>
                    <Card variant='outlined' style={{ width: 'max-content', marginTop: 8 }}>
                        {this.getSubmitButton()}
                    </Card>
                </Loading>
            </>
        )
    }
}

export default NewSmartobject