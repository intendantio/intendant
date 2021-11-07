import React from 'react'
import { IconButton, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from '@material-ui/core'
import { Save } from '@material-ui/icons'
import Alert from '../../../components/Alert'
import Request from '../../../utils/Request'

class NewSmartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            module: false,
            reference: "",
            enabled: false,
            message: "",
            types: []
        }
    }

    async componentDidMount() {
        let resultType = await new Request().get().fetch("/api/configurations/smartobject")
        if (resultType.error) {
            this.setState({ enabled: true, message: resultType.package + " : " + resultType.message })
        } else {
            this.setState({
                enabled: false,
                message: "",
                types: resultType.data
            })
        }
    }

    setModule(name) {
        this.state.types.forEach(pModule => {
            if (pModule.name === name) {
                this.setState({
                    module: pModule
                })
            }
        })
    }

    updateSettings(key, value) {
        let tmp = {}
        tmp["settings-" + key] = value
        this.setState(tmp)
    }

    async add() {
        if (this.state.reference === "") {
            this.setState({ enabled: true, message: "Missing-parameter : reference is empty" })
        } else if (this.state.module.name === "") {
            this.setState({ enabled: true, message: "Missing-parameter : type not selected" })
        } else {
            let settings = []
            for (let index = 0; index < this.state.module.settings.length; index++) {
                let setting = this.state.module.settings[index];
                settings.push({
                    reference: setting.id,
                    value: this.state["settings-" + setting.name] ? this.state["settings-" + setting.name] : ""
                })
            }
            let result = await new Request().post({ module: this.state.module.name, reference: this.state.reference, settings: settings }).fetch("/api/smartobjects")
            if (result.error) {
                this.setState({
                    enabled: true,
                    message: result.package + " : " + result.message
                })
            } else {
                this.props.history.push('/smartobject')
            }
        }
    }

    render() {
        return (
            <div>
                <Paper elevation={2} style={{ padding: 10, justifyContent: 'left' }}>
                    <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'row', alignSelf: 'start', alignContent: 'start', alignItems: 'start', padding: 10 }}>
                            <TextField onChange={(event) => { this.setState({ reference: event.nativeEvent.target.value }) }} style={{ width: '150px', marginRight: 10 }} label="Reference" variant="outlined" />
                            <FormControl variant="outlined" style={{ marginRight: 10, width: '300px' }} >
                                <InputLabel>Module</InputLabel>
                                <Select value={this.state.module.name} onChange={(event) => { this.setModule(event.target.value) }} label="Connexion" >
                                    {
                                        this.state.types.map(pModule => {
                                            return <MenuItem value={pModule.name} >{pModule.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    {
                        this.state.module ?
                            this.state.module.settings.length === 0 ?
                                null
                                :
                                <div style={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
                                    <Typography variant='body1' style={{ fontSize: 20 }}>Configuration</Typography>
                                    {
                                        this.state.module.settings.map(settings => {
                                            return (
                                                <TextField
                                                    onChange={(event) => { this.updateSettings(settings.name, event.nativeEvent.target.value) }}
                                                    style={{ width: '300px', marginTop: 10 }}
                                                    label={settings.name}
                                                    variant="outlined"
                                                />
                                            )
                                        })
                                    }
                                </div>
                            : null
                    }
                </Paper>
                <Paper style={{ width: 'min-content', height: 'min-content', padding: 2, alignContent: 'center', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 5 }}>
                    <IconButton onClick={() => { this.add() }} style={{ borderRadius: 0 }} variant='outlined'>
                        <Save />
                    </IconButton>
                </Paper>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    { this.state.message }
                </Alert>
            </div>
        )
    }
}

export default NewSmartobject