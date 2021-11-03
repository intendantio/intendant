import React from 'react'
import { Link } from "react-router-dom"
import { Add } from '@material-ui/icons'
import { Typography, TablePagination, TableRow, Table, TableCell, TableHead, TableContainer, TableBody, Paper, IconButton } from '@material-ui/core'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

class Process extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            enabled: false,
            message: "",
            processs: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/process")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({ processs: result.data })
        }
    }

    render() {
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {this.state.processs.slice(this.state.page * 10, (this.state.page + 1) * 10).map((_process) => (
                                <Link to={"/process/" + _process.id} style={{ textDecoration: 'none', color: 'white', display: 'contents' }}>
                                    <TableRow hover key={_process.name} style={{ cursor: 'pointer' }}>
                                    <TableCell align="left">
                                        <img style={{ width: 30, height: 30, filter: 'invert(100%)'  }} src={process.env.PUBLIC_URL + "/ressource/icon/" + _process.icon + ".svg"} />
                                    </TableCell>
                                        <TableCell align="left">
                                            <Typography variant='body1'>
                                                {_process.reference}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography variant='body1'>
                                                {_process.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography variant='body1'>
                                                {_process.espace.reference}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </Link>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                    <div style={{ flexDirection: 'row', display: 'flex' }}>
                        <Paper style={{ width: 50, height: 50, marginTop: 10, padding: 5, marginBottom: 10, textAlign: 'center', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                            <Link to="/process/new" style={{ textDecoration: 'none', color: 'white' }}>
                                <IconButton style={{ borderRadius: 0 }}>
                                    <Add />
                                </IconButton>
                            </Link>
                        </Paper>
                    </div>
                    <TablePagination
                        component="div"
                        count={this.state.processs.length}
                        rowsPerPage={10}
                        page={this.state.page}
                        rowsPerPageOptions={[]}
                        onChangePage={(event, page) => { this.setState({ page: page }) }}
                    />
                </div>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    { this.state.message }
                </Alert>
            </div>
        )
    }
}

export default Process