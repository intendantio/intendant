import React from 'react'
import { Paper, Typography, Box, Grid, Card, CardActionArea, FormControlLabel, Switch } from '@mui/material'
import { FlashOff, FlashOn } from '@mui/icons-material'
import Desktop from '../../../components/Desktop'
import DeleteButton from '../../../components/views/DeleteButton'
import Request from '../../../utils/Request'
import * as AbstractIcon from '@mui/icons-material'
import Loading from '../../../components/Loading'

class DetailRoom extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            room: {
                icon: "Autorenew",
                name: "",
                description: "",
                smartobjects: []
            },
            loading: true,
            profiles: []
        }
        props.setTitle("")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultRoom = await new Request().get().fetch("/api/rooms/" + this.state.id)
        if (resultRoom.error) {
            this.props.setMessage(resultRoom.package + " : " + resultRoom.message)
            this.props.history.push('/room')
        } else if (resultProfile.error) {
            this.props.setMessage(resultProfile.package + " : " + resultProfile.message)
            this.props.history.push('/room')
        } else {
            this.props.setTitle(resultRoom.data.name)
            this.setState({ loading: false, room: resultRoom.data, profiles: resultProfile.data })
        }
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
        let CurrentIcon = AbstractIcon[this.state.room.icon]
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Box style={{ display: 'flex', flex: 1 }} >
                            {
                                this.state.loading ? null :
                                <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                    <CurrentIcon fontSize='large' />
                                </Box> 
                            }
                            <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                <Typography variant='h6'  fontWeight='bold' >
                                    {String.capitalizeFirstLetter(this.state.room.name)}
                                </Typography>
                                <Typography variant='subtitle2' color="text.secondary"   >
                                    {String.capitalizeFirstLetter(this.state.room.description)}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{marginTop: 0}} >
                        {
                            this.state.room.smartobjects.length == 0 ?
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card variant='outlined' style={{ padding: 12 }}  >
                                        <Typography variant='subtitle1' color="text.secondary" >You have not added a smartobject</Typography>
                                    </Card>
                                </Grid>
                                :
                                this.state.room.smartobjects.map((smartobject, index) => {
                                    return (
                                        <Grid key={index} item xs={12} md={6} lg={6} >
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
                                                    } label={String.capitalizeFirstLetter(profile.name)} />
                                                </Box>
                                            )
                                        })
                                    }
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                    <DeleteButton onClick={() => { this.delete(this.state.id) }} />
                </Loading>
            </>
        )
    }
}


export default DetailRoom