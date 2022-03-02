import React from 'react'
import Request from '../../../utils/Request'

import { Grid, Card, Step, StepLabel, Stepper, Typography, Paper, CardActionArea } from '@mui/material'
import NewTypePie from '../../../components/NewTypePie'
import Loading from '../../../components/Loading'
import Action from '../../../components/Action'
import NextButton from '../../../components/NextButton'
import Utils from '../../../utils/Utils'

const INTERVAL = [
    {
        name: "1 minute",
        interval: 60,
    },
    {
        name: "5 minutes",
        interval: 300,
    },
    {
        name: "15 minutes",
        interval: 900,
    },
    {
        name: "30 minutes",
        interval: 1800,
    },
    {
        name: "1 hour",
        interval: 3600,
    },
    {
        name: "3 hours",
        interval: 10800,
    },
    {
        name: "6 hours",
        interval: 21600,
    },
    {
        name: "12 hours",
        interval: 43200,
    },
    {
        name: "24 hours",
        interval: 86400,
    }
]


class NewRapport extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            step: 0,
            reference: "",
            interval: 0,
            configurations: [],
            configuration: {},
            settings: []
        }
        props.setTitle("New rapport")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultModules = await new Request().get().fetch("/api/modules")
        let resultSmartobjects = await new Request().get().fetch("/api/smartobjects")
        if (resultModules.error) {
            this.props.setMessage(resultModules.package + " : " + resultModules.message)
        } else if (resultSmartobjects.error) {
            this.props.setMessage(resultSmartobjects.package + " : " + resultSmartobjects.message)
        } else {

            let configurations = []

            resultSmartobjects.data.forEach(smartobject => {
                if (Array.isArray(smartobject.dataSources) && smartobject.dataSources.length > 0) {
                    configurations.push(smartobject)
                }
            })
            resultModules.data.forEach(pModule => {
                if (Array.isArray(pModule.dataSources) && pModule.dataSources.length > 0) {
                    configurations.push({
                        configuration: pModule,
                        name: pModule.name,
                        reference: pModule.reference,
                        widgets: pModule.widgets,
                        dataSources: pModule.dataSources,
                        actions: pModule.actions
                    })
                }
            })
            if (configurations.length == 0) {
                this.props.setMessage("No sources available")
                this.props.history.push('/rapport')
            } else {
                this.setState({ loading: false, configurations: configurations })
            }

            this.setState({ loading: false, configurations: configurations })
        }
    }

    selectSource(dataSource) {
        this.setState({ open: false })
        let settings = []

        this.state.configuration.actions.forEach(action => {
            if (action.id == dataSource.action) {
                settings = action.settings
            }
        })

        if (settings.length == 0) {
            this.setState({ step: 4, reference: dataSource.id, settings: settings })
        } else {
            this.setState({ step: 3, reference: dataSource.id, settings: settings })
        }
    }

    getStep() {
        switch (this.state.step) {
            case 0:
                return (
                    <NewTypePie onSelect={(type) => { this.setState({ type: type, step: 1 }) }} />
                )
            case 1:
                return this.state.configurations.map((configuration, index) => {
                    if (configuration.module == "module") {
                        return (
                            <Grid key={index} item xs={12} md={12} lg={12} >
                                <Card variant='outlined' >
                                    <CardActionArea onClick={() => { this.setState({ configuration: configuration, step: 2 }) }} style={{ padding: 10 }}>
                                        <Typography variant='subtitle1'  >
                                            {configuration.name}
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    } else {
                        return (
                            <Grid key={index} item xs={12} md={12} lg={12} >
                                <Card variant='outlined'   >
                                    <CardActionArea onClick={() => { this.setState({ configuration: configuration, step: 2 }) }} style={{ padding: 10 }} >
                                        <Typography variant='subtitle1'  >
                                            {configuration.reference}
                                        </Typography>
                                        <Typography variant='caption' color="text.secondary"  >
                                            {configuration.configuration.name}
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    }
                })
            case 2:

                return this.state.configuration.dataSources.map((dataSource, index) => {
                    return (
                        <Grid key={index} item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.selectSource(dataSource) }} style={{ padding: 10 }} >
                                    <Typography variant='subtitle1' >
                                        {String.capitalizeFirstLetter(dataSource.id)}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })
            case 3:
                return (
                    <>
                        {
                            this.state.settings.map((setting, index) => {
                                return (
                                    <Grid key={index} item xs={12} md={12} lg={12} >
                                        <Card variant='outlined' style={{ padding: 10 }}>
                                            <Action options={setting.options} label={String.capitalizeFirstLetter(setting.id)} setState={this.setState.bind(this)} id={"rapport-" + setting.id} action={setting} />
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                        <NextButton xs={12} md={12} lg={12} onClick={() => { this.setState({ step: 4 }) }} />
                    </>
                )
            case 4:
                return INTERVAL.map((interval, index) => {
                    return (
                        <Grid key={index} item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.setState({ loading: true, interval: interval.interval }, () => { this.submit() }) }} style={{ padding: 10 }} >
                                    <Typography variant='subtitle1'  >
                                        {"Each " + String.capitalizeFirstLetter(interval.name)}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })
        }
    }

    async submit() {

        let settings = []
        let resetState = {}
        for (let indexSettings = 0; indexSettings < this.state.settings.length; indexSettings++) {
            let setting = this.state.settings[indexSettings]
            resetState["rapport-" + setting.id] = null
            settings.push({
                reference: setting.id,
                value: this.state["rapport-" + setting.id] ? this.state["rapport-" + setting.id] : null,
                type: typeof this.state["rapport-" + setting.id]
            })
        }
        let result = await new Request().post({
            reference: this.state.reference,
            chart: this.state.type,
            interval: this.state.interval,
            type: this.state.configuration.configuration.module,
            object: this.state.configuration.configuration.module == "smartobject" ? this.state.configuration.id : Utils.getSum(this.state.configuration.name) ,
            settings: settings
        }).fetch("/api/rapports")

        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            document.getElementById('main').scroll({
                top: 0,
                left: 0
            })
            this.props.history.push('/rapport')
        }
    }


    render() {
        return (
            <>
                <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                    <Typography variant='h6' fontWeight='bold' >New rapport</Typography>
                    <Typography variant='subtitle2' color="text.secondary" >Capture your data</Typography>
                </Paper>
                <Loading loading={this.state.loading}>
                    <Card variant='outlined' style={{ padding: 10, marginTop: 8 }}>
                        <Stepper activeStep={this.state.step} >
                            <Step key={"type"}>
                                <StepLabel>{"Type"}</StepLabel>
                            </Step>
                            <Step key={"source"}>
                                <StepLabel>{"Source"}</StepLabel>
                            </Step>
                            <Step key={"data"}>
                                <StepLabel>{"Data"}</StepLabel>
                            </Step>
                            <Step key={"settings"}>
                                <StepLabel>{"Settings"}</StepLabel>
                            </Step>
                            <Step key={"interval"}>
                                <StepLabel>{"Interval"}</StepLabel>
                            </Step>
                        </Stepper>
                    </Card>
                    <Grid container spacing={1} style={{ marginTop: 0 }} >
                        {this.getStep()}
                    </Grid>
                </Loading>
            </>
        )
    }
}

export default NewRapport