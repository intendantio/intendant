import React from 'react'
import { Typography, Button, ListItemText, ListItem, Divider, List, Paper } from '@material-ui/core'
import Theme from '../../../Theme'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

class Security extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            enabled: false,
            message: "",
            profiles: [],
            selectProfile: '',
            authorizations: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/profiles")
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            if (this.state.selectProfile === "") {
                this.setState({
                    enabled: false,
                    message: "",
                    profiles: result.data,
                    selectProfile: result.data[0].id
                })
                this.onSelectProfile(result.data[0].id)
            } else {
                this.setState({
                    enabled: false,
                    message: "",
                    profiles: result.data
                })
                this.onSelectProfile(this.state.selectProfile)
            }
        }
    }

    getColor(type) {
        switch (type) {
            default:
            case 'GET':
                return Theme.palette.success.main
            case 'POST':
                return Theme.palette.error.main
            case 'PUT':
                return Theme.palette.warning.main
            case 'DELETE':
                return Theme.palette.info.main
        }
    }

    async onSelectProfile(id) {
        this.setState({
            selectProfile: id
        })
        let result = await new Request().get().fetch("/api/profiles/" + id + "/authorizations")
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            this.setState({
                enabled: false,
                message: "",
                authorizations: result.data
            })
        }
    }

    async updateSecure(profile, pAuthorization, secure) {
        let result = await new Request().post({ authorization: pAuthorization, secure: secure }).fetch("/api/profiles/" + profile + "/authorizations")
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    render() {
        return (
            <div>
                <Paper style={{ padding: 10, marginBottom: 10, flexDirection: 'row', display: 'flex' }}>
                    {
                        this.state.profiles.map(profile => {
                            return (
                                <Button style={{ marginLeft: 5, marginRight: 5 }} onClick={() => { this.onSelectProfile(profile.id) }} variant={this.state.selectProfile === profile.id ? 'contained' : 'outlined'} >
                                    {
                                        profile.name
                                    }
                                </Button>
                            )
                        })
                    }
                </Paper>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <List style={{ backgroundColor: Theme.palette.background.paper, width: '45%' }}>
                        <ListItem >
                            <ListItemText >
                                <Typography variant='subtitle1' style={{ display: 'flex', padding: 3, borderRadius: 3, backgroundColor: Theme.palette.error.main, alignContent: 'center', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                    Refusé
                                </Typography>
                            </ListItemText>
                        </ListItem>
                        <Divider />
                        {
                            this.state.authorizations.sort((a, b) => { return a.method < b.method }).filter(a => { return a.secure === 0 }).map(authorization => {
                                return (
                                    <ListItem button onClick={() => { this.updateSecure(this.state.selectProfile, authorization.id, 1) }}>
                                        <ListItemText style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <Typography variant='body' style={{ padding: 3, paddingLeft: 8, paddingRight: 8, borderRadius: 3, backgroundColor: this.getColor(authorization.method) }}>
                                                    {authorization.method}
                                                </Typography>
                                                <Typography variant='body' style={{ padding: 3, borderRadius: 3, marginLeft: 5 }}>
                                                    {authorization.reference}
                                                </Typography>
                                            </div>
                                        </ListItemText>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <List style={{ backgroundColor: Theme.palette.background.paper, width: '45%' }}>
                        <ListItem >
                            <ListItemText >
                                <Typography variant='subtitle1' style={{ display: 'flex', padding: 3, borderRadius: 3, backgroundColor: Theme.palette.success.main, alignContent: 'center', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                    Authorisé
                                </Typography>
                            </ListItemText>
                        </ListItem>
                        <Divider />
                        {
                            this.state.authorizations.sort((a, b) => { return a.method < b.method }).filter(a => { return a.secure === 1 }).map(authorization => {
                                return (
                                    <ListItem button onClick={() => { this.updateSecure(this.state.selectProfile, authorization.id, 0) }} >
                                        <ListItemText style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <Typography variant='body' style={{ padding: 3, paddingLeft: 8, paddingRight: 8, borderRadius: 3, backgroundColor: this.getColor(authorization.method) }}>
                                                    {authorization.method}
                                                </Typography>
                                                <Typography variant='body' style={{ padding: 3, borderRadius: 3, marginLeft: 5 }}>
                                                    {authorization.reference}
                                                </Typography>
                                            </div>
                                        </ListItemText>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </div>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    { this.state.message }
                </Alert>
            </div>
        )
    }
}

export default Security