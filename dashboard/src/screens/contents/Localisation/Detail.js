import React from 'react'
import JSONPretty from 'react-json-pretty'
import { Paper, Typography, TableContainer, TableBody, Divider, ListItem, TableCell, TableRow, Button, TextField, FormControlLabel, IconButton, Switch } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FileCopy, Delete, Close, Add } from '@mui/icons-material'
import AlertComponent from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'

class DetailLocalisation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            localisation: null,
            profiles: []
        }
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultLocalisation = await new Request().get().fetch("/api/localisations/" + this.state.id)
        if (resultLocalisation.error || resultProfile.error) {
            this.props.history.push('/localisation')
        } else {
            this.setState({ localisation: resultLocalisation.data, profiles: resultProfile.data })
        }
        this.setState({ loading: null })
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/localisations/" + id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.props.history.push('/localisation')
        }
    }

    async insertProfile(localisation, profile) {
        let result = await new Request().post({idProfile: profile.id, }).fetch("/api/localisations/" + localisation.id + "/profiles")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async deleteProfile(localisation, profile) {
        let result = await new Request().delete().fetch("/api/localisations/" + localisation.id + "/profiles/" + profile.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }


    render() {
        if (this.state.localisation) {
            return (
                <div>
                    <Paper elevation={2} style={{ padding: 10, marginBottom: 10, justifyContent: 'left' }}>
                        <div style={{ padding: 10 }}>
                            <Typography variant='h4' >
                                {capitalizeFirstLetter(this.state.localisation.name)}
                            </Typography>
                        </div>
                        <Divider />
                        <div style={{ padding: 10 }}>
                            {
                                this.state.localisation.smartobjects.map(smartobject => {
                                    return (
                                        <div style={{ paddingTop: 10 }}>
                                            <Typography variant='body1' >
                                                {capitalizeFirstLetter(smartobject.reference)}
                                            </Typography>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Typography variant='h5' >
                                Authorization
                            </Typography>
                            {
                                this.state.profiles.map(profile => {
                                    let state = false
                                    this.state.localisation.profiles.forEach(pprofile => {
                                        if (pprofile.profile == profile.id) {
                                            state = true
                                        }
                                    })
                                    return (
                                        <ListItem style={{ padding: 1 }}  >
                                            <FormControlLabel control={
                                                <Switch
                                                    checked={state}
                                                    onChange={() => { 
                                                        state ? this.deleteProfile(this.state.localisation,profile) : this.insertProfile(this.state.localisation,profile)
                                                    }}
                                                    color="primary"
                                                />
                                            } label={profile.name} />
                                        </ListItem>
                                    )
                                })
                            }
                        </div>
                    </Paper>
                    <Paper style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                        <IconButton onClick={() => { this.delete(this.state.id) }} style={{ borderRadius: 5 }}>
                            <Delete />
                        </IconButton>
                    </Paper>
                    <AlertComponent onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                        { this.state.message }
                    </AlertComponent>
                </div>
            )
        } else {
            return (
                <AlertComponent onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </AlertComponent>
            )
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default DetailLocalisation