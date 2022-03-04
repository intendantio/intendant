import React from 'react'
import { Typography, Paper, Grid, Step, Stepper, Card, StepLabel, CardActionArea, TextField } from '@mui/material'
import Request from '../../../utils/Request'
import Desktop from '../../../components/Desktop'
import Loading from '../../../components/Loading'
import Action from '../../../components/Action'
import AddButton from '../../../components/views/AddButton'
import StepperProxy from '../../../components/StepperProxy'
import NextButton from '../../../components/NextButton'


class NewAutomation extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            processes: [],
            sources: [],
            selected: null,
            trigger: null,
            triggers: [],
            step: "trigger",
            description: ""
        }
        props.setTitle("New automation")
        props.setActionType("return")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/smartobjects")
        let resultProcess = await new Request().get().fetch("/api/processes")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
            this.props.history.push('/automation')
        } else if(resultProcess.error) {
            this.props.setMessage(resultProcess.package + " : " + resultProcess.message)
            this.props.history.push('/automation')
        } else {
            let sources = []
            result.data.filter(smartobject => {
                return smartobject.configuration != null
            }).filter(smartobject => {
                return smartobject.configuration.triggers != null
            }).forEach(smartobject => {
                smartobject.type = "smartobject"
                sources.push(smartobject)
            })
            resultProcess.data.forEach(process => {
                process.type = "process"
                process.reference = process.description
                process.triggers = []
                process.actions = [
                    {
                        id: "process",
                        name: process.mode == "switch" ?  process.description_on + "/" + process.description_off : process.description_on,
                        description: process.mode == "switch" ?  process.description_on + "/" + process.description_off : process.description_on,
                        type: "effect",
                        settings: process.inputs.map(input => {
                            input.id = input.reference
                            return input
                        })
                    }
                ]
                sources.push(process)
            })
            this.setState({ loading: false, sources: sources })
        }
    }


    async submit() {
        let settings = []

        for (let index = 0; index < this.state.action.settings.length; index++) {
            let setting = this.state.action.settings[index]
            settings.push({
                reference: setting.id,
                value: this.state[this.state.action.id + "-" + setting.id] ? this.state[this.state.action.id + "-" + setting.id] : null
            })
        }
        
        let automation = {
            description: this.state.description,
            trigger: {
                type: this.state.trigger.parentType,
                object: this.state.trigger.parent,
                trigger: this.state.trigger.id
            },
            action: {
                type: this.state.action.parentType,
                object: this.state.action.parent,
                action: this.state.action.id,
                settings: settings
            }
        }

        let result = await new Request().post(automation).fetch("/api/automations")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/automation')
        }
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >New automation</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Do what you want when you want</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Card variant='outlined' style={{ padding: 10, marginTop: 8 }}>
                        <Stepper activeStep={{ trigger: 0, action: 1, description: 2 }[this.state.step]} >
                            <Step key={"trigger"}>
                                <StepLabel>{"Trigger"}</StepLabel>
                            </Step>
                            <Step key={"action"}>
                                <StepLabel>{"Action"}</StepLabel>
                            </Step>
                            <Step key={"description"}>
                                <StepLabel>{"Description"}</StepLabel>
                            </Step>
                        </Stepper>
                    </Card>
                    <Grid container spacing={1} style={{ marginTop: 0 }} >
                        <StepperProxy index={"trigger"} value={this.state.step} >
                            {
                                this.state.selected ?
                                    this.state.selected.triggers.map((trigger, index) => {
                                        trigger.parent = this.state.selected.id
                                        trigger.parentType = this.state.selected.type
                                        return (
                                            <Grid key={index} item xs={12} md={12} lg={12} >
                                                <Card variant='outlined'   >
                                                    <CardActionArea onClick={() => { this.setState({ step: "action", trigger: trigger, selected: null, description: "IF " + trigger.name.toLowerCase() + " THEN " }) }} style={{ padding: 10 }} >
                                                        <Typography variant='subtitle1'  >
                                                            {String.capitalizeFirstLetter(trigger.name)}
                                                        </Typography>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                                    :
                                    this.state.sources.map((source, index) => {
                                        if(source.triggers.length > 0) {
                                            return (
                                                <Grid key={index} item xs={12} md={12} lg={12} >
                                                    <Card variant='outlined'   >
                                                        <CardActionArea onClick={() => { this.setState({ selected: source }) }} style={{ padding: 10 }} >
                                                            <Typography variant='subtitle1'  >
                                                                {String.capitalizeFirstLetter(source.reference)}
                                                            </Typography>
                                                        </CardActionArea>
                                                    </Card>
                                                </Grid>
                                            )
                                        }
                                    })
                            }
                        </StepperProxy>
                        <StepperProxy index={"action"} value={this.state.step} >
                            {
                                this.state.selected ?
                                    this.state.selected.actions.filter(action => {
                                        return action.type == "effect"
                                    }).map((action, index) => {
                                        action.parent = this.state.selected.id
                                        action.parentType = this.state.selected.type
                                        return (
                                            <Grid key={index} item xs={12} md={12} lg={12} >
                                                <Card variant='outlined' style={{ padding: 10 }}  >
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={6} md={11} lg={11} style={{alignSelf:'center'}}>
                                                            <Typography variant='subtitle1'  >
                                                                {action.name}
                                                            </Typography>
                                                        </Grid>
                                                        <NextButton xs={6} md={1} lg={1} onClick={() => { this.setState({ step: "description", action: action, selected: null, description: this.state.description + action.name.toLowerCase() }) }} />
                                                            {
                                                                action.settings.map(setting => {
                                                                    return <Action options={setting.options} label={String.capitalizeFirstLetter(setting.id)} setState={this.setState.bind(this)} id={action.id + "-" + setting.id} action={setting} />
                                                                })
                                                            }
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                                    :
                                    <>
                                    {
                                        this.state.sources.map((source, index) => {
                                            let find = false
                                            source.actions.forEach(action => {
                                                if(action.type == "effect") { find = true }
                                            })
                                            if(find) {
                                                return (
                                                    <Grid key={index} item xs={12} md={12} lg={12} >
                                                        <Card variant='outlined'   >
                                                            <CardActionArea onClick={() => { this.setState({ selected: source }) }} style={{ padding: 10 }} >
                                                                <Typography variant='subtitle1'  >
                                                                    {String.capitalizeFirstLetter(source.reference)}
                                                                </Typography>
                                                            </CardActionArea>
                                                        </Card>
                                                    </Grid>
                                                )
                                            }
                                        })
                                    }
                                    </>
                                    
                            }
                        </StepperProxy>
                        <StepperProxy index={"description"} value={this.state.step} >
                            <Grid item xs={12} md={12} lg={12}>
                                <Card variant='outlined' style={{ padding: 10, display: 'flex', alignItems: 'center' }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={10} lg={10}>
                                            <TextField value={this.state.description} onChange={(event) => { this.setState({ description: event.nativeEvent.target.value }) }} placeholder='Description' style={{ width: '100%' }} >

                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={2} lg={2} style={{ display: 'flex', justifyContent: 'end' }}>
                                            <Card variant='outlined' style={{ height: '100%', width: 'min-content' }} >
                                                <CardActionArea onClick={() => { this.submit() }} style={{ padding: 8, paddingLeft: 16, paddingRight: 16, display: 'flex', height: '100%' }}>
                                                    <Typography variant='subtitle1' >Submit</Typography>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                        </StepperProxy>
                    </Grid>
                </Loading>
            </>
        )
    }
}


export default NewAutomation

//