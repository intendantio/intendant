import React from 'react'
import JSONPretty from 'react-json-pretty'
import { Paper, Typography, Box, TableBody, Divider, Accordion, AccordionDetails, AccordionSummary, ListItem, TableCell, TableRow, TableContainer, Table, TextField, FormControlLabel, IconButton, Switch } from '@mui/material'
import { Sensors, Delete, Lightbulb, Devices, ToggleOn, ExpandMore } from '@mui/icons-material'
import AlertComponent from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'

class DetailLocalisation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            localisation: null,
            profiles: [],
            lights: [],
            sensors: [],
            switchs: [],
            others: [],
            accordionOpen: ""
        }
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultLocalisation = await new Request().get().fetch("/api/localisations/" + this.state.id)
        if (resultLocalisation.error || resultProfile.error) {
            this.props.history.push('/localisation')
        } else {

            let lights = resultLocalisation.data.smartobjects.filter(smartobject => {
                if (smartobject.configuration) {
                    return smartobject.configuration.product == "light"
                }
                return false
            })


            this.setState({ localisation: resultLocalisation.data, profiles: resultProfile.data, lights: lights })
        }
        this.setState({ loading: null })
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/localisations/" + id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.props.history.push('/localisation')
        }
    }

    async insertProfile(localisation, profile) {
        let result = await new Request().post({ idProfile: profile.id, }).fetch("/api/localisations/" + localisation.id + "/profiles")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async deleteProfile(localisation, profile) {
        let result = await new Request().delete().fetch("/api/localisations/" + localisation.id + "/profiles/" + profile.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }


    render() {
        if (this.state.localisation) {
            return (
                <div>
                    <Paper variant="outlined" style={{ padding: 15, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >
                            {capitalizeFirstLetter(this.state.localisation.name)}
                        </Typography>
                    </Paper>
                    {
                        this.state.lights.length > 0 &&
                    <Accordion style={{ marginBottom: 10, borderRadius: 5 }} elevation={0} variant='outlined' expanded={this.state.accordionOpen == 'light'} onChange={() => { this.state.accordionOpen == 'light' ? this.setState({ accordionOpen: '' }) : this.setState({ accordionOpen: 'light' }) }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Lightbulb />
                                <Typography variant='h6' style={{ marginLeft: 10 }} >
                                    Light
                                </Typography>
                            </Box>
                            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                        </AccordionSummary>
                        <AccordionDetails style={{padding: 0}}>
                            <TableContainer style={{ overflowX: 'hidden' }}>
                                <Table >
                                    <TableBody >
                                        {this.state.lights.map((smartobject, index) => (
                                            <TableRow onClick={() => { this.props.history.push("/smartobject/" + smartobject.id) }} hover key={index} style={{ cursor: 'pointer' }}>
                                                <TableCell align="left" style={{ borderBottom: 0 }} >
                                                    <Typography variant='body1'>
                                                        {smartobject.reference}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center" style={{ borderBottom: 0 }} >
                                                    <img style={{ height: 25, width: 25, alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + smartobject.status.icon + ".svg"} />
                                                </TableCell>
                                                {
                                                    this.state.isMobile == false &&
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
                        </AccordionDetails>
                    </Accordion>
                    }
                    {
                        this.state.switchs.length > 0 &&
                    <Accordion style={{ marginBottom: 10, borderRadius: 5 }} elevation={0} variant='outlined' expanded={this.state.accordionOpen == 'switch'} onChange={() => { this.state.accordionOpen == 'switch' ? this.setState({ accordionOpen: '' }) : this.setState({ accordionOpen: 'switch' }) }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <ToggleOn />
                                <Typography variant='h6' style={{ marginLeft: 10 }} >
                                    Switch
                                </Typography>
                            </Box>
                            <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                        </AccordionSummary>
                        <AccordionDetails style={{padding: 0}}>
                            <TableContainer style={{ overflowX: 'hidden', padding: 0 }}>
                                <Table>
                                    <TableBody>
                                        {this.state.switchs.map((smartobject, index) => (
                                            <TableRow onClick={() => { this.props.history.push("/smartobject/" + smartobject.id) }} hover key={index} style={{ cursor: 'pointer' }}>
                                                <TableCell align="left" style={{ borderBottom: 0 }} >
                                                    <Typography variant='body1'>
                                                        {smartobject.reference}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center" style={{ borderBottom: 0 }} >
                                                    <img style={{ height: 25, width: 25, alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + smartobject.status.icon + ".svg"} />
                                                </TableCell>
                                                {
                                                    this.state.isMobile == false &&
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
                        </AccordionDetails>
                    </Accordion>
                    }
                    {
                        this.state.sensors.length > 0 &&
                        <Accordion style={{ marginBottom: 10, borderRadius: 5 }} elevation={0} variant='outlined' expanded={this.state.accordionOpen == 'sensor'} onChange={() => { this.state.accordionOpen == 'sensor' ? this.setState({ accordionOpen: '' }) : this.setState({ accordionOpen: 'sensor' }) }}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel4bh-content"
                                id="panel4bh-header"
                            >
                                <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Sensors />
                                    <Typography variant='h6' style={{ marginLeft: 10 }} >
                                        Sensor
                                    </Typography>
                                </Box>
                                <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                            </AccordionSummary>
                            <AccordionDetails style={{padding: 0}}>
                                <TableContainer style={{ overflowX: 'hidden', padding: 0 }}>
                                    <Table>
                                        <TableBody>
                                            {this.state.sensors.map((smartobject, index) => (
                                                <TableRow onClick={() => { this.props.history.push("/smartobject/" + smartobject.id) }} hover key={index} style={{ cursor: 'pointer' }}>
                                                    <TableCell align="left" style={{ borderBottom: 0 }} >
                                                        <Typography variant='body1'>
                                                            {smartobject.reference}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" style={{ borderBottom: 0 }} >
                                                        <img style={{ height: 25, width: 25, alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + smartobject.status.icon + ".svg"} />
                                                    </TableCell>
                                                    {
                                                        this.state.isMobile == false &&
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
                            </AccordionDetails>
                        </Accordion>
                    }

                    {
                        this.state.others.length > 0 &&
                        <Accordion style={{ marginBottom: 10, borderRadius: 5 }} elevation={0} variant='outlined' expanded={this.state.accordionOpen == 'other'} onChange={() => { this.state.accordionOpen == 'other' ? this.setState({ accordionOpen: '' }) : this.setState({ accordionOpen: 'other' }) }}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel4bh-content"
                                id="panel4bh-header"
                            >
                                <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Devices />
                                    <Typography variant='h6' style={{ marginLeft: 10 }} >
                                        Other
                                    </Typography>
                                </Box>
                                <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                            </AccordionSummary>
                            <AccordionDetails style={{padding: 0}}>
                                <TableContainer style={{ overflowX: 'hidden', padding: 0 }}>
                                    <Table>
                                        <TableBody>
                                            {this.state.others.map((smartobject, index) => (
                                                <TableRow onClick={() => { this.props.history.push("/smartobject/" + smartobject.id) }} hover key={index} style={{ cursor: 'pointer' }}>
                                                    <TableCell align="left" style={{ borderBottom: 0 }} >
                                                        <Typography variant='body1'>
                                                            {smartobject.reference}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" style={{ borderBottom: 0 }} >
                                                        <img style={{ height: 25, width: 25, alignSelf: 'center', filter: 'invert(100%)' }} src={process.env.PUBLIC_URL + "/ressource/icon/" + smartobject.status.icon + ".svg"} />
                                                    </TableCell>
                                                    {
                                                        this.state.isMobile == false &&
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
                            </AccordionDetails>
                        </Accordion>
                    }
                    <Paper variant="outlined" style={{ padding: 15, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h6' >
                            Authorization
                        </Typography>
                        {
                            this.state.profiles.map((profile, index) => {
                                let state = false
                                this.state.localisation.profiles.forEach(pprofile => {
                                    if (pprofile.profile == profile.id) {
                                        state = true
                                    }
                                })
                                return (
                                    <ListItem key={index} style={{ padding: 1 }}  >
                                        <FormControlLabel control={
                                            <Switch
                                                checked={state}
                                                onChange={() => {
                                                    state ? this.deleteProfile(this.state.localisation, profile) : this.insertProfile(this.state.localisation, profile)
                                                }}
                                                color="primary"
                                            />
                                        } label={profile.name} />
                                    </ListItem>
                                )
                            })
                        }
                    </Paper>
                    <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                        <IconButton onClick={() => { this.delete(this.state.id) }} style={{ borderRadius: 5 }}>
                            <Delete />
                        </IconButton>
                    </Paper>
                    <AlertComponent onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                        {this.state.message}
                    </AlertComponent>
                </div>
            )
        } else {
            return (
                <AlertComponent onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </AlertComponent>
            )
        }
    }
}

function capitalizeFirstLetter(string = "") {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default DetailLocalisation