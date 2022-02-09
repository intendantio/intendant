import React from 'react'
import JSONPretty from 'react-json-pretty'
import { Paper, Typography, Radio, Box, Grid, Card, FormControl, RadioGroup, ListItem, TableCell, TableRow, TableContainer, Table, TextField, FormControlLabel, IconButton, Switch } from '@mui/material'
import { Sensors, Delete, Devices, FlashOff, FlashOn } from '@mui/icons-material'
import AlertComponent from '../../../components/Alert'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'
import Moment from 'moment'

class DetailUser extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            profiles: [],
            user: null
        }
        props.setTitle("")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultUser = await new Request().get().fetch("/api/users/" + this.state.id)
        if (resultUser.error || resultProfile.error) {
            this.props.history.push('/user')
        } else {
            this.props.setTitle(resultUser.data.login)
            this.setState({ user: resultUser.data, profiles: resultProfile.data })
        }
        this.setState({ loading: null })
    }

    async delete() {
        let result = await new Request().delete().fetch("/api/users/" + this.state.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/users')
        }
    }

    async updateProfile(profile) {
        let result = await new Request().post({profile: profile}).fetch("/api/users/" + this.state.id + "/profile")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    render() {
        console.log(this.state)
        if (this.state.user) {
            return (
                <>
                    <Desktop {... this.props}>
                        <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                            <Box style={{ display: 'flex', flex: 1 }} >
                                <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                    <Typography variant='h5'  >
                                        {capitalizeFirstLetter(this.state.user.login)}
                                    </Typography>
                                    <Typography variant='subtitle2' color="text.secondary"  >
                                        {this.state.user.imei}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Desktop>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4} lg={4}>
                            <Card variant={'outlined'} style={{ padding: 10 }} >
                                <FormControl>
                                    <RadioGroup value={this.state.user.profile} onChange={(event) => { this.updateProfile(event.target.value)  }} >
                                        {
                                            this.state.profiles.map(profile => {
                                                return (
                                                    <FormControlLabel value={profile.id} control={<Radio />} label={capitalizeFirstLetter(profile.name)} />
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                </FormControl>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8} lg={8}>
                            <Card variant={'outlined'} style={{ padding: 10 }} >
                                <Typography variant='h5' style={{ marginBottom: 10 }}  >
                                    {"Histories"}
                                </Typography>
                                {
                                    this.state.user.histories.map(history => {
                                        let moment = Moment(history.date)
                                        return (
                                            <Typography variant='body1'  >
                                                {moment.format("HH:mm:ss") + " - " + history.action}
                                            </Typography>
                                        )
                                    })
                                }
                            </Card>
                        </Grid>
                    </Grid>
                    <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                        <IconButton onClick={() => { this.delete() }} style={{ borderRadius: 5 }}>
                            <Delete />
                        </IconButton>
                    </Paper>
                </>
            )
        } else {
            return null
        }
    }
}

function capitalizeFirstLetter(string = "") {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default DetailUser