import React from 'react'
import { Add } from '@mui/icons-material'
import { Typography, Paper, TableBody, TableContainer, TableHead, TableCell, Table, TableRow, TablePagination, IconButton } from '@mui/material'
import { Link } from "react-router-dom"
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

class Widget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            enabled: false,
            message: "",
            widgets: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/widgets")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({ enabled: false, message: "", widgets: result.data })
        }
    }

    render() {
        return (
            <div>
                <Paper variant="outlined">
                    <TableContainer>
                        <Table>
                            <TableBody>
                                {this.state.widgets.slice(this.state.page * 10, (this.state.page + 1) * 10).map((widget, index) => (
                                    <TableRow onClick={() => { this.props.history.push("/widget/" + widget.id) }} hover key={index} style={{ cursor: 'pointer' }}>
                                        <TableCell style={{ borderBottom: 0 }}  align="left">
                                            <img style={{ width: 30, height: 30, filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + widget.icon + ".svg"} />
                                        </TableCell>
                                        <TableCell style={{ borderBottom: 0 }}  align="left">
                                            <Typography variant='body1'>
                                                {widget.reference}
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ borderBottom: 0 }}  align="left">
                                            {widget.contents.sort((a, b) => { return a.type.rank > b.type.rank }).map(content => {
                                                return content.content.split("\n").map((_content, pIndex) => {
                                                    return (
                                                        <Typography key={pIndex} variant='body1' style={{ fontWeight: content.type.reference == 'title' ? 'bold' : 'normal' }}>
                                                            {_content}
                                                        </Typography>
                                                    )
                                                })
                                            })}
                                        </TableCell>
                                        <TableCell style={{ borderBottom: 0 }}  align="left">
                                            <Typography variant='body1'>
                                                {widget.icon}
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
                            <Link to="/widget/new" style={{ textDecoration: 'none', color: 'white' }}>
                                <IconButton style={{ borderRadius: 0 }}>
                                    <Add />
                                </IconButton>
                            </Link>
                        </Paper>
                    </div>
                    <TablePagination
                        component="div"
                        count={this.state.widgets.length}
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

export default Widget