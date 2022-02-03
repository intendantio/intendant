import React from 'react'
import Alert from '../../../components/Alert'
import Desktop from '../../../components/Desktop'
import Request from '../../../utils/Request'

import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, AccordionDetails, Typography, ToggleButtonGroup, Button, ToggleButton, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip, Switch, ButtonGroup, TextField, Checkbox } from '@mui/material'
import { ToggleOff, RadioButtonChecked, ToggleOn, ExpandMore, Lightbulb, Thermostat, Alarm, SettingsRemote, Cloud, NavigateNext } from '@mui/icons-material'

import TypeProcess from '../../../components/process/TypeProcess'
import SwitchState from '../../../components/process/SwitchState'
import TypeProduct from '../../../components/TypeProduct'
import NextButton from '../../../components/NextButton'
import ExecuteActions from '../../../components/process/ExecuteActions'
import ListSmartobjectsActions from '../../../components/process/ListSmartobjectsActions'
import ListSettings from '../../../components/process/ListSettings'
import MergeActions from '../../../components/process/MergeActions'
import Descriptions from '../../../components/process/Descriptions'
import StepperProxy from '../../../components/StepperProxy'



class NewRapport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enabled: false,
            message: "",
            loading: true,
            step: "mode",
            index: -1,
            smartobjects: [],
            modules: [],
            product: "light",
            actionsOn: [],
            actionsOff: [],
            description: "",
            descriptionOn: "",
            descriptionOff: "",
            settings: [],
            settingsMode: [],
            mode: "",
            currentState: "on",
            canMerge: false,
            useMerge: false
        }
        props.setTitle("New process")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultModule = await new Request().get().fetch("/api/modules/configuration")
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects")
        if (resultModule.error) {
            this.setState({ enabled: true, message: resultModule.package + " : " + resultModule.message })
            this.props.history.push('/process')
        } else if (resultSmartobject.error) {
            this.setState({ enabled: true, message: resultSmartobject.package + " : " + resultSmartobject.message })
            this.props.history.push('/process')
        } else {
            let smartobjects = resultSmartobject.data.filter(smartobject => smartobject.configuration != null)
            this.setState({ enabled: false, message: "", loading: false, configurations: [], smartobjects: smartobjects, modules: resultModule.data })
        }
    }

    updateAction(action, parent) {
        let source = this.state.currentState == "on" ? "actionsOn" : "actionsOff"
        let actions = []
        if (this.state[source].includes(action) == false) {
            actions = this.state[source]
            action.parent = parent
            actions.push(action)
        } else {
            actions = this.state[source].filter(pAction => { return pAction != action })
        }
        let state = {}
        state[source] = actions
        this.setState(state)
    }

    submitMode(mode) {
        this.setState({ step: "action", mode: mode, currentState: "on" })
    }

    submitAction() {
        let canMerge = false
        let settingsMode = []
        let settings = []

        if (this.state.mode == "button" && this.state.actionsOn.length == 0) {
            this.setState({ enabled: true, message: "You must define at least one action" })
        } else if (this.state.mode == "switch" && this.state.actionsOn.length == 0) {
            this.setState({ enabled: true, message: "You must define at least one action in mode ON" })
        } else if (this.state.mode == "switch" && this.state.actionsOff.length == 0) {
            this.setState({ enabled: true, message: "You must define at least one action in mode OFF" })
        } else {

            let keys = new Map()
            this.state.actionsOn.forEach(action => {
                action.settings.forEach(setting => {
                    if (keys.has(setting.id)) { canMerge = true }
                    setting.parent = action
                    settings.push({ state: "on", setting: setting })
                    settingsMode.push("default")
                    keys.set(setting.id)
                })
            })
            keys = new Map()
            this.state.actionsOff.forEach(action => {
                action.settings.forEach(setting => {
                    if (keys.has(setting.id)) { canMerge = true }
                    setting.parent = action
                    settings.push({ state: "off", setting: setting })
                    settingsMode.push("default")
                    keys.set(setting.id)
                })
            })

            this.setState({
                step: settings.length == 0 ? "description" : "settings",
                settings: settings,
                settingsMode: settingsMode,
                canMerge: canMerge
            })
        }
    }

    async submitSettings() {
        this.setState({ step: "description" })
    }


    async submitDescription() {






        let process = {
            description: this.state.description,
            description_on: this.state.descriptionOn,
            description_off: this.state.descriptionOff,
            mode: this.state.mode,
            state: "on",
            localisation: 0,
            actions: [],
            inputs: []
        }

        //Create input
        let used = new Map()
        this.state.settingsMode.forEach((settingMode, index) => {
            
            if (settingMode == "dynamic") {
                let options = []

                if (this.state.settings[index].setting.options) {
                    for (let key in this.state.settings[index].setting.options) {
                        let value = this.state.settings[index].setting.options[key]
                        options.push({
                            reference: key,
                            value: value
                        })
                    }
                }
                if(this.state.useMerge) {
                    if(used.has(this.state.settings[index].setting.id + "_" + this.state.settings[index].state)) {
                        return
                    }
                    used.set(this.state.settings[index].setting.id + "_" + this.state.settings[index].state,true)
                }

                if(this.state.useMerge) {
                    process.inputs.push({
                        reference: this.state.settings[index].setting.id,
                        type: this.state.settings[index].setting.type,
                        options: options,
                        state: this.state.settings[index].state
                    })
                } else {
                    process.inputs.push({
                        reference: this.state.settings[index].setting.id + "_" + index,
                        type: this.state.settings[index].setting.type,
                        options: options,
                        state: this.state.settings[index].state
                    })
                }
                
            }
        })

        //Create action
        this.state.actionsOn.forEach(action => {
            let currentSettings = []
            this.state.settings.forEach((setting, index) => {
                if (
                    setting.setting.parent.id == action.id &&
                    setting.setting.parent.parent.id == action.parent.id &&
                    setting.state == "on"
                ) {
                    currentSettings.push({ setting: setting.setting, index: index })
                }
            })
            process.actions.push({
                type: action.parent.configuration.module,
                object: action.parent.id,
                action: action.id,
                state: "on",
                settings: currentSettings.map(setting => {
                    let value = setting.setting.default
                    switch (this.state.settingsMode[setting.index]) {
                        case "custom":
                            if (this.state["setting" + setting.index] != undefined) {
                                value = this.state["setting" + setting.index]
                            }
                            break
                        case "dynamic":
                            if(this.state.useMerge) {
                                value = "{" + setting.setting.id + "}"
                            } else {
                                value = "{" + setting.setting.id + "_" + setting.index + "}"
                            }
                            break
                    }
                    return {
                        reference: setting.setting.id,
                        value: value,
                        default: setting.setting.default
                    }
                })
            })
        })

        this.state.actionsOff.forEach(action => {
            let currentSettings = []
            this.state.settings.forEach((setting, index) => {
                if (
                    setting.setting.parent.id == action.id &&
                    setting.setting.parent.parent.id == action.parent.id &&
                    setting.state == "off"
                ) {
                    currentSettings.push({ setting: setting.setting, index: index })
                }
            })
            process.actions.push({
                type: action.parent.configuration.module,
                object: action.parent.id,
                action: action.id,
                state: "off",
                settings: currentSettings.map(setting => {
                    let value = setting.setting.default
                    switch (this.state.settingsMode[setting.index]) {
                        case "custom":
                            value = this.state["setting-" + setting.index]
                            break
                        case "dynamic":
                            value = "{" + setting.setting.id + "_" + setting.index + "}"
                            break
                    }
                    return {
                        reference: setting.setting.id,
                        value: value,
                        default: setting.setting.default
                    }
                })
            })
        })
        let result = await new Request().post(process).fetch("/api/processes")

        if (result.error) {
            this.setState({ enabled: true, loading: false, message: result.package + " : " + result.message })
        } else {
            document.getElementById('main').scroll({
                top: 0,
                left: 0
            })
            this.props.history.push('/process')
        }

    }


    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >New process</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >TODO</Typography>
                    </Paper>
                </Desktop>
                <Card variant='outlined' style={{ padding: 10, marginBottom: 10 }}>
                    <Stepper activeStep={{ mode: 0, action: 1, settings: 2, description: 3 }[this.state.step]} >
                        <Step key={"mode"}>
                            <StepLabel>{"Mode"}</StepLabel>
                        </Step>
                        <Step key={"action"}>
                            <StepLabel>{"Action"}</StepLabel>
                        </Step>
                        <Step key={"settings"}>
                            <StepLabel>{"Settings"}</StepLabel>
                        </Step>
                        <Step key={"description"}>
                            <StepLabel>{"Description"}</StepLabel>
                        </Step>
                    </Stepper>
                </Card>
                <Grid container spacing={2} style={{ marginTop: -10 }} >
                    <StepperProxy index={"mode"} value={this.state.step} >
                        <TypeProcess onChange={(mode) => { this.submitMode(mode) }} />
                    </StepperProxy>
                    <StepperProxy index={"action"} value={this.state.step} >
                        <TypeProduct product={this.state.product} onChange={(product) => { this.setState({ product: product, index: -1 }) }} />
                        {
                            this.state.mode == "button" ? null :
                                <SwitchState actionsOff={this.state.actionsOff} actionsOn={this.state.actionsOn} state={this.state.currentState} onChange={(state) => { this.setState({ currentState: state, index: -1 }) }} />
                        }
                        <NextButton xs={4} md={this.state.mode == "button" ? 8 : 5} lg={this.state.mode == "button" ? 8 : 5} onClick={() => { this.submitAction() }} />
                        <ExecuteActions mode={this.state.mode} state={this.state.currentState} actions={this.state.currentState == "on" ? this.state.actionsOn : this.state.actionsOff} onChange={(action) => { this.updateAction(action) }} />
                        {
                            this.state.product == "cloud" ?
                                <>{/*TODO*/}</>
                                :
                                <ListSmartobjectsActions
                                    smartobjects={this.state.smartobjects.filter(smartobject => {
                                        return smartobject.configuration.product == this.state.product
                                    })}
                                    actions={this.state.currentState == "on" ? this.state.actionsOn : this.state.actionsOff}
                                    index={this.state.index}
                                    onOpen={(index) => { this.setState({ index: this.state.index == index ? -1 : index }) }}
                                    onChange={(action, parent) => { this.updateAction(action, parent) }}
                                />
                        }
                    </StepperProxy>
                    <StepperProxy index={"settings"} value={this.state.step} >
                        <MergeActions value={this.state.useMerge} onChange={(value) => { this.setState({ useMerge: value }) }} disabled={this.state.canMerge == false} />
                        <NextButton xs={12} md={2} lg={2} onClick={() => { this.submitSettings() }} />
                        <ListSettings settings={this.state.settings} mode={this.state.mode} isMobile={this.props.isMobile}
                            settingsMode={this.state.settingsMode} setState={this.setState.bind(this)}
                            onChange={(settingsMode) => { this.setState({ settingsMode: settingsMode }) }}
                        />
                    </StepperProxy>
                    <StepperProxy index={"description"} value={this.state.step} >
                        <Descriptions mode={this.state.mode} onClick={() => { this.submitDescription() }} onChange={(mode, value) => {
                            this.setState(mode == "" ? { description: value } : mode == "on" ? { descriptionOn: value } : { descriptionOff: value })
                        }} />
                    </StepperProxy>
                </Grid>
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </>
        )
    }
}

export default NewRapport

/*
    Value will be requested at each execution
    Fixed value that will not vary
 */