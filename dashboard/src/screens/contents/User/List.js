import React from 'react'
import { Link } from "react-router-dom"
import Moment from 'moment'
import { Add, Delete, Settings } from '@material-ui/icons'
import { FormControl, Button, MenuItem, Select, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton } from '@material-ui/core'
import Request from '../../../utils/Request'
import Alert from '../../../components/Alert'

class Smartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            enabled: false,
            message: "",
            users: [],
            profiles: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/users")
        let resultProfile = await new Request().get().fetch("/api/profiles")
        if (result.error) {
            this.setState({
                enabled: true,
                message: result.package + " : " + result.message
            })
        } else if (resultProfile.error) {
            this.setState({
                enabled: true,
                message: resultProfile.package + " : " + resultProfile.message
            })
        } else {
            this.setState({
                enabled: false,
                message: "",
                users: result.data,
                profiles: resultProfile.data
            })
        }
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/users/" + id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
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
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    render() {
        return (
            <>
                {
                    this.state.loading ?
                        <Paper style={{ display: 'flex', padding: 10, alignContent: 'center', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                            <Typography variant='subtitle1' style={{ fontSize: 18 }} >
                                Chargement des smartobject
                            </Typography>
                        </Paper>
                        :
                        <div>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {this.state.users.sort((a, b) => {
                                            return a.profile > b.profile
                                        }).slice(this.state.page * 10, (this.state.page + 1) * 10).map((user) => (
                                            <TableRow hover key={user.id} style={{ cursor: 'pointer' }}>
                                                <TableCell align="left">
                                                    <Typography variant='body1'>
                                                        {
                                                            user.login
                                                        }
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <FormControl variant="outlined"  >
                                                        <Select disabled={user.login == 'admin'} value={user.profile} onChange={(event) => { this.updateProfile(user, event.target.value) }} >
                                                            {
                                                                this.state.profiles.map(profile => {
                                                                    return (
                                                                        <MenuItem value={profile.id} >{profile.name}</MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => { this.props.history.push('/user/' + user.id +  "/password") }} style={{ borderRadius: 3 }}>
                                                        <Settings />
                                                    </IconButton>
                                                    <IconButton onClick={() => { this.delete(user.id) }} style={{ borderRadius: 3 }}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                                <Paper style={{ width: 50, height: 50, marginTop: 10, padding: 5, marginBottom: 10, textAlign: 'center', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                                    <Link to="/user/new" style={{ textDecoration: 'none', color: 'white' }}>
                                        <IconButton style={{ borderRadius: 0 }}>
                                            <Add />
                                        </IconButton>
                                    </Link>
                                </Paper>
                                <TablePagination
                                    component="div"
                                    count={this.state.users.length}
                                    rowsPerPage={10}
                                    page={this.state.page}
                                    rowsPerPageOptions={[]}
                                    onChangePage={(event, page) => { this.setState({ page: page }) }}
                                />
                            </div>
                        </div>
                }
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </>
        )
    }
}

export default Smartobject