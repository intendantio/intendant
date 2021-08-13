import React from 'react'

import { Popover, InputAdornment, Checkbox, Typography, Paper, Grid, InputLabel, MenuItem, FormControl, Select, TableBody, TableContainer, TextField, TableCell, Table, TableRow, Switch, Button, IconButton } from '@material-ui/core'

import { Delete, List } from '@material-ui/icons'

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
        let resultSource = await Source.getSource(["smartobject", "module"])
        let resultEspace = await new Request().get().fetch("/api/espace")
        if (resultSource.error) {
            this.setState({ enabled: true, message: resultSource.code + " : " + resultSource.message })
        } else if (resultEspace.error) {
            this.setState({ enabled: true, message: resultEspace.code + " : " + resultEspace.message })
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
        this.setState({ source: fSource })
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
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else {
            this.props.history.push('/process')
        }
    }

    updateAction(action, value) {
        let tmp = {}
        tmp["argument-" + action.id] = value
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
                <Paper elevation={2} style={{ padding: 10, justifyContent: 'left' }}>
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
                            anchorOrigin={{ vertical: 'top',  horizontal: 'center', }}
                            transformOrigin={{  vertical: 'top', horizontal: 'center', }}
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
                            <Select onChange={(event) => { this.setState({ espace: event.target.value }) }} label="Espace" >
                                {
                                    this.state.espaces.map(espace => {
                                        return <MenuItem value={espace.id} >{espace.name}</MenuItem>
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
                        <TableContainer style={{ padding: 10, margin: 10 }} component={Paper}>
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
                        <Typography variant='h5' style={{ margin: 10 }}>
                            Argument
                        </Typography>
                        <TableContainer style={{ padding: 10, margin: 10 }} component={Paper}>
                            <TextField
                                value={this.state.inputReference}
                                onChange={(event) => { this.setState({ inputReference: event.nativeEvent.target.value }) }}
                                style={{ width: '30%', margin: 10 }}
                                label="Reference"
                                variant="outlined"
                            />
                            <TextField
                                value={this.state.inputName}
                                onChange={(event) => { this.setState({ inputName: event.nativeEvent.target.value }) }}
                                style={{ width: '30%', margin: 10 }}
                                label="Name"
                                variant="outlined"
                            />
                            <FormControl variant="outlined" style={{ margin: 10, width: '25%' }} >
                                <InputLabel>Type</InputLabel>
                                <Select value={this.state.inputType} onChange={(event) => { this.setState({ inputType: event.target.value }) }} label="Type" >
                                    <MenuItem value={"text"} >{"Text"}</MenuItem>
                                    <MenuItem value={"colorpicker"} >{"Color picker"}</MenuItem>
                                    <MenuItem value={"number"} >{"Number"}</MenuItem>
                                    <MenuItem value={"slider"} >{"Slider"}</MenuItem>
                                </Select>
                            </FormControl>
                            {
                                this.state.mode === 'switch' ?
                                    <Checkbox onChange={(event, checked) => { this.setState({ inputMode: checked }) }} /> : null
                            }
                            <Button style={{ margin: 10 }} onClick={() => { this.setInput() }} variant='outlined'>
                                Ajouter
                            </Button>
                            <Table>
                                <TableBody>
                                    {
                                        this.state.inputs.map((modeArgument, index) => {
                                            return (
                                                <TableRow onClick={() => { }} hover style={{ cursor: 'pointer' }}>
                                                    <TableCell align="left">
                                                        <Typography variant='body1'>
                                                            {modeArgument.reference}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant='body1'>
                                                            {modeArgument.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant='body1'>
                                                            {modeArgument.type}
                                                        </Typography>
                                                    </TableCell>
                                                    {
                                                        this.state.mode === 'switch' ?
                                                            <TableCell align="center">
                                                                <Checkbox disabled defaultChecked={modeArgument.mode} />
                                                            </TableCell> : null
                                                    }
                                                    <TableCell align="right">
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
                        <Typography variant='h5' style={{ margin: 10 }}>Action </Typography>
                        <TableContainer style={{ padding: 10, margin: 10 }} component={Paper}>
                            <Table>
                                <TableBody>
                                    {
                                        this.state.arrSources.map((action, index) => {
                                            return (
                                                <TableRow onClick={() => { }} hover style={{ cursor: 'pointer' }}>
                                                    <TableCell align="left">
                                                        <Typography variant='body1'>
                                                            {action.source.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant='body1'>
                                                            {action.action.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant='body1'>
                                                            {
                                                                action.arguments.map(argument => {
                                                                    return (
                                                                        <Typography variant='body1'>
                                                                            {argument.reference + " : " + argument.value}
                                                                        </Typography>
                                                                    )
                                                                })
                                                            }
                                                        </Typography>
                                                    </TableCell>
                                                    {this.state.mode === 'simple' ? null : <TableCell align="center">
                                                        <Checkbox disabled defaultChecked={action.enable} />
                                                    </TableCell>}
                                                    <TableCell align="center">
                                                        <IconButton onClick={() => { this.removeSource(index) }}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    <TableRow >
                                        <TableCell align="left" style={{ minWidth: '30%' }}>
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
                                        <TableCell align="left" style={{ width: '30%' }}>
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
                                        <TableCell align="left" style={{ width: '30%' }}>
                                            <div>
                                            </div>
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
                                        {this.state.mode === 'simple' ? null :
                                            <TableCell align="center">
                                                <Checkbox onChange={(event, checked) => { this.setState({ isChecked: checked }) }} />
                                            </TableCell>
                                        }
                                    </TableRow>
                                    <Button style={{ margin: 10 }} onClick={() => { this.confirmationModule() }} variant='outlined'>
                                        Ajouter
                                    </Button>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <Button style={{ margin: 10 }} onClick={() => { this.set() }} variant='outlined'>Save</Button>
                </Paper>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}> {this.state.message} </Alert>
            </div>
        )
    }
}

export default New