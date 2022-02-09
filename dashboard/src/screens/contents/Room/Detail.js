import React from 'react'
import JSONPretty from 'react-json-pretty'
import { Paper, Typography, Box, Grid, Card, CardActionArea, AccordionDetails, AccordionSummary, ListItem, TableCell, TableRow, TableContainer, Table, TextField, FormControlLabel, IconButton, Switch } from '@mui/material'
import { Sensors, Delete, Lightbulb, Devices, FlashOff, FlashOn } from '@mui/icons-material'
import AlertComponent from '../../../components/Alert'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'
import TypeProduct from '../../../components/TypeProduct'
import * as AbstractIcon from '@mui/icons-material'

class DetailRoom extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            room: null,
            profiles: [],
            smartobjects: []
        }
        props.setTitle("")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultRoom = await new Request().get().fetch("/api/rooms/" + this.state.id)
        if (resultRoom.error || resultProfile.error) {
            this.props.history.push('/room')
        } else {
            this.props.setTitle(resultRoom.data.name)
            this.setState({ room: resultRoom.data, profiles: resultProfile.data, smartobjects: resultRoom.data.smartobjects })
        }
        this.setState({ loading: null })
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/rooms/" + id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/room')
        }
    }

    async insertProfile(profile) {
        let result = await new Request().post({ idProfile: profile.id, }).fetch("/api/rooms/" + this.state.room.id + "/profiles")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async deleteProfile(profile) {
        let result = await new Request().delete().fetch("/api/rooms/" + this.state.room.id + "/profiles/" + profile.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }


    render() {
        if (this.state.room) {
            let CurrentIcon = AbstractIcon[this.state.room.icon]
            return (
                <div>

                    <Desktop {... this.props}>
                        <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                            <Box style={{ display: 'flex', flex: 1 }} >
                                <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                    <CurrentIcon fontSize='large' />
                                </Box>
                                <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                    <Typography variant='h5'  >
                                        {capitalizeFirstLetter(this.state.room.name)}
                                    </Typography>
                                    <Typography variant='subtitle2' color="text.secondary"  >
                                        {capitalizeFirstLetter(this.state.room.description)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Desktop>
                    <Grid container spacing={2}>
                        {
                            this.state.loading ?
                                <>
                                    <ProcessSkeleton />
                                    <ProcessSkeleton />
                                    <ProcessSkeleton />
                                    <ProcessSkeleton />
                                </>
                                :
                                this.state.smartobjects.length == 0 ?
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Card variant='outlined' style={{ padding: 12 }}  >
                                            <Typography variant='subtitle1' color="text.secondary" >You have not added a smartobject</Typography>
                                        </Card>
                                    </Grid>
                                    :
                                    this.state.smartobjects.map(smartobject => {
                                        return (
                                            <Grid item xs={12} md={6} lg={4} >
                                                <Card variant={'outlined'}   >
                                                    <CardActionArea style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }} onClick={() => { this.props.history.push('/smartobject/' + smartobject.id) }}  >

                                                        <Box style={{ display: 'flex', flex: 1 }} >
                                                            <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                                                {smartobject.state.status == "online" ? <FlashOn fontSize='large' /> : <FlashOff color='disabled' fontSize='large' />}
                                                            </Box>
                                                            <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                                                <Typography variant='subtitle1' color={smartobject.state.status == "online" ? "text.primary" : "text.secondary"} >
                                                                    {smartobject.reference}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                        }
                        <Grid item xs={12} md={12} lg={12}>
                            <Card variant='outlined' style={{ padding: 12 }}  >
                                <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {
                                    this.state.profiles.map((profile, index) => {
                                        let state = this.state.room.profiles.filter(pprofile => {
                                            return pprofile.profile == profile.id
                                        }).length > 0
                                        return (
                                            <Box key={index} style={{ padding: 1 }}  >
                                                <FormControlLabel control={
                                                    <Switch
                                                        checked={state}
                                                        onChange={() => {
                                                            state ? this.deleteProfile(profile) : this.insertProfile(profile)
                                                        }}
                                                        color="primary"
                                                    />
                                                } label={capitalizeFirstLetter(profile.name)} />
                                            </Box>
                                        )
                                    })
                                }
                                </Box>
                                
                            </Card>
                        </Grid>
                    </Grid>
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

function capitalizeFirstLetter(string = "") {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default DetailRoom