import React from 'react'
import { Paper, TableBody, TableContainer, TableHead, TableCell, Table, TableRow, TablePagination, Typography } from '@mui/material'
import md5 from 'md5'
import { Link } from "react-router-dom"
import Request from '../../../utils/Request'
import Alert from '../../../components/Alert'

class Module extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            enabled: false,
            message: "",
            modules: []
        }
    }

    async componentDidMount() {
        let resultModule = await new Request().get().fetch("/api/configurations/module")
        if (resultModule.error) {
            this.setState({ enabled: true, message: resultModule.package + " : " + resultModule.message })
        } else {
            this.setState({ enabled: false, message: "", modules: resultModule.data })
        }
    }

    render() {
        return (
            <div>
                <Paper variant="outlined" >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{borderColor:'rgba(255, 255, 255, 0.12)'}} align='left'>
                                        <Typography variant='body1'>
                                            Identifiant
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.modules.slice(this.state.page * 10, (this.state.page + 1) * 10).map((pmodule, index) => (
                                    <TableRow onClick={() => { this.props.history.push("/module/" + md5(pmodule.name)) }} hover key={index} style={{ cursor: 'pointer' }}>
                                        <TableCell style={{ borderBottom: 0 }}  align="left">
                                            <Typography variant='body1'>
                                                {pmodule.name}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'center', alignItems: 'center' }}>
                    <TablePagination
                        component="div"
                        count={this.state.modules.length}
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

export default Module