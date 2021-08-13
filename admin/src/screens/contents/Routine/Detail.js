import React from 'react'
import { Popover, InputAdornment, FormControlLabel, Modal, Fade, Select, MenuItem, Checkbox, Slider, FormControl, InputLabel, Card, Typography, Button, TextField, IconButton, Paper } from '@material-ui/core'
import { Save, Add, List } from '@material-ui/icons'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'
import Source from '../../../utils/Source'
import Action from '../../../components/Action'
import Theme from '../../../Theme'
import IconList from '../../../components/IconList'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: Theme.palette.background.paper,
    padding: 10,
    borderRadius: 5
}

class NewRoutine extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            popup: false,
            id: props.match.params.id,
            enabled: false,
            message: "",
            routine: null,
            sources: [],
            modalTrigger: false,
            modalEffect: false
        }
    }

    async componentDidMount() {
        let resultSource = await Source.getSource(["smartobject", "process", "module"])
        let result = await new Request().get().fetch("/api/routines/" + this.state.id)
        if (result.error) {
            this.setState({ enabled: true, message: result.code + " : " + result.message })
        } else if (resultSource.error) {
            this.setState({ enabled: true, message: resultSource.code + " : " + resultSource.message })
        } else {
            this.setState({ routine: result.data, sources: resultSource.data })
        }
    }

    reset() {
        this.setState({ action: null, source: null, result: null, statement: null, expected: null })
    }

    setSource(id) {
        this.state.sources.map(source => {
            if (source.id == id) { this.setState({ source: source, action: null }) }
        })
    }

    setAction(id) {
        this.state.source.actions.map(action => {
            if (action.id == id) { this.setState({ action: action }) }
        })
    }

    updateIcon(icon) {
        let routine = this.state.routine
        routine.icon = icon
        this.setState({ routine: routine })
    }

    updateName(name) {
        let routine = this.state.routine
        routine.name = name
        this.setState({ routine: routine })
    }

    updateWatch(watch) {
        let routine = this.state.routine
        routine.watch = watch
        this.setState({ routine: routine })
    }

    addTrigger() {
        if (this.state.source == null) {
            this.setState({ enabled: true, message: "Missing source" })
        } else if (this.state.action == null) {
            this.setState({ enabled: true, message: "Missing action" })
        } else {
            let settings = []
            for (let index = 0; index < this.state.action.settings.length; index++) {
                let setting = this.state.action.settings[index];
                let value = this.state["argument-" + setting.id]
                if (value == undefined) {
                    value = setting.default
                }
                settings.push({ reference: setting.id, value: value })
            }
            let routine = this.state.routine
            routine.triggers.push({
                source: this.state.source.id,
                type: this.state.source.type,
                action: this.state.action.id,
                arguments: settings,
                result: this.state.result,
                statement: this.state.statement,
                expected: this.state.expected
            })
            this.setState({
                routine: routine,
                modalTrigger: false,
                action: null,
                source: null,
                result: null,
                statement: null,
                expected: null
            })
        }
    }

    addEffect() {
        if (this.state.source == null) {
            this.setState({ enabled: true, message: "Missing source" })
        } else if (this.state.action == null) {
            this.setState({ enabled: true, message: "Missing action" })
        } else {
            let settings = []
            for (let index = 0; index < this.state.action.settings.length; index++) {
                let setting = this.state.action.settings[index];
                let value = this.state["argument-" + setting.id]
                if (value == undefined) {
                    value = setting.default
                }
                settings.push({ reference: setting.id, value: value })
            }
            let routine = this.state.routine
            routine.effects.push({
                source: this.state.source.id,
                type: this.state.source.type,
                action: this.state.action.id,
                arguments: settings
            })
            this.setState({
                routine: routine,
                modalEffect: false,
                action: null,
                source: null
            })
        }
    }

    removeTrigger(pIndex) {
        let routine = this.state.routine
        let triggers = routine.triggers.filter((trigger, index) => { return index != pIndex })
        routine.triggers = triggers
        this.setState({ routine: routine })
    }

    removeEffect(pIndex) {
        let routine = this.state.routine
        let effects = routine.effects.filter((effect, index) => { return index != pIndex })
        routine.effects = effects
        this.setState({ routine: routine })
    }

    async save() {
        if (this.state.routine.name.length == 0) {
            this.setState({ enabled: true, message: "Missing name" })
        } else if (this.state.routine.icon.length == 0) {
            this.setState({ enabled: true, message: "Missing icon" })
        } else if (this.state.routine.effects.length == 0) {
            this.setState({ enabled: true, message: "Missing effect" })
        } else {
            let result = await new Request().post({
                name: this.state.routine.name,
                watch: this.state.routine.watch,
                icon: this.state.routine.icon,
                triggers: this.state.routine.triggers,
                effects: this.state.routine.effects
            }).fetch('/api/routines/' + this.state.id)
            if (result.error) {
                this.setState({ enabled: true, message: result.code + " : " + result.message })
            } else {
                this.props.history.push('/routine/')
            }
        }
    }

    render() {
        if (this.state.routine) {
            return (
                <div>
                    <Paper elevation={2} style={{ padding: 10, justifyContent: 'left' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <TextField onChange={(event) => { this.updateName(event.nativeEvent.target.value) }} style={{ width: '49%' }} value={this.state.routine.name} label="Name" variant='outlined'></TextField>
                                <TextField onChange={(event) => { this.updateIcon(event.nativeEvent.target.value) }} value={this.state.routine.icon} label="Icon" variant='outlined' style={{ width: '49%' }} 
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => { this.setState({ popup: true }) }} style={{ margin: 0, padding: 0 }}>
                                                <List />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                ></TextField>
                            
                        <Popover
                            open={this.state.popup}
                            onClose={() => { this.setState({ popup: false }) }}
                            anchorOrigin={{ vertical: 'top',  horizontal: 'center', }}
                            transformOrigin={{  vertical: 'top', horizontal: 'center', }}
                        >
                            <IconList onSelect={(icon) => { this.setState({ popup: false }); this.updateIcon(icon)}} />
                        </Popover>
                            
                            </div>
                            <div style={{ marginBottom: 10, marginTop: 10, borderStyle: 'solid', borderRadius: 3, borderWidth: 0.25, marginRight: 10, borderColor: 'rgba(255, 255, 255, 0.23)' }}>
                                <div style={{ display: 'flex', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                                    <div style={{ display: 'flex', flex: 6, justifyContent: 'center' }}>
                                        <Slider
                                            defaultValue={0}
                                            valueLabelDisplay="auto"
                                            orientation={'horizontal'}
                                            min={0}
                                            max={1440}
                                            step={1}
                                            value={this.state.routine.watch}
                                            onChange={(event, value) => { this.updateWatch(value) }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ flexDirection: 'row', display: 'flex', marginTop: 20 }}>
                            <div style={{ flex: 1, padding: 5 }} >
                                <Typography variant="subtitle1"  >Trigger</Typography>

                                <Card style={{ textTransform: 'none', padding: 15, marginTop: 5, marginRight: 10, borderStyle: 'solid', borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)', height: 'min-content' }}>   {
                                    this.state.routine.triggers.map((trigger, index) => {
                                        return (
                                            <div onClick={() => this.removeTrigger(index)} style={{ textTransform: 'none', padding: 15, marginTop: 5, borderStyle: 'solid', borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)', height: 'min-content', marginBottom: 10 }}>
                                                <div  >
                                                    <Typography variant="body2"  >{"Type : " + trigger.type} </Typography>
                                                    <Typography variant="body2"  >{"Reference : " + trigger.source}</Typography>
                                                    <Typography variant="body2"  >{"Action : " + trigger.action}</Typography>
                                                    {
                                                        trigger.arguments.length > 0 ?
                                                            <div style={{ marginLeft: 20 }}>
                                                                {
                                                                    trigger.arguments.map(setting => {
                                                                        return (
                                                                            <Typography variant="body2"  >{setting.reference + " : " + setting.value} </Typography>
                                                                        )
                                                                    })
                                                                }
                                                            </div> : null
                                                    }
                                                </div>
                                                {
                                                    trigger.result && trigger.statement && trigger.expected ?
                                                        <div>
                                                            <Typography variant="body2"  >{"Pour condition"}</Typography>
                                                            <div style={{ marginLeft: 20 }}>
                                                                <Typography variant="body2"  >{"Resultat : " + trigger.result}</Typography>
                                                                <Typography variant="body2"  >{"Condition : " + trigger.statement}</Typography>
                                                                <Typography variant="body2"  >{"Expected : " + trigger.expected}</Typography>
                                                            </div>
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                        )
                                    })
                                }
                                    <Button onClick={() => { this.reset(); this.setState({ modalTrigger: true }) }} style={{ width: '100%', borderStyle: 'solid', borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)' }}>
                                        <Add />
                                    </Button>
                                </Card>
                            </div>
                            <div style={{ flex: 1, padding: 5 }} >
                                <Typography variant="subtitle1" >Effect</Typography>
                                <Card style={{ textTransform: 'none', padding: 15, marginTop: 5, marginRight: 10, borderStyle: 'solid', borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)', height: 'min-content' }}>
                                    {
                                        this.state.routine.effects.map((effect, index) => {
                                            return (
                                                <div onClick={() => this.removeEffect(index)} style={{ textTransform: 'none', padding: 15, marginTop: 5, borderStyle: 'solid', borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)', height: 'min-content', marginBottom: 10 }}>
                                                    <Typography variant="body2"  >{"Type : " + effect.type} </Typography>
                                                    <Typography variant="body2"  >{"Reference : " + effect.source}</Typography>
                                                    <Typography variant="body2"  >{"Action : " + effect.action}</Typography>
                                                    {
                                                        effect.arguments.length > 0 ?
                                                            <div style={{ marginLeft: 20 }}>
                                                                {
                                                                    effect.arguments.map(setting => {
                                                                        return (
                                                                            <Typography variant="body2"  >{setting.reference + " : " + setting.value} </Typography>
                                                                        )
                                                                    })
                                                                }
                                                            </div> : null
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                    <Button onClick={() => { this.reset(); this.setState({ modalEffect: true }) }} style={{ width: '100%', borderStyle: 'solid', borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)' }}>
                                        <Add />
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </Paper>
                    <Paper style={{ width: 'min-content', height: 'min-content', padding: 2, alignContent: 'center', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 5 }}>
                        <IconButton onClick={() => { this.save() }} style={{ borderRadius: 0 }} variant='outlined'>
                            <Save />
                        </IconButton>
                    </Paper>
                    <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                        {this.state.message}
                    </Alert>
                    <Modal open={this.state.modalTrigger} onClose={() => { this.reset(); this.setState({ modalTrigger: false }) }} >
                        <Fade in={this.state.modalTrigger} >
                            <Paper style={style}>
                                <div style={{ display: 'flex', flexDirection: 'column' }} >
                                    <Typography variant='h5' >
                                        New Trigger
                                    </Typography>
                                    <FormControl variant="outlined" style={{ marginTop: 5, marginBottom: 5 }} >
                                        <InputLabel>Source</InputLabel>
                                        <Select placeholder='Source' style={{ width: '100%' }} value={this.state.source ? this.state.source.id : null} onChange={(event) => { this.setSource(event.target.value) }} label="Source" >
                                            {
                                                this.state.sources.map(source => {
                                                    return <MenuItem value={source.id} >{source.name}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                    {
                                        this.state.source ?
                                            <FormControl variant="outlined" style={{ marginTop: 5, marginBottom: 5 }} >
                                                <InputLabel>Action</InputLabel>
                                                <Select placeholder='Action' style={{ width: '100%' }} value={this.state.action ? this.state.action.id : null} onChange={(event) => { this.setAction(event.target.value) }} label="Source" >
                                                    {
                                                        this.state.source.actions.map(action => {
                                                            return <MenuItem value={action.id} >{action.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            : null
                                    }
                                    {
                                        this.state.action && this.state.action.settings.length > 0 ?
                                            <div style={{ marginBottom: 10, marginTop: 10, borderStyle: 'solid', paddingLeft: 10, paddingRight: 10, borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, paddingBottom: 10 }}>
                                                    {
                                                        this.state.action.settings.map(setting => {
                                                            return <Action setState={this.setState.bind(this)} action={setting} />
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            : null
                                    }
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ marginBottom: 10, marginTop: 10, flex: 1 }} >
                                            <TextField variant="outlined" placeholder={"Result"} value={this.state.result} onChange={(event) => { this.setState({ result: event.currentTarget.value }) }} style={{ width: '100%' }} />
                                        </div>
                                        <FormControl variant="outlined" style={{ marginBottom: 5, marginTop: 5, flex: 1 }} >
                                            <InputLabel>Condition</InputLabel>
                                            <Select placeholder='Action' style={{ width: '100%' }} value={this.state.statement} onChange={(event) => { this.setState({ statement: event.target.value }) }} label="Source" >
                                                <MenuItem value={"equal"} >{"="}</MenuItem>
                                                <MenuItem value={"smaller"} >{"<"}</MenuItem>
                                                <MenuItem value={"bigger"} >{">"}</MenuItem>
                                                <MenuItem value={"different"} >{"<>"}</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <div style={{ marginBottom: 10, marginTop: 10, flex: 1 }} >
                                            <TextField variant="outlined" placeholder={"Expected"} value={this.state.expected} onChange={(event) => { this.setState({ expected: event.currentTarget.value }) }} style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                    <Button onClick={() => { this.addTrigger() }} variant='outlined' style={{ width: 'minContent', marginTop: 5 }}>
                                        Save
                                    </Button>
                                </div>
                            </Paper>
                        </Fade>
                    </Modal>
                    <Modal open={this.state.modalEffect} onClose={() => { this.reset(); this.setState({ modalEffect: false }) }} >
                        <Fade in={this.state.modalEffect} >
                            <Paper style={style}>
                                <div style={{ display: 'flex', flexDirection: 'column' }} >
                                    <Typography variant='h5' >
                                        New effect
                                    </Typography>
                                    <FormControl variant="outlined" style={{ marginTop: 5, marginBottom: 5 }} >
                                        <InputLabel>Source</InputLabel>
                                        <Select placeholder='Source' style={{ width: '100%' }} value={this.state.source ? this.state.source.id : null} onChange={(event) => { this.setSource(event.target.value) }} label="Source" >
                                            {
                                                this.state.sources.map(source => {
                                                    return <MenuItem value={source.id} >{source.name}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                    {
                                        this.state.source ?
                                            <FormControl variant="outlined" style={{ marginTop: 5, marginBottom: 5 }} >
                                                <InputLabel>Action</InputLabel>
                                                <Select placeholder='Action' style={{ width: '100%' }} value={this.state.action ? this.state.action.id : null} onChange={(event) => { this.setAction(event.target.value) }} label="Source" >
                                                    {
                                                        this.state.source.actions.map(action => {
                                                            return <MenuItem value={action.id} >{action.name}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            : null
                                    }
                                    {
                                        this.state.action && this.state.action.settings.length > 0 ?
                                            <div style={{ marginBottom: 10, marginTop: 10, borderStyle: 'solid', paddingLeft: 10, paddingRight: 10, borderRadius: 3, borderWidth: 0.25, borderColor: 'rgba(255, 255, 255, 0.23)' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 10, paddingBottom: 10 }}>
                                                    {
                                                        this.state.action.settings.map(setting => {
                                                            return <Action setState={this.setState.bind(this)} action={setting} />
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            : null
                                    }
                                    <Button onClick={() => { this.addEffect() }} variant='outlined' style={{ width: 'minContent', marginTop: 5 }}>
                                        Save
                                    </Button>
                                </div>
                            </Paper>
                        </Fade>
                    </Modal>
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

export default NewRoutine