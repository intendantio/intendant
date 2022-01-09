import React from 'react'
import { Link } from "react-router-dom"
import { Add } from '@mui/icons-material'
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton } from '@mui/material'
import Request from '../../../utils/Request'
import Alert from '../../../components/Alert'

class Localisation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            enabled: false,
            message: "",
            localisations: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/localisations")
        if (result.error) {
            this.setState({
                enabled: true,
                message: result.package + " : " + result.message
            })
        } else {
            this.setState({
                enabled: false,
                message: "",
                localisations: result.data
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
                            <Paper variant="outlined">
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{borderColor:'rgba(255, 255, 255, 0.12)'}}  align="left">
                                                    <Typography variant='body1'>
                                                        Reference
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.localisations.slice(this.state.page * 10, (this.state.page + 1) * 10).map((localisation, index) => (
                                                <TableRow onClick={() => { this.props.history.push("/localisation/" + localisation.id) }} hover key={index} style={{ cursor: 'pointer' }}>
                                                    <TableCell style={{ borderBottom: 0 }}  align="left">
                                                        <Typography variant='body1'>
                                                            {capitalizeFirstLetter(localisation.name)}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                            <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                                <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                    <Link to="/localisation/new" style={{ textDecoration: 'none', color: 'white' }}>
                                        <IconButton style={{ borderRadius: 0 }}>
                                            <Add />
                                        </IconButton>
                                    </Link>
                                </Paper>
                                <TablePagination
                                    component="div"
                                    count={this.state.localisations.length}
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

export default Localisation