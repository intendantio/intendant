import React from 'react'
import JSONPretty from 'react-json-pretty'
import { Paper, Alert, Typography, Card, Grid, Accordion, Box, Modal, AccordionSummary, AccordionDetails, ListItem, TableCell, TableRow, Button, TextField, FormControlLabel, IconButton, Switch, Divider, CardActionArea } from '@mui/material'
import { ExpandMore, Edit, Room, FlashOff, FlashOn, House, Cached, RocketLaunch } from '@mui/icons-material'
import AlertComponent from '../../../components/Alert'
import Action from '../../../components/Action'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'
import Loading from '../../../components/Loading'
import * as AbstractIcon from '@mui/icons-material'
import DeleteButton from '../../../components/views/DeleteButton'


class DetailSmartObject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            smartobject: {
                reference: "",
                actions: [],
                room: {},
                state: {
                    status: 'unknown'
                }
            },
            expanded: "action",
            rooms: [],
            modalOpen: false,
            content: {},
            loadingAction: "",
            loading: true
        }
        props.setTitle("")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultRoom = await new Request().get().fetch("/api/rooms")
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects/" + this.state.id)
        if (resultRoom.error) {
            this.props.setMessage(resultRoom.package + " : " + resultRoom.message)
            this.props.history.push('/smartobject')
        } else if (resultSmartobject.error) {
            this.props.setMessage(resultSmartobject.package + " : " + resultSmartobject.message)
            this.props.history.push('/smartobject')
        } else {
            this.props.setTitle(resultSmartobject.data.reference)
            this.setState({ reference: resultSmartobject.data.reference, loadingAction: "", loading: false, smartobject: resultSmartobject.data, rooms: resultRoom.data })
        }
    }

    async delete() {
        let result = await new Request().delete().fetch("/api/smartobjects/" + this.state.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/smartobject')
        }
    }

    async executeAction(action, settings) {
        this.setState({ loadingAction: action.id })
        let tmp = {}
        let resetState = {}
        for (let index = 0; index < settings.length; index++) {
            let setting = settings[index]
            let value = this.state[action.id + "-" + setting.id]
            resetState[action.id + "-" + setting.id] = null
            if (value) {
                tmp[setting.id] = value
            } else {
                tmp[setting.id] = null
            }
        }
        this.setState(resetState)
        let result = await new Request().post({ settings: tmp }).fetch("/api/smartobjects/" + this.state.id + "/actions/" + action.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
            this.setState({ loadingAction: "" })
        } else {
            this.setState({
                modalOpen: true,
                content: result
            })
            this.componentDidMount()
        }
    }

    async updateRoom(room) {
        let result = await new Request().post({ idRoom: room.id }).fetch("/api/smartobjects/" + this.state.smartobject.id + "/room")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async updateReference() {
        let result = await new Request().post({ reference: this.state.reference }).fetch("/api/smartobjects/" + this.state.smartobject.id + "/reference")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }


    render() {
        let lastGroup = ""
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Box style={{ display: 'flex', flex: 1 }} >
                            <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                <Typography variant='h6' fontWeight='bold'  >
                                    {String.capitalizeFirstLetter(this.state.smartobject.reference)}
                                </Typography>
                                <Typography variant='subtitle2' color="text.secondary"  >
                                    {String.capitalizeFirstLetter(this.state.smartobject.module)}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        <Grid item xs={12} md={12} lg={12} >
                            <Accordion variant='outlined' expanded={this.state.expanded === 'action'} onChange={() => this.setState({ expanded: "action" })}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    <RocketLaunch style={{ fontSize: '28px' }} />
                                    <Typography variant='h6' style={{ marginLeft: 5 }}>
                                        Action
                                    </Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container >
                                        {
                                            this.state.smartobject.actions.map((action, index) => {
                                                let showDivider = action.group && action.group != lastGroup
                                                lastGroup = action.group ? action.group : ""
                                                return (
                                                    <>

                                                        <Grid key={index} item xs={12} md={12} lg={12} style={{ marginTop: 7 }} >
                                                            {
                                                                showDivider &&
                                                                <Divider style={{ marginBottom: 14 }}>
                                                                    <Typography textAlign='center' variant='subtitle1'>
                                                                        {lastGroup}
                                                                    </Typography>
                                                                </Divider>
                                                            }
                                                            <Grid container spacing={action.settings.length == 0 && this.props.isMobile ? 0 : 2} >
                                                                <Grid item xs={12} md={3} lg={2} >
                                                                    <Card elevation={2}  >
                                                                        <Button disabled={action.id == this.state.loadingAction} variant='contained' onClick={() => { this.executeAction(action, action.settings) }} style={{ width: '100%', flexDirection: 'row', display: 'flex' }}>
                                                                            <Typography textAlign='center' variant='subtitle2'>
                                                                                {action.name}
                                                                            </Typography>
                                                                        </Button>
                                                                    </Card>
                                                                </Grid>
                                                                <Grid item xs={12} md={9} lg={9} style={{ alignSelf: 'center', paddingLeft: 10 }}>
                                                                    <Grid container spacing={1}>
                                                                        {
                                                                            action.settings.length == 0 ?
                                                                                null
                                                                                :
                                                                                action.settings.map((setting, index) => {
                                                                                    return (
                                                                                        <Action options={setting.options} label={String.capitalizeFirstLetter(setting.id)} setState={this.setState.bind(this)} id={action.id + "-" + setting.id} action={setting} />
                                                                                    )
                                                                                })
                                                                        }
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Divider style={{ marginBottom: 7, marginTop: 14 }} />
                                                        </Grid>
                                                    </>
                                                )
                                            })
                                        }
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12} >
                            <Accordion variant='outlined' expanded={this.state.expanded === 'edit'} onChange={() => this.setState({ expanded: "edit" })}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    <Edit style={{ fontSize: '28px' }} />
                                    <Typography variant='h6' style={{ marginLeft: 5 }}>
                                        Edit
                                    </Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container spacing={1} style={{marginTop: 2}}>
                                        <Grid item xs={12} md={4} lg={4}>
                                            <TextField 
                                                value={this.state.reference} 
                                                color={this.state.smartobject.reference != this.state.reference && "warning"}
                                                onChange={(event) => { this.setState({ reference: event.nativeEvent.target.value }) }} 
                                                onBlur={(event) => {this.updateReference() }}
                                                style={{
                                                    width: '100%', 
                                                    marginRight: 10, 
                                                    marginBottom: this.props.isMobile ? 10 : 0 
                                                }} 
                                                label="Name" 
                                                variant="outlined" 
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} >
                            <Accordion variant='outlined' expanded={this.state.expanded === 'room'} onChange={() => this.setState({ expanded: "room" })}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    <House style={{ fontSize: '28px' }} />
                                    <Typography variant='h6' style={{ marginLeft: 5 }}>
                                        Room
                                    </Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container spacing={1} style={{marginTop: 2}}>
                                        {
                                            this.state.rooms.map((room, index) => {
                                                let CurrentIcon = AbstractIcon[room.icon]
                                                return (
                                                    <Grid key={index} item xs={12} md={3} lg={2}>
                                                        <Button onClick={() => { this.updateRoom(room) }} variant={room.id == this.state.smartobject.room.id ? 'contained' : 'outlined'} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderColor: 'white', width: '100%' }} >
                                                            <CurrentIcon style={{ color: 'white' }} />
                                                            <Typography variant='body1' style={{ marginLeft: 10, color: 'white' }}   >
                                                                {room.name}
                                                            </Typography>
                                                        </Button>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                    <DeleteButton onClick={() => { this.delete() }} />
                    <Modal open={this.state.modalOpen} style={{ top: '25%', left: '25%' }} onClose={() => { this.setState({ modalOpen: false }) }} >
                        <Card variant='outlined' style={{ overflow: 'auto', maxHeight: '50vh', maxWidth: '50vw', padding: 20 }}>
                            <JSONPretty style={{ fontSize: 12 }} id="json-pretty" data={this.state.content}></JSONPretty>

                        </Card>
                    </Modal>
                </Loading>
            </>
        )
    }
}

export default DetailSmartObject