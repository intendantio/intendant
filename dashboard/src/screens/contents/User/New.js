import React from 'react'
import { TextField, FormControl, Radio, Typography, Paper, Grid, Card, RadioGroup, FormControlLabel } from '@mui/material'
import SaveButton from '../../../components/views/SaveButton'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'
import Loading from '../../../components/Loading'

class NewUser extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            profiles: [],
            profile: {
                id: 0
            },
            login: "",
            loading: true,
            password: "",
            confirmationPassword: ""
        }
        props.setTitle("New user")
        props.setActionType("return")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/profiles")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
            this.props.history.push('/users')
        } else {
            this.setState({ profiles: result.data, profile: result.data[0], loading: false })
        }
    }

    async add() {
        if (this.state.login.length == 0) {
            this.props.setMessage("Missing login")
        } else if (this.state.password.length == 0) {
            this.props.setMessage("Missing password")
        } else if (this.state.password != this.state.confirmationPassword) {
            this.props.setMessage("Passwords are not the same")
        } else {
            let result = await new Request().post({ login: this.state.login, password: this.state.password, profile: this.state.profile.id, imei: "" }).fetch("/api/users")
            if (result.error) {
                this.props.setMessage(result.package + " : " + result.message)
            } else {
                this.props.history.push('/user')
            }
        }
    }

    updateProfile(id) {
        let profile = { id: 0 }
        this.state.profiles.forEach(pProfile => {
            if (pProfile.id == id) {
                profile = pProfile
            }
        })
        this.setState({ profile: profile })
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >New user</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Create new access</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Card variant='outlined' style={{ paddingTop: 4, paddingBottom: 4, paddingLeft: 12, paddingRight: 12, marginTop: 8 }}>
                        <Grid container spacing={1} style={{ marginTop: 0 }}>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField style={{ width: '100%' }} placeholder='Login' variant="outlined" value={this.state.login} onChange={(event) => { this.setState({ login: event.currentTarget.value }) }} />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <TextField style={{ width: '100%' }} type='password' placeholder='Password' variant="outlined" value={this.state.password} onChange={(event) => { this.setState({ password: event.currentTarget.value }) }} />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <TextField style={{ width: '100%' }} placeholder='Confirm password' type='password' variant="outlined" value={this.state.confirmationPassword} onChange={(event) => { this.setState({ confirmationPassword: event.currentTarget.value }) }} />
                            </Grid>
                            <Grid item xs={12} md={10} lg={7}>
                                <FormControl>
                                    <RadioGroup value={this.state.profile.id} style={{ display: 'flex', flexDirection: this.props.isMobile ? 'column' : 'row' }} onChange={(event) => { this.updateProfile(event.target.value) }} >
                                        {
                                            this.state.profiles.map(profile => {
                                                return (
                                                    <FormControlLabel value={profile.id} control={<Radio />} label={String.capitalizeFirstLetter(profile.name)} />
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Card>
                    <SaveButton onClick={() => { this.add() }} />
                </Loading>
            </>
        )
    }
}


export default NewUser