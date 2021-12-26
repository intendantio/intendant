import React from 'react'
import JSONPretty from 'react-json-pretty'

import { MenuItem, Switch, ListItem, FormControlLabel, Checkbox, InputLabel, IconButton, TableHead, TextField, Typography, Paper, Divider, TableBody, TableContainer, TableCell, Table, TableRow, FormControl, Select, Button } from '@material-ui/core'

import { Check, Close, Delete, Autorenew, Add } from '@mui/icons-material'

import Alert from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'
import Source from '../../../utils/Source'

class NewProcess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            enabled: false,
            message: "",
            process: null,
            profiles: [],
            executeInformation: "",
            referenceInput: "",
            nameInput: "",
            typeInput: null,
            modeInput: 0,
            action: null,
            source: null,
            loading: false,
            isChecked: false,
            sources: []
        }
    }


    async componentDidMount() {
        let resultSource = await Source.getSource(["smartobject", "module"])
        let resultEspace = await new Request().get().fetch("/api/espaces")
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let result = await new Request().get().fetch("/api/process/" + this.state.id)
        if (resultEspace.error) {
            this.setState({
                enabled: true,
                message: resultEspace.package + " : " + resultEspace.message
            })
        } else if (result.error) {
            this.setState({
                enabled: true,
                message: result.package + " : " + result.message
            })
        } else {
            this.setState({
                process: result.data,
                profiles: resultProfile.data,
                espaces: resultEspace.data,
                sources: resultSource.data
            })
        }
        this.setState({ loading: null })
    }

    setSource(id) {
        let fSource = false
        this.state.sources.forEach(source => {
            if (source.id === id) { fSource = source }
        })
        this.setState({ source: fSource })
    }

    setAction(id) {
        let fAction = false
        this.state.source.actions.forEach(action => {
            if (action.id === id) { fAction = action }
        })
        this.setState({ action: fAction })
    }

    async addSource() {
        if (this.state.action == null) {
            this.setState({ enabled: true, message: "Action missing" })
            return
        }
        if (this.state.source == null) {
            this.setState({ enabled: true, message: "Source missing" })
            return
        }
        let settings = []
        for (let index = 0; index < this.state.action.settings.length; index++) {
            let setting = this.state.action.settings[index]
            let value = this.state["argument-" + setting.id]
            if (value == undefined) {
                value = setting.default
            }
            settings.push({ reference: setting.id, value: value })
        }
        let action = {
            source: this.state.source,
            action: this.state.action,
            arguments: settings,
            enable: this.state.isChecked
        }
        let result = await new Request().post(action).fetch("/api/process/" + this.state.id + "/actions")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async deleteSource(idsource) {
        let result = await new Request().delete().fetch("/api/process/" + this.state.id + "/actions/" + idsource)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/process/" + id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.props.history.push('/process')
        }
    }

    async executeAction() {
        this.setState({ loading: true })
        let tmp = {}
        for (let index = 0; index < this.state.process.inputs.length; index++) {
            let input = this.state.process.inputs[index];
            let value = this.state["argument-" + input.id]
            if (value == undefined) {
                value = input.default
            }
            tmp[input.reference] = value
        }
        let result = await new Request().post({ inputs: tmp }).fetch("/api/process/" + this.state.process.id + "/execute")
        if (result.error) {
            this.setState({ loading: null, enabled: true, message: result.package + " : " + result.message })
        } else {
            if (result.data) {
                this.setState({ executeInformation: JSON.stringify(result.data) })
            }
            this.componentDidMount()
        }
    }

    async insertProfile(process, profile) {
        let result = await new Request().post({ idProfile: profile.id, }).fetch("/api/process/" + process.id + "/profiles")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async deleteProfile(process, profile) {
        let result = await new Request().delete().fetch("/api/process/" + process.id + "/profiles/" + profile.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async deleteProcessInput(input) {
        let result = await new Request().delete({}).fetch("/api/process/" + this.state.process.id + "/inputs/" + input.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.componentDidMount()
        }
    }

    async insertProcessInput() {
        if (this.state.typeInput == null) {
            this.setState({ enabled: true, message: "Missing-parameter : type is empty" })
            return
        }
        let result = await new Request().post({
            reference: this.state.referenceInput,
            name: this.state.nameInput,
            type: this.state.typeInput,
            enable: this.state.modeInput
        }).fetch("/api/process/" + this.state.process.id + "/inputs")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.setState({
                referenceSettings: "",
                valueSettings: "",
                referenceInput: "",
                nameInput: "",
                modeInput: 0
            })
            this.componentDidMount()
        }
    }

    updateAction(action, value) {
        let tmp = {}
        tmp["argument-" + action.id] = value
        this.setState(tmp)
    }

    render() {
        if (this.state.process) {
            return (
                <div>
                    <Paper elevation={2} style={{ padding: 25 }}>
                        <Typography variant='h4'>
                            {this.state.process.reference}
                        </Typography>
                        <Typography variant='subtitle1'>
                            {this.state.process.espace.name}
                        </Typography>
                        <Typography variant='subtitle1'>
                            {this.state.process.description}
                        </Typography>
                        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                        <div  >
                            <Typography variant='h5' style={{ marginBottom: 5 }}>Action</Typography>
                            {
                                this.state.process.mode == "simple" ?
                                    this.state.process.mode === "simple" ?
                                        <Button disabled={this.state.loading} style={{ alignSelf: 'center', marginTop: 10 }} variant={this.state.process.enable === 2 ? "contained" : "outlined"} onClick={() => { this.executeAction() }} color="default" startIcon={<Autorenew />}>
                                            {this.state.process.name}
                                        </Button> : null
                                    :
                                    <div style={{ flexDirection: 'column', display: 'flex', width: '20%' }}>
                                        {
                                            this.state.process.enable == 1 ?
                                                <Button disabled={this.state.loading} style={{ marginTop: 10 }} variant={"contained"} onClick={() => { this.executeAction() }} color="default" >
                                                    {this.state.process.name_enable}
                                                </Button> :
                                                <Button disabled={this.state.loading} style={{ marginTop: 10 }} variant={"outlined"} onClick={() => { this.executeAction() }} color="default" >
                                                    {this.state.process.name_disable}
                                                </Button>
                                        }
                                    </div>
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                            {
                                this.state.process.inputs.filter(input => {
                                    return input.enable == this.state.process.enable
                                }).map(input => {
                                    return <Action setState={this.setState.bind(this)} action={input} flexDirection='column' orientation='horizontal' />
                                })
                            }
                        </div>
                        <div style={{ marginTop: 15 }} >
                            <Typography variant='h5'>
                                Input
                            </Typography>
                            <div style={{ flexDirection: 'column', display: 'flex', width: '100%', marginTop: 10 }}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            {
                                                this.state.process.inputs.map(input =>
                                                    <TableRow key={input.id}>
                                                        <TableCell align="left"><Typography variant='body1'>{input.reference}</Typography></TableCell>
                                                        <TableCell align="left"><Typography variant='body1'>{input.name}</Typography> </TableCell>
                                                        <TableCell align="left"><Typography variant='body1'>{input.type}</Typography></TableCell>
                                                        <TableCell align="center"><Typography variant='body1'>{input.enable}</Typography></TableCell>
                                                        <TableCell align="left">
                                                            <IconButton onClick={() => { this.deleteProcessInput(input) }} style={{ borderRadius: 5, margin: 0 }}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                            <TableRow key={-1}>
                                                <TableCell align="left" style={{ width: '35%' }}>
                                                    <TextField value={this.state.referenceInput} onChange={(event) => { this.setState({ referenceInput: event.nativeEvent.target.value }) }} placeholder='Reference' style={{ width: '100%' }}>
                                                    </TextField>
                                                </TableCell>
                                                <TableCell align="left" style={{ width: '35%' }}>
                                                    <TextField value={this.state.nameInput} onChange={(event) => { this.setState({ nameInput: event.nativeEvent.target.value }) }} placeholder='Name' style={{ width: '100%' }}>
                                                    </TextField>
                                                </TableCell>
                                                <TableCell align="left" style={{ width: '20%' }}>
                                                    <FormControl variant="outlined" style={{ width: '100%' }} >
                                                        <InputLabel>Type</InputLabel>
                                                        <Select value={this.state.typeInput} onChange={(event) => { this.setState({ typeInput: event.target.value }) }} label="Type" >
                                                            <MenuItem value={"text"} >{"Text"}</MenuItem>
                                                            <MenuItem value={"colorpicker"} >{"Color picker"}</MenuItem>
                                                            <MenuItem value={"number"} >{"Number"}</MenuItem>
                                                            <MenuItem value={"slider"} >{"Slider"}</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align="center" style={{ width: '10%' }}>
                                                    {
                                                        this.state.process.mode === 'switch' ?
                                                            <Checkbox value={this.state.modeInput == 0} onChange={(event, checked) => { this.setState({ modeInput: checked ? 1 : 0 }) }} /> : null
                                                    }
                                                </TableCell>
                                                <TableCell align="left" >
                                                    <IconButton onClick={() => { this.insertProcessInput() }} style={{ borderRadius: 5, margin: 0 }}>
                                                        <Add />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                        <div style={{ marginTop: 15 }} >
                            <Typography variant='h5'>
                                Module
                            </Typography>
                            <div style={{ flexDirection: 'column', display: 'flex', width: '100%', marginTop: 10 }}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left"><Typography variant='body1'>Module</Typography></TableCell>
                                                <TableCell align="left"><Typography variant='body1'>Type</Typography></TableCell>
                                                <TableCell align="left"><Typography variant='body1'>Action</Typography></TableCell>
                                                <TableCell align="left"><Typography variant='body1'>Arguments</Typography></TableCell>
                                                <TableCell align="center"><Typography variant='body1'>Mode</Typography></TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                this.state.process.actions.map(action =>
                                                    <TableRow key={action.id}>
                                                        <TableCell align="left" style={{ width: '15%' }}><Typography variant='body1'>{action.object}</Typography></TableCell>
                                                        <TableCell align="left" style={{ width: '20%' }}><Typography variant='body1'>{action.type}</Typography> </TableCell>
                                                        <TableCell align="left" style={{ width: '20%' }}><Typography variant='body1'>{action.action}</Typography></TableCell>
                                                        <TableCell align="left" style={{ width: '20%' }}>{action.arguments.map(argument => {
                                                            return <Typography variant='body1'>{argument.reference + " : " + argument.value}</Typography>
                                                        })}</TableCell>
                                                        <TableCell align="center" style={{ width: '15%' }}>{action.enable === 0 ? <Close /> : action.enable === 1 ? <Check /> : <Autorenew />}</TableCell>
                                                        <TableCell align="left">
                                                            <IconButton onClick={() => { this.deleteSource(action.id) }}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TableContainer style={{ marginTop: 15 }} component={Paper}>
                                    <Table>
                                        <TableRow>
                                            <TableCell align="left" style={{ width: '25%' }}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Source</InputLabel>
                                                    <Select value={this.state.source ? this.state.source.id : null} onChange={(event) => { this.setSource(event.target.value) }} label="Connexion" >
                                                        {
                                                            this.state.sources.map(source => {
                                                                return <MenuItem value={source.id} >{source.name}</MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="left" style={{ width: '25%' }}>
                                                {
                                                    this.state.source ?
                                                        <FormControl fullWidth >
                                                            <InputLabel>Action</InputLabel>
                                                            <Select value={this.state.action ? this.state.action.id : null} onChange={(event) => { this.setAction(event.target.value) }} label="Connexion" >
                                                                {
                                                                    this.state.source.actions.map(action => {
                                                                        return <MenuItem value={action.id} >{action.name}</MenuItem>
                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                }
                                            </TableCell>

                                            <TableCell align="left" style={{ width: '20%' }}>
                                                {
                                                    this.state.action ?
                                                        this.state.action.settings.map(argument => {
                                                            return (
                                                                <div style={{ marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 2 }} >
                                                                    <TextField variant="outlined" placeholder={argument.id} onChange={(event) => { this.updateAction(argument, event.currentTarget.value, this.state.action) }} />
                                                                </div>
                                                            )
                                                        }) : null
                                                }
                                            </TableCell>
                                            <TableCell align="center" style={{ width: '5%' }}>
                                                {
                                                    this.state.process.mode === 'switch' ?
                                                        <Checkbox onChange={(event, isChecked) => { this.setState({ isChecked: isChecked }) }} /> : null
                                                }
                                            </TableCell>
                                            <TableCell align="center" style={{ width: '5%' }}>
                                                <IconButton onClick={() => { this.addSource() }}>
                                                    <Add />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                        {
                            this.state.executeInformation.length > 0 ?
                                <div style={{ padding: 10 }}>
                                    <Alert severity="success" action={
                                        <IconButton onClick={() => { this.setState({ executeInformation: "" }) }} style={{ alignSelf: 'start' }} color="inherit" size="small">
                                            <Close />
                                        </IconButton>
                                    }>
                                        <JSONPretty id="json-pretty" data={JSON.parse(this.state.executeInformation)}></JSONPretty>
                                    </Alert>
                                </div>
                                :
                                null
                        }
                        <div style={{ padding: 10, paddingBottom: 0 }}>
                            <Typography variant='h5' >
                                Authorization
                            </Typography>
                            {
                                this.state.profiles.map(profile => {
                                    let state = false
                                    this.state.process.profiles.forEach(pprofile => {
                                        if (pprofile.profile == profile.id) {
                                            state = true
                                        }
                                    })
                                    return (
                                        <ListItem style={{ padding: 1 }}  >
                                            <FormControlLabel control={<Switch
                                                checked={state}
                                                onChange={() => {
                                                    state ? this.deleteProfile(this.state.process, profile) : this.insertProfile(this.state.process, profile)
                                                }}
                                                color="primary"
                                            />} label={profile.name} />
                                        </ListItem>
                                    )
                                })
                            }
                        </div>
                    </Paper>
                    <Paper style={{ width: 'min-content', marginTop: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                        <IconButton onClick={() => { this.delete(this.state.process.id) }} style={{ borderRadius: 5 }}>
                            <Delete />
                        </IconButton>
                    </Paper>
                    <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                        {this.state.message}
                    </Alert>
                </div>
            )
        } else {
            return (
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            )
        }
    }
}

export default NewProcess