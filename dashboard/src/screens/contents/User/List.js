import React from 'react'
import { Link } from "react-router-dom"
import Moment from 'moment'
import { Add, Delete, Settings, QrCode } from '@mui/icons-material'
import { FormControl, Button, MenuItem, Select, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton } from '@mui/material'
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
                        <Paper variant="outlined" style={{ display: 'flex', padding: 10, alignContent: 'center', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                            <Typography variant='subtitle1' style={{ fontSize: 18 }} >
                                Chargement des smartobject
                            </Typography>
                        </Paper>
                        :
                        <div>
                            <Paper variant="outlined">
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {this.state.users.sort((a, b) => {
                                            return a.profile > b.profile
                                        }).slice(this.state.page * 10, (this.state.page + 1) * 10).map((user,index) => (
                                            <TableRow hover key={index} style={{ cursor: 'pointer' }}>
                                                <TableCell align="left" style={{borderColor:'rgba(255, 255, 255, 0.12)'}}>
                                                    <Typography variant='body1'>
                                                        {
                                                            user.login
                                                        }
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left" style={{borderColor:'rgba(255, 255, 255, 0.12)'}}>
                                                    <FormControl variant="outlined"  >
                                                        <Select disabled={user.login == 'admin'} value={user.profile} onChange={(event) => { this.updateProfile(user, event.target.value) }} >
                                                            {
                                                                this.state.profiles.map((profile,pIndex) => {
                                                                    return (
                                                                        <MenuItem key={pIndex} value={profile.id} >{profile.name}</MenuItem>
                                                                    )
                                                                })
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align="right" style={{borderColor:'rgba(255, 255, 255, 0.12)'}}>
                                                    <IconButton onClick={() => { this.props.history.push('/qrcode/' + btoa(window.location.origin + "|" + user.login + "|") ) }} style={{ borderRadius: 3 }}>
                                                        <QrCode />
                                                    </IconButton>
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
                            </Paper>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                                <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
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
                                    onPageChange={(event, page) => { this.setState({ page: page }) }}
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