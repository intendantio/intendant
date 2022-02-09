import React from 'react'
import { Link } from "react-router-dom"
import Moment from 'moment'
import { Add, Delete, Settings, QrCode } from '@mui/icons-material'
import { FormControl, Card, CardActionArea, Grid, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton } from '@mui/material'
import Request from '../../../utils/Request'
import Alert from '../../../components/Alert'
import Desktop from '../../../components/Desktop'
import AddButton from '../../../components/views/AddButton'

class Smartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            users: [],
            profiles: []
        }
        props.setTitle("User")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/users")
        let resultProfile = await new Request().get().fetch("/api/profiles")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else if (resultProfile.error) {
            this.props.setMessage(resultProfile.package + " : " + resultProfile.message)
        } else {
            this.setState({
                users: result.data,
                profiles: resultProfile.data
            })
        }
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/users/" + id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async updateProfile(user, profile) {
        let result = await new Request().put({
            login: user.login,
            profile: profile
        }).fetch("/api/users/" + user.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >User</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >User list</Typography>
                    </Paper>
                </Desktop>
                <Grid container spacing={2}>
                    {
                        this.state.loading ?
                            <>
                            </>
                            :
                            this.state.users.map(user => {
                                let profile = this.state.profiles.filter(profile => {
                                    return profile.id == user.profile
                                })
                                return (
                                    <Grid item xs={12} md={6} lg={4} >
                                        <Card variant={'outlined'}   >
                                            <CardActionArea style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }} onClick={() => { this.props.history.push('/user/' + user.id) }}  >
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={12} lg={12} >
                                                        <Typography variant='subtitle1'  >
                                                            {capitalizeFirstLetter(user.login)}
                                                        </Typography>
                                                        {
                                                            profile.length == 0 ?
                                                                <Typography variant='body2' color="text.secondary"  >
                                                                    {"Unknown"}
                                                                </Typography>
                                                                :
                                                                <Typography variant='body2' color="text.secondary"  >
                                                                    {capitalizeFirstLetter(profile[0].name)}
                                                                </Typography>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })
                    }
                </Grid>
                <AddButton to="/user/new" />
            </>
        )
    }
}


function capitalizeFirstLetter(string = "") {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default Smartobject