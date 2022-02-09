import React from 'react'
import { MenuItem, TextField, Select, Button, Card, Box, Grid, FormControl, Typography, Paper, MobileStepper } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import Alert from '../../../components/Alert'
import SaveButton from '../../../components/views/SaveButton'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'
import md5 from 'md5'

class NewSmartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            reference: "",
            activeStep: 0,
            package: {
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
                conditions: []
            }
        }



    }

    async componentDidMount() {

        let result = await fetch("https://market.intendant.io/docs?id=" + this.props.match.params.id)
        let resultJSON = await result.json()
        let resultRooms = await new Request().get().fetch("/api/rooms")

        if (resultRooms.data.length == 0) {
            this.props.history.push('/room')
        }
        this.setState({
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
        console.log(setting)
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

    getSubmitButton(settings) {



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
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >New smartobject</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Create new smartobject</Typography>
                    </Paper>
                </Desktop>
                <Grid container spacing={2} style={{ marginBottom: 16 }}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card variant="outlined" style={{ padding: 10, flexDirection: this.props.isMobile ? 'column' : 'row', display: 'flex' }}>
                            <TextField onChange={(event) => { this.setState({ reference: event.nativeEvent.target.value }) }} style={{ width: '100%', marginRight: 10, marginBottom: this.props.isMobile ? 10 : 0 }} label="Reference" variant="outlined" />
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
                </Grid>
                <Card variant='outlined' style={{ width: 'max-content' }}>
                    {this.getSubmitButton()}
                </Card>
            </>
        )
    }
}

export default NewSmartobject

/*

                    <Grid item xs={12} md={9} lg={6}>
                        {
                            this.state.docs.conditions.length > 0 &&
                            <Card variant='outlined'>
                                <Paper square elevation={0} sx={{ display:'flex', alignItems: 'center', padding: 2, bgcolor: 'background.default' }}>
                                    <Typography >{this.state.docs.conditions[this.state.activeStep].text}</Typography>
                                </Paper>
                                <Box style={{ height: 200, padding: 10 }}>
                                </Box>
                                <MobileStepper
                                    position="static"
                                    activeStep={this.state.activeStep}
                                    variant="dots"
                                    steps={this.state.docs.conditions.length}
                                    backButton={
                                        0 == this.state.activeStep
                                            ?
                                            <Button size="small" onClick={() => { }} disabled={true} >
                                                <KeyboardArrowLeft />
                                                <Typography variant='body2' color="text.secondary">
                                                    Back
                                                </Typography>
                                            </Button>
                                            :
                                            <Button style={{ color: 'white' }} size="small" onClick={() => { this.setState({ activeStep: this.state.activeStep - 1 }) }}>
                                                <KeyboardArrowLeft />
                                                <Typography variant='body2' >
                                                    Back
                                                </Typography>
                                            </Button>
                                    }
                                    nextButton={
                                        this.state.docs.conditions.length - 1 == this.state.activeStep ?
                                            <Button size="small" onClick={() => { }} disabled={true}>
                                                <Typography variant='body2' color="text.secondary">
                                                    Next
                                                </Typography>
                                                <KeyboardArrowRight />
                                            </Button>
                                            :
                                            <Button style={{ color: 'white' }} size="small" onClick={() => { this.setState({ activeStep: this.state.activeStep + 1 }) }}>
                                                <Typography variant='body2'>
                                                    Next
                                                </Typography>
                                                <KeyboardArrowRight />
                                            </Button>
                                    }
                                />
                            </Card>
                        }
                    </Grid>

                    */