import React from 'react'
import { IconButton, TextField, Select, Button, MenuItem, FormControl, InputLabel, Typography, Paper } from '@mui/material'
import { Save } from '@mui/icons-material'
import Alert from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'
import md5 from 'md5'

class NewSmartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            module: false,
            localisation: false,
            reference: "",
            enabled: false,
            message: "",
            types: [],
            smartobjects: [],
            localisations: []
        }



    }

    async componentDidMount() {
        let resultType = await new Request().get().fetch("/api/configurations/smartobject")
        let resultLocalisation = await new Request().get().fetch("/api/localisations")
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects")
        if (resultType.error || resultSmartobject.error || resultLocalisation.error) {
            this.setState({ enabled: true, message: resultSmartobject.message + " : " + resultType.message + " : " + resultLocalisation.message })
        } else {
            this.setState({
                enabled: false,
                message: "",
                types: resultType.data,
                smartobjects: resultSmartobject.data,
                localisations: resultLocalisation.data
            })
        }

        /*if(location.hash.split("#").length == 2) {
            let v = location.hash.split("#")[1].split("&").map(param => {
                let tmp = param.split("=")
                if(tmp.length == 2) {
                    this.updateSettings(tmp[0],tmp[1])
                }
            })
        }*/


    }

    setModule(name) {
        this.state.types.forEach(pModule => {
            if (pModule.name === name) {
                this.setState({
                    module: false
                }, () => {
                    this.setState({
                        module: pModule
                    })
                })

            }
        })
    }

    setLocalisation(id) {
        this.state.localisations.forEach(pLocalisation => {
            if (pLocalisation.id === id) {
                this.setState({
                    localisation: pLocalisation
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
        } else if (this.state.localisation === false) {
            this.setState({ enabled: true, message: "Missing-parameter : localisation not selected" })
        } else if (this.state.module.name === "") {
            this.setState({ enabled: true, message: "Missing-parameter : type not selected" })
        } else {
            let settings = []
            for (let index = 0; index < this.state.module.settings.length; index++) {
                let setting = this.state.module.settings[index];
                settings.push({
                    reference: setting.id,
                    value: this.state["settings-" + setting.id] ? this.state["settings-" + setting.id] : ""
                })
            }
            let result = await new Request().post({ localisation: this.state.localisation.id, module: this.state.module.name, reference: this.state.reference, settings: settings }).fetch("/api/smartobjects")
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

    getSettings() {
        let settings = []
        for (let index = 0; index < this.state.module.settings.length; index++) {
            let setting = this.state.module.settings[index]
            if(
                this.state["settings-" + setting.id] != "" && 
                this.state["settings-" + setting.id] != undefined && 
                this.state["settings-" + setting.id] != null
            ) {
                settings.push({
                    reference: setting.id,
                    value: this.state["settings-" + setting.id] ? this.state["settings-" + setting.id] : ""
                })
            }
            
        }
        return settings
    }

    render() {
        return (
            <div>
                <Paper variant="outlined" style={{ padding: 10, justifyContent: 'left' }}>
                    <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'row', alignSelf: 'start', alignContent: 'start', alignItems: 'start', padding: 10 }}>
                            <TextField onChange={(event) => { this.setState({ reference: event.nativeEvent.target.value }) }} style={{ width: '150px', marginRight: 10 }} label="Reference" variant="outlined" />
                            <FormControl variant="outlined" style={{ marginRight: 10, width: '300px' }} >
                                <InputLabel>Module</InputLabel>
                                <Select value={this.state.module ? this.state.module.name : ""} onChange={(event) => { this.setModule(event.target.value) }} label="Connexion" >
                                    {
                                        this.state.types.map((pModule,index) => {
                                            return <MenuItem key={index} value={pModule.name} >{pModule.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" style={{ marginRight: 10, width: '300px' }} >
                                <InputLabel>Localisation</InputLabel>
                                <Select value={this.state.localisation ? this.state.localisation.id : ""} onChange={(event) => { this.setLocalisation(event.target.value) }} label="Connexion" >
                                    {
                                        this.state.localisations.map((pLocalisation,index) => {
                                            return <MenuItem key={index} value={pLocalisation.id} >{pLocalisation.name}</MenuItem>
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
                                        this.state.module.settings.map((settings,index) => {
                                            if (settings.type == "smartobject") {
                                                settings.type = "select",
                                                    settings.values = this.state.smartobjects.filter(smartobject => {
                                                        return smartobject.module == settings.reference
                                                    })
                                            }

                                            return (
                                                <div key={index} style={{ marginTop: 5, marginBottom: 5 }}>
                                                    <Action
                                                        setState={this.setState.bind(this)} action={settings}
                                                        action={settings}
                                                        isDisabled={settings.type == "oauth2" && (this.state.localisation == false || this.state.reference.length == 0)}
                                                        object={{
                                                            reference: this.state.reference,
                                                            localisation: this.state.localisation.id,
                                                            module: this.state.module.name,
                                                            settings: this.getSettings()
                                                            }}
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            : null
                    }
                </Paper>
                <Paper variant="outlined" style={{ width: 'min-content', marginTop: 10, marginBottom: 10, alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <IconButton onClick={() => { this.add() }} style={{ borderRadius: 0 }} variant='outlined'>
                        <Save />
                    </IconButton>
                </Paper>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div>
        )
    }
}

export default NewSmartobject