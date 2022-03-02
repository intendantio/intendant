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


class Detail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            module: {
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
        let result = await new Request().get().fetch("/api/modules/" + this.state.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
            this.props.history.push('/module')
        } else {
            this.props.setTitle(result.data.reference)
            this.setState({ loadingAction: "", loading: false, module: result.data })
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
        let result = await new Request().post({ settings: tmp }).fetch("/api/modules/" + this.state.id + "/actions/" + action.id)
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

    render() {
        let lastGroup = ""
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Box style={{ display: 'flex', flex: 1 }} >
                            <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                <Typography variant='h6' fontWeight='bold'  >
                                    {String.capitalizeFirstLetter(this.state.module.reference)}
                                </Typography>
                                <Typography variant='subtitle2' color="text.secondary"  >
                                    {String.capitalizeFirstLetter(this.state.module.name)}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Card variant='outlined' style={{ padding: 12, marginTop: 8 }} >
                        <Grid container spacing={2} >
                                {
                                    this.state.module.actions.map((action, index) => {
                                        return (
                                            <Grid key={index} item xs={12} md={12} lg={12}  >
                                                <Grid container spacing={action.settings.length == 0 && this.props.isMobile ? 0 : 2} >
                                                    <Grid item xs={12} md={3} lg={3} >
                                                        <Card elevation={2}  >
                                                            <Button disabled={action.id == this.state.loadingAction} size='large' variant='contained' onClick={() => { this.executeAction(action, action.settings) }} style={{ width: '100%', flexDirection: 'row', display: 'flex' }}>
                                                                <Typography textAlign='center' variant='subtitle2'>
                                                                    {action.name}
                                                                </Typography>
                                                            </Button>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={9} lg={9} style={{ alignSelf: 'center' }}>
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
                                            </Grid>
                                        )
                                    })
                                }
                        </Grid>
                    </Card>
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

export default Detail