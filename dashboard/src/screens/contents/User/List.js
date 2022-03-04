import React from 'react'
import { Card, CardActionArea, Grid, Typography, Paper } from '@mui/material'
import Request from '../../../utils/Request'
import Desktop from '../../../components/Desktop'
import AddButton from '../../../components/views/AddButton'
import Loading from '../../../components/Loading'

class UserList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            users: [],
            loading: true,
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
                loading: false,
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
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Account</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >User list</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{marginTop: 0}}>
                        {
                            this.state.users.map(user => {
                                let profile = this.state.profiles.filter(profile => {
                                    return profile.id == user.profile
                                })
                                return (
                                    <Grid item xs={12} md={6} lg={4} >
                                        <Card variant={'outlined'}   >
                                            <CardActionArea style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }} onClick={() => { this.props.history.push('/user/' + user.id) }}  >
                                                <Grid container spacing={1}>
                                                    <Grid item xs={12} md={12} lg={12} >
                                                        <Typography variant='subtitle1'  >
                                                            {String.capitalizeFirstLetter(user.login)}
                                                        </Typography>
                                                        {
                                                            profile.length == 0 ?
                                                                <Typography variant='body2' color="text.secondary"  >
                                                                    {"Unknown"}
                                                                </Typography>
                                                                :
                                                                <Typography variant='body2' color="text.secondary"  >
                                                                    {String.capitalizeFirstLetter(profile[0].name)}
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
                </Loading>
            </>
        )
    }
}


export default UserList