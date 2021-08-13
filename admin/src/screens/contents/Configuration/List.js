import React from 'react'
import { Typography, TablePagination, TableRow, Table, TableCell, TableContainer, TableBody, Paper, TableHead } from '@material-ui/core'

import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

class Configuration extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            pageSmartobject: 0,
            pageModule: 0,
            enabled: false,
            message: "",
            modules: [],
            smartobjects: []
        }
    }

    async componentDidMount() {
        let resultModule = await new Request().get().fetch("/api/configurations/module")
        let resultSmartobject = await new Request().get().fetch("/api/configurations/smartobject")
        if (resultModule.error) {
            this.setState({ enabled: true, message: resultModule.code + " : " + resultModule.message })
        } else if (resultSmartobject.error) {
            this.setState({ enabled: true, message: resultSmartobject.code + " : " + resultSmartobject.message })
        } else {
            this.setState({ enabled: false, message: "", modules: resultModule.data, smartobjects: resultSmartobject.data })
        }
    }

    render() {
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left'>
                                    <Typography variant='body1'>
                                        Identifiant
                                    </Typography>
                                </TableCell>
                                <TableCell align='left'>
                                    <Typography variant='body1'>
                                        Name
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.smartobjects.slice(this.state.pageSmartobject * 10, (this.state.pageSmartobject + 1) * 10).map((pmodule) => (
                                <TableRow hover key={pmodule.reference} style={{ cursor: 'pointer' }}>
                                    <TableCell align="left">
                                        <Typography variant='body1'>
                                            {pmodule.id}
                                        </Typography>
                                    </TableCell><TableCell align="left">
                                        <Typography variant='body1'>
                                            {pmodule.name}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'center', alignItems: 'center' }}>
                    <TablePagination
                        component="div"
                        count={this.state.smartobjects.length}
                        rowsPerPage={10}
                        page={this.state.pageSmartobject}
                        rowsPerPageOptions={[]}
                        onChangePage={(event, page) => { this.setState({ pageSmartobject: page }) }}
                    />
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left'>
                                    <Typography variant='body1'>
                                        Identifiant
                                    </Typography>
                                </TableCell>
                                <TableCell align='left'>
                                    <Typography variant='body1'>
                                        Name
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.modules.slice(this.state.pageSmartobject * 10, (this.state.pageSmartobject + 1) * 10).map((pmodule) => (
                                <TableRow hover key={pmodule.reference} style={{ cursor: 'pointer' }}>
                                    <TableCell align="left">
                                        <Typography variant='body1'>
                                            {pmodule.id}
                                        </Typography>
                                    </TableCell><TableCell align="left">
                                        <Typography variant='body1'>
                                            {pmodule.name}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'center', alignItems: 'center' }}>
                    <TablePagination
                        component="div"
                        count={this.state.modules.length}
                        rowsPerPage={10}
                        page={this.state.pageModule}
                        rowsPerPageOptions={[]}
                        onChangePage={(event, page) => { this.setState({ pageModule: page }) }}
                    />
                </div>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

export default Configuration