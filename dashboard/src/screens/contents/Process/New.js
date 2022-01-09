import React from 'react'

import { Popover, InputAdornment, Checkbox, Typography, Paper, Grid, InputLabel, MenuItem, FormControl, Select, TableBody, TableContainer, TextField, TableCell, Table, TableRow, Switch, Button, IconButton, TableHead } from '@mui/material'

import { Delete, List, Add, Save } from '@mui/icons-material'

import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'
import Source from '../../../utils/Source'
import IconList from '../../../components/IconList'

class New extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enabled: false,
            popup: false,
            message: "",
            espaces: [],
            reference: '',
            icon: '',
            description: '',
            name: '',
            name_disable: '',
            name_enable: '',
            mode: 'simple',
            module: null,
            espace: false,
            inputReference: "",
            inputName: "",
            inputType: null,
            inputMode: false,
            inputs: [],
            sources: [],
            isChecked: false,
            action: null,
            source: null,
            arrSources: []
        }
    }

    async componentDidMount() {
        let resultSource = await Source.getSource(["smartobject", "module", "essential"])
        let resultEspace = await new Request().get().fetch("/api/espaces")
        if (resultSource.error) {
            this.setState({ enabled: true, message: resultSource.package + " : " + resultSource.message })
        } else if (resultEspace.error) {
            this.setState({ enabled: true, message: resultEspace.package + " : " + resultEspace.message })
        } else {
            this.setState({
                enabled: false,
                message: "",
                espaces: resultEspace.data,
                sources: resultSource.data
            })
        }
    }

    setSource(id) {
        let fSource = false
        this.state.sources.forEach(source => {
            if (source.id === id) { fSource = source }
        })
        this.setState({ source: fSource, action: null })
    }

    setAction(id) {
        let fAction = false
        this.state.source.actions.forEach(action => {
            if (action.id === id) { fAction = action }
        })
        this.setState({ action: fAction })
    }

    setInput() {
        if (this.state.inputReference === "") {
            this.setState({ enabled: true, message: "Reference is missing" })
            return
        }
        if (this.state.inputType === "") {
            this.setState({ enabled: true, message: "Type is missing" })
            return
        }
        if (this.state.inputName === "") {
            this.setState({ enabled: true, message: "Name is missing" })
            return
        }
        let inputs = this.state.inputs
        inputs.push({
            name: this.state.inputName,
            type: this.state.inputType,
            reference: this.state.inputReference,
            enable: this.state.inputMode ? 1 : 0
        })
        this.setState({ inputs: inputs, inputName: "", inputType: null, inputReference: "", inputMode: false })
    }

    async set() {
        if (this.state.reference === "") {
            this.setState({ enabled: true, message: "Reference is missing" })
            return
        }
        if (this.state.icon === "") {
            this.setState({ enabled: true, message: "Icon is missing" })
            return
        }
        if (this.state.description === "") {
            this.setState({ enabled: true, message: "Description is missing" })
            return
        }
        if (this.state.espace === false) {
            this.setState({ enabled: true, message: "Espace is missing" })
            return
        }
        let body = {
            description: this.state.description,
            nameEnable: this.state.name_enable,
            nameDisable: this.state.name_disable,
            name: this.state.name,
            espace: this.state.espace,
            sources: this.state.arrSources,
            reference: this.state.reference,
            icon: this.state.icon,
            mode: this.state.mode,
            inputs: this.state.inputs
        }
        let result = await new Request().post(body).fetch("/api/process")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else {
            this.props.history.push('/process')
        }
    }

    updateAction(action, value) {
        let tmp = {}
        tmp["settings-" + action.id] = value
        this.setState(tmp)
    }

    removeModeArgument(index) {
        let tmp = []
        this.state.inputs.forEach((modeArgument, pIndex) => {
            if (index !== pIndex) { tmp.push(modeArgument) }
        })
        this.setState({ inputs: tmp })
    }

    confirmationModule() {
        if (this.state.action === false) {
            this.setState({ enabled: true, message: "Action missing" })
            return
        }
        if (this.state.source.actions.length === 0) {
            this.setState({ enabled: true, message: "Module missing" })
            return
        }
        let settings = []
        for (let index = 0; index < this.state.action.settings.length; index++) {
            let setting = this.state.action.settings[index]
            let value = this.state["settings-" + setting.id]
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
        let tmp = this.state.arrSources
        tmp.push(action)
        this.setState({ arrSources: tmp, action: null, source: null, isChecked: false })
    }

    removeSource(index) {
        let tmp = []
        this.state.arrSources.forEach((action, pIndex) => {
            if (index !== pIndex) { tmp.push(action) }
        })
        this.setState({ arrSources: [] }, () => {
            this.setState({ arrSources: tmp })
        })
    }

    render() {
        return (
            <div>
                <Paper variant="outlined" style={{ padding: 10, justifyContent: 'left' }}>
                    <div style={{ justifyContent: 'start', alignSelf: 'start', alignContent: 'start', alignItems: 'start', padding: 10 }}>
                        <TextField
                            onChange={(event) => { this.setState({ reference: event.nativeEvent.target.value }) }}
                            style={{ width: '20%', margin: 10 }}
                            label="Réference"
                            value={this.state.reference}
                            variant="outlined"
                        />
                        <TextField
                            onChange={(event) => { this.setState({ icon: event.nativeEvent.target.value }) }}
                            style={{ width: '20%', margin: 10 }}
                            label="Icon"
                            variant="outlined"
                            value={this.state.icon}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => { this.setState({ popup: true }) }} style={{ margin: 0, padding: 0 }}>
                                            <List />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Popover
                            open={this.state.popup}
                            onClose={() => { this.setState({ popup: false }) }}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center', }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center', }}
                        >
                            <IconList onSelect={(icon) => { this.setState({ icon: icon, popup: false }) }} />
                        </Popover>
                        <TextField
                            onChange={(event) => { this.setState({ description: event.nativeEvent.target.value }) }}
                            style={{ width: '50%', margin: 10 }}
                            label="Description"
                            variant="outlined"
                        />
                        <FormControl variant="outlined" style={{ margin: 10, width: '150px' }} >
                            <InputLabel>Espace</InputLabel>
                            <Select value={this.state.espace ? this.state.espace.id : ''} onChange={(event) => { this.setState({ espace: event.target.value }) }} label="Espace" >
                                {
                                    this.state.espaces.map((espace, index) => {
                                        return <MenuItem key={index} value={espace.id} >{espace.name}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <Typography variant='h5' style={{ margin: 10 }}>
                            Mode
                        </Typography>
                        <Grid style={{ margin: 10 }} container alignItems="center" >
                            <Grid item>
                                <Typography variant='subtitle1'>Simple</Typography>
                            </Grid>
                            <Grid item>
                                <Switch checked={this.state.mode === 'switch'} onChange={(event, checked) => { this.setState({ mode: checked ? 'switch' : 'simple' }) }} name="checkedC" />
                            </Grid>
                            <Grid item>
                                <Typography variant='subtitle1'>Switch</Typography>
                            </Grid>
                        </Grid>
                        <Paper variant="outlined">
                            <TableContainer>
                                {
                                    this.state.mode === 'switch' ?
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <TextField
                                                onChange={(event) => { this.setState({ name_enable: event.nativeEvent.target.value }) }}
                                                style={{ width: '45%', margin: 10 }}
                                                label="Texte actif"
                                                variant="outlined"
                                            />
                                            <TextField
                                                onChange={(event) => { this.setState({ name_disable: event.nativeEvent.target.value }) }}
                                                style={{ width: '45%', margin: 10 }}
                                                label="Texte passif"
                                                variant="outlined"
                                            />
                                        </div> :
                                        <div >
                                            <TextField
                                                onChange={(event) => { this.setState({ name: event.nativeEvent.target.value }) }}
                                                style={{ margin: 10, width: '45%' }}
                                                label="Texte"
                                                variant="outlined"
                                            />
                                        </div>
                                }
                            </TableContainer>
                        </Paper>
                        <Typography variant='h5' style={{ margin: 10 }}>
                            Argument
                        </Typography>
                        <Paper variant="outlined">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow key={0} onClick={() => { }}  >
                                            <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                <TextField
                                                    value={this.state.inputReference}
                                                    onChange={(event) => { this.setState({ inputReference: event.nativeEvent.target.value }) }}

                                                    label="Reference"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                <TextField
                                                    value={this.state.inputName}
                                                    onChange={(event) => { this.setState({ inputName: event.nativeEvent.target.value }) }}

                                                    label="Name"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                <FormControl variant="outlined" style={{ width: 150 }} >
                                                    <InputLabel>Type</InputLabel>
                                                    <Select value={this.state.inputType ? this.state.inputType : ""} onChange={(event) => { this.setState({ inputType: event.target.value }) }} label="Type" >
                                                        <MenuItem key={1} value={"text"} >{"Text"}</MenuItem>
                                                        <MenuItem key={2} value={"colorpicker"} >{"Color picker"}</MenuItem>
                                                        <MenuItem key={3} value={"number"} >{"Number"}</MenuItem>
                                                        <MenuItem key={4} value={"slider"} >{"Slider"}</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                {
                                                    this.state.mode === 'switch' ?
                                                        <Checkbox onChange={(event, checked) => { this.setState({ inputMode: checked }) }} /> : null
                                                }
                                            </TableCell>
                                            <TableCell align="right" style={{borderBottomWidth: 0}}>
                                                <IconButton onClick={() => { this.setInput() }} style={{ borderRadius: 5, margin: 0 }}>
                                                    <Add />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            this.state.inputs.map((modeArgument, index) => {
                                                return (
                                                    <TableRow key={index} onClick={() => { }} hover style={{ cursor: 'pointer' }}>
                                                        <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                            <Typography variant='body1'>
                                                                {modeArgument.reference}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                            <Typography variant='body1'>
                                                                {modeArgument.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                            <Typography variant='body1'>
                                                                {modeArgument.type}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" style={{borderBottomWidth: 0}}>
                                                            {
                                                                this.state.mode === 'switch' ?
                                                                    <Checkbox disabled defaultChecked={modeArgument.mode} />
                                                                    : null
                                                            }
                                                        </TableCell>
                                                        <TableCell align="right" style={{borderBottomWidth: 0}}>
                                                            <IconButton onClick={() => { this.removeModeArgument(index) }}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        <Typography variant='h5' style={{ margin: 10 }}>Action</Typography>
                        <Paper variant="outlined">
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow >
                                            <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                <FormControl fullWidth >
                                                    <InputLabel>Source</InputLabel>
                                                    <Select value={this.state.source ? this.state.source.id : ''} onChange={(event) => { this.setSource(event.target.value) }} label="Connexion" >
                                                        {
                                                            this.state.sources.map((source, pIndex) => {
                                                                return <MenuItem key={pIndex} value={source.id} >{source.name}</MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                {
                                                    this.state.source ?
                                                        <FormControl fullWidth style={{ minWidth: 150 }} >
                                                            <InputLabel>Action</InputLabel>
                                                            <Select value={this.state.action ? this.state.action.id : ''} onChange={(event) => { this.setAction(event.target.value) }} label="Connexion" >
                                                                {
                                                                    this.state.source.actions.map((action, index) => {
                                                                        return <MenuItem key={index} value={action.id} >{action.name}</MenuItem>
                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                        : null
                                                }
                                            </TableCell>
                                            <TableCell align="left" style={{borderBottomWidth: 0}}>
                                                {
                                                    this.state.action ?
                                                        this.state.action.settings.map((argument, index) => {
                                                            return (
                                                                <div key={index} style={{ marginTop: 5, marginBottom: 2 }} >
                                                                    <TextField variant="outlined" placeholder={argument.id} onChange={(event) => { this.updateAction(argument, event.currentTarget.value, this.state.action) }} />
                                                                </div>
                                                            )
                                                        }) : null
                                                }
                                            </TableCell>
                                            <TableCell align="center" style={{borderBottomWidth: 0}}>
                                                {this.state.mode === 'simple' ? null :
                                                    <Checkbox onChange={(event, checked) => { this.setState({ isChecked: checked }) }} />
                                                }
                                            </TableCell>
                                            <TableCell align="right" style={{borderBottomWidth: 0}}>
                                                <IconButton onClick={() => { this.confirmationModule() }} style={{ borderRadius: 5, margin: 0 }}>
                                                    <Add />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            this.state.arrSources.map((action, index) => {
                                                return (
                                                    <TableRow key={index} onClick={() => { }} hover style={{ cursor: 'pointer' }}>
                                                        <TableCell style={{borderBottomWidth: 0}} align="left">
                                                            <Typography variant='body1'>
                                                                {action.source.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell style={{borderBottomWidth: 0}} align="left">
                                                            <Typography variant='body1'>
                                                                {action.action.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell style={{borderBottomWidth: 0}} align="left">
                                                            {
                                                                action.arguments.map((argument, pIndex) => {
                                                                    return (
                                                                        <Typography key={pIndex} variant='body1'>
                                                                            {argument.reference + " : " + argument.value}
                                                                        </Typography>
                                                                    )
                                                                })
                                                            }
                                                        </TableCell>
                                                        <TableCell style={{borderBottomWidth: 0}} align="center">
                                                            {this.state.mode === 'simple' ? null :
                                                                <Checkbox disabled defaultChecked={action.enable} />
                                                            }
                                                        </TableCell>
                                                        <TableCell style={{borderBottomWidth: 0}} align="right">
                                                            <IconButton onClick={() => { this.removeSource(index) }}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                </Paper>
                    <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }} >
                        <IconButton onClick={() => { this.set()  }} style={{ borderRadius: 5 }}>
                            <Save />
                        </IconButton>
                    </Paper>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}> {this.state.message} </Alert>
            </div>
        )
    }
}

export default New