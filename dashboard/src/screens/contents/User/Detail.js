import React from 'react'
import { Paper, Typography, Radio, Box, Grid, Card, FormControl, RadioGroup, FormControlLabel } from '@mui/material'
import Desktop from '../../../components/Desktop'
import Loading from '../../../components/Loading'
import DeleteButton from '../../../components/views/DeleteButton'
import Request from '../../../utils/Request'
import Moment from 'moment'

class DetailUser extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            profiles: [],
            loading: false,
            user: {
                login: "",
                imei: "",
                histories: [],
                profile: ""
            }
        }
        props.setTitle("")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultUser = await new Request().get().fetch("/api/users/" + this.state.id)
        if (resultUser.error) {
            this.props.setMessage(resultUser.package + " : " + resultUser.message)
            this.props.history.push('/user')
        } else if (resultProfile.error) {
            this.props.setMessage(resultProfile.package + " : " + resultProfile.message)
            this.props.history.push('/user')
        } else {
            this.props.setTitle(resultUser.data.login)
            this.setState({ loading: false, user: resultUser.data, profiles: resultProfile.data })
        }
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
        let result = await new Request().post({ profile: profile }).fetch("/api/users/" + this.state.id + "/profile")
        if (result.error) {
            this.setState({ loading: true })
            this.props.setMessage(result.package + " : " + result.message)
            this.componentDidMount()
        }
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Box style={{ display: 'flex', flex: 1 }} >
                            <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                <Typography variant='h6' fontWeight='bold'  >
                                    {String.capitalizeFirstLetter(this.state.user.login)}
                                </Typography>
                                <Typography variant='subtitle2' color="text.secondary"  >
                                    {this.state.user.imei}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        <Grid item xs={12} md={4} lg={4}>
                            <Card variant={'outlined'} style={{ padding: 10 }} >
                                <FormControl>
                                    <RadioGroup value={this.state.user.profile} onChange={(event) => { this.updateProfile(event.target.value) }} >
                                        {
                                            this.state.profiles.map(profile => {
                                                return (
                                                    <FormControlLabel value={profile.id} control={<Radio />} label={String.capitalizeFirstLetter(profile.name)} />
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
                    <DeleteButton onClick={() => { this.delete() }} />
                </Loading>
            </>
        )
    }
}


export default DetailUser