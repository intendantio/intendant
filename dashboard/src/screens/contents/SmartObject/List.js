import React from 'react'
import { Link } from "react-router-dom"
import Moment from 'moment'
import { Add } from '@material-ui/icons'
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton  } from '@material-ui/core'
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
                        <div>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">
                                                <Typography variant='body1'>
                                                    Reference
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant='body1'>
                                                    Status
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant='body1'>
                                                    Last use
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.smartobjects.slice(this.state.page * 10, (this.state.page + 1) * 10).map((smartobject) => (
                                            <Link to={"/smartobject/" + smartobject.id} style={{ textDecoration: 'none', color: 'white', display:'contents' }}>
                                                <TableRow hover key={smartobject.name} style={{ cursor: 'pointer' }}>
                                                    <TableCell align="left">
                                                        <Typography variant='body1'>
                                                            {smartobject.reference}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant='body1'>
                                                            <img style={{ height: 25, width: 25, alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + smartobject.status.icon + ".svg"} />
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant='body1'>
                                                            {Moment(smartobject.lastUse).format("hh:mm DD/MM") }
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </Link>

                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                                <Paper style={{ width: 50, height: 50, marginTop: 10, padding: 5, marginBottom: 10, textAlign: 'center', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
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
                                    onChangePage={(event, page) => { this.setState({ page: page }) }}
                                />
                            </div>
                        </div>
                }
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    { this.state.message }
                </Alert>
            </>
        )
    }
}

export default Smartobject