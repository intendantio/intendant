import React from 'react'
import { Link } from "react-router-dom"
import { Add } from '@mui/icons-material'
import { Typography, TablePagination, TableRow, Table, TableCell, TableHead, TableContainer, TableBody, Paper, IconButton } from '@mui/material'
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
                <Paper variant="outlined">
                <TableContainer>
                    <Table>
                        <TableBody>
                            {this.state.processs.slice(this.state.page * 10, (this.state.page + 1) * 10).map((_process, index) => (
                                <TableRow onClick={() => { this.props.history.push("/process/" + _process.id) }} hover key={index} style={{ cursor: 'pointer' }}>
                                    <TableCell align="left" style={{borderColor:'rgba(255, 255, 255, 0.12)'}}>
                                        <img style={{ width: 30, height: 30, filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + _process.icon + ".svg"} />
                                    </TableCell>
                                    <TableCell align="left" style={{borderColor:'rgba(255, 255, 255, 0.12)'}}>
                                        <Typography variant='body1'>
                                            {_process.reference}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" style={{borderColor:'rgba(255, 255, 255, 0.12)'}}>
                                        <Typography variant='body1'>
                                            {_process.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" style={{borderColor:'rgba(255, 255, 255, 0.12)'}}>
                                        <Typography variant='body1'>
                                            {_process.espace.reference}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                    <div style={{ flexDirection: 'row', display: 'flex' }}>
                        <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
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
                        onPageChange={(event, page) => { this.setState({ page: page }) }}
                    />
                </div>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

export default Process