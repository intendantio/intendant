import React from 'react'
import { Link } from "react-router-dom"

import { IconButton, Paper, TableBody, TableContainer, TableHead, TableCell, Table, TableRow, TablePagination, Typography } from '@mui/material'
import { Add, Delete, FileCopy, PlayArrow, Edit, Pause } from '@mui/icons-material'

import Alert from '../../../components/Alert'
import Theme from '../../../Theme'
import Request from '../../../utils/Request'

class Routine extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            loading: true,
            routines: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/routines")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, routines: result.data })
        }
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/routines/" + id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async duplicate(id) {
        let result = await new Request().put().fetch("/api/routines/" + id + "/duplicate")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async updateStatus(id, status) {
        let result = await new Request().put({ status: status }).fetch("/api/routines/" + id + "/status")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    render() {
        return (
            <div>
                <Paper variant="outlined">
                <TableContainer>
                    <Table>
                        <TableBody>
                            {this.state.routines.slice(this.state.page * 10, (this.state.page + 1) * 10).map((routine) => (
                                <TableRow key={routine.id} >
                                    <TableCell align="left" style={{ borderBottom: 0 }}>
                                        <img style={{ width: 30, height: 30, filter: 'invert(100%)'  }} src={process.env.PUBLIC_URL + "/ressource/icon/" + routine.icon + ".svg"} />
                                    </TableCell>
                                    <TableCell align="left" style={{ borderBottom: 0 }}>
                                        <Typography variant='body1'>
                                            {routine.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left" style={{ borderBottom: 0 }}>
                                        <div style={{ flex: 1, flexDirection: 'row', display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'end' }}>
                                            <IconButton onClick={() => { this.updateStatus(routine.id, routine.status === 0 ? 1 : 0) }} style={{ borderRadius: 3, padding: 8, marginLeft: 2, marginRight: 2, backgroundColor: routine.status === 1 ? Theme.palette.success.main : null }}>
                                                {routine.status === 0 ? <PlayArrow /> : <Pause />}
                                            </IconButton>
                                            <IconButton onClick={() => { this.props.history.push('/routine/' + routine.id) }} style={{ borderRadius: 3, padding: 8, marginLeft: 2, marginRight: 2 }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => { this.duplicate(routine.id) }} style={{ borderRadius: 3, padding: 8, marginLeft: 2, marginRight: 2 }}>
                                                <FileCopy />
                                            </IconButton>
                                            <IconButton onClick={() => { this.delete(routine.id) }} style={{ borderRadius: 3, padding: 8, marginLeft: 2, marginRight: 2 }}>
                                                <Delete />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
           
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                    <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Link to="/routine/new" style={{ textDecoration: 'none', color: 'white' }}>
                            <IconButton style={{ borderRadius: 0 }}>
                                <Add />
                            </IconButton>
                        </Link>
                    </Paper>
                    <TablePagination component="div" count={this.state.routines.length} rowsPerPage={10} page={this.state.page} rowsPerPageOptions={[]} onPageChange={(event, page) => { this.setState({ page: page }) }} />
                </div>
            </div>
        )
    }
}

export default Routine