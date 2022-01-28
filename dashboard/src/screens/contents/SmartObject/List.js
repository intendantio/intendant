import React from 'react'
import { Link } from "react-router-dom"
import Moment from 'moment'
import { Add } from '@mui/icons-material'
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Box } from '@mui/material'
import Icon from '../../../utils/Icon'
import Request from '../../../utils/Request'
import Alert from '../../../components/Alert'

class Smartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            enabled: false,
            message: "",
            smartobjects: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/smartobjects")
        if (result.error) {
            this.setState({
                enabled: true,
                message: result.package + " : " + result.message
            })
        } else {
            this.setState({
                enabled: false,
                message: "",
                smartobjects: result.data
            })
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
                        <Box>
                            <Paper variant="outlined" >
                                <TableContainer style={{ overflowX: 'hidden' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} align="left">
                                                    <Typography variant='body1'>
                                                        Reference
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} align="center">
                                                    <Typography variant='body1'>
                                                        Status
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} align="center">
                                                    <Typography variant='body1'>
                                                        Localisation
                                                    </Typography>
                                                </TableCell>
                                                {
                                                    this.props.isMobile == false &&
                                                    <TableCell style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} align="center">
                                                        <Typography variant='body1'>
                                                            Last use
                                                        </Typography>
                                                    </TableCell>
                                                }
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.smartobjects.slice(this.state.page * 10, (this.state.page + 1) * 10).map((smartobject, index) => (
                                                <TableRow onClick={() => { this.props.history.push("/smartobject/" + smartobject.id) }} hover key={index} style={{ cursor: 'pointer' }}>
                                                    <TableCell align="left" style={{ borderBottom: 0 }} >
                                                        <Typography variant='body1'>
                                                            {smartobject.reference}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" style={{ borderBottom: 0 }} >
                                                        <img style={{ height: 25, width: 25, alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + smartobject.status.icon + ".svg"} />

                                                    </TableCell>
                                                    <TableCell align="center" style={{ borderBottom: 0 }} >
                                                        <Typography variant='body1'>
                                                            {capitalizeFirstLetter(smartobject.localisation.name)}
                                                        </Typography>
                                                    </TableCell>
                                                    {
                                                        this.props.isMobile == false &&
                                                        <TableCell align="center" style={{ borderBottom: 0 }} >
                                                            <Typography variant='body1'>
                                                                {Moment(smartobject.lastUse).format("hh:mm DD/MM")}
                                                            </Typography>
                                                        </TableCell>
                                                    }
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                            <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                                <Paper variant='outlined' style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                    <Link to="/smartobject/new" style={{ textDecoration: 'none', color: 'white' }}>
                                        <IconButton style={{ borderRadius: 0 }}>
                                            <Add />
                                        </IconButton>
                                    </Link>
                                </Paper>
                                <TablePagination
                                    component="div"
                                    count={this.state.smartobjects.length}
                                    rowsPerPage={10}
                                    page={this.state.page}
                                    rowsPerPageOptions={[]}
                                    onPageChange={(event, page) => { this.setState({ page: page }) }}
                                />
                            </Box>
                        </Box>
                }
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </>
        )
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default Smartobject