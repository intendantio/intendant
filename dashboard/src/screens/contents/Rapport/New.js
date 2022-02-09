import React from 'react'
import Alert from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'

import { Grid, Card, Step, StepLabel, Stepper, Box, Accordion, AccordionSummary, Typography, Button, Paper, Divider, CardHeader, CardActions, CardActionArea, Tooltip } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import WidgetNewItem from '../../../components/WidgetNewItem'
import NewTypePie from '../../../components/NewTypePie'

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
            interval: 0,
            configurations: [],
            configuration: {},
            settings: []
        }
        props.setTitle("New rapport")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultConfigurationModule = await new Request().get().fetch("/api/modules/configuration")
        let resultConfigurationSmartobject = await new Request().get().fetch("/api/smartobjects")
        if (resultConfigurationModule.error) {
            this.props.setMessage(resultConfigurationModule.package + " : " + resultConfigurationModule.message)
        } else if (resultConfigurationSmartobject.error) {
            this.props.setMessage(resultConfigurationSmartobject.package + " : " + resultConfigurationSmartobject.message)
        } else {
            let configurations = resultConfigurationModule.data
            resultConfigurationSmartobject.data.forEach(smartobject => {
                if (smartobject.configuration != null) {
                    smartobject.configuration.smartobject = {
                        id: smartobject.id,
                        reference: smartobject.reference
                    }
                    configurations.unshift(smartobject.configuration)
                }
            })

            configurations = configurations.filter(configuration => {
                return Array.isArray(configuration.widgets) && configuration.widgets.length > 0
            })

            this.setState({ loading: false, configurations: configurations })
        }
    }

    selectSource(configuration, source) {

        this.setState({
            open: false
        })
        let settings = []
        let settingsId = []
        if (Array.isArray(configuration.dataSources)) {
            let actions = []
            configuration.dataSources.forEach(dataSource => {
                if (source.dataSources.includes(dataSource.id) && actions.includes(dataSource.action) == false) {
                    actions.push(dataSource.action)
                }
            })
            configuration.actions.forEach(action => {
                if (actions.includes(action.id)) {
                    action.settings.forEach(setting => {
                        if (settingsId.includes(setting.id) == false) {
                            settings.push(setting)
                            settingsId.push(setting.id)
                        }
                    })
                }

            })
        }
        this.setState({ source: source, settings: settings, configuration: configuration }, () => {
            this.setState({ open: true })
        })
    }

    getStep() {
        switch (this.state.step) {
            case 0:
                return (
                    <NewTypePie onSelect={(type) => { this.setState({ type: type, step: 1 }) }} />
                )
            case 1:
                return this.state.configurations.map(configuration => {
                    if (configuration.module == "module") {
                        return (
                            <Grid item xs={12} md={12} lg={12} >
                                <Card variant='outlined' >
                                    <CardActionArea onClick={() => { this.setState({reference: configuration.name, configuration: configuration, step: 2 }) }} style={{ padding: 10 }}>
                                        <Typography variant='h6' color="text.secondary"  >
                                            {configuration.name}
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    } else {
                        return (
                            <Grid item xs={12} md={12} lg={12} >
                                <Card variant='outlined'   >
                                    <CardActionArea onClick={() => { this.setState({configuration: configuration, step: 2 }) }} style={{ padding: 10 }} >
                                        <Typography variant='h6' color="text.secondary"  >
                                            {configuration.smartobject.reference}
                                        </Typography>
                                        <Typography variant='body2' color="text.secondary"  >
                                            {configuration.name}
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    }
                })
            case 2:
                return this.state.configuration.dataSources.map(dataSource => {
                    return (
                        <Grid item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.setState({ reference: dataSource.id,  step: 3 }) }} style={{ padding: 10 }} >
                                    <Typography variant='h6' color="text.secondary"  >
                                        {capitalizeFirstLetter(dataSource.id)}
                                    </Typography>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })
                case 3:
                return INTERVAL.map(interval => {
                    return (
                        <Grid item xs={12} md={12} lg={12} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.setState({ loading: true,interval: interval.interval },() => { this.submit() }) }} style={{ padding: 10 }} >
                                    <Typography variant='h6' color="text.secondary"  >
                                        {"Each " + capitalizeFirstLetter(interval.name)}
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
        let result = await new Request().post({
            reference: this.state.reference,
            chart: this.state.type,
            interval: this.state.interval,
            type: this.state.configuration.module,
            object: this.state.configuration.module == "smartobject" ? this.state.configuration.smartobject.id : this.state.configuration.name,
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
                <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                    <Typography variant='h5' >New rapport</Typography>
                    <Typography variant='subtitle2' color="text.secondary" >TODO</Typography>
                </Paper>
                <Card variant='outlined' style={{ padding: 10, marginBottom: 10 }}>
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
                        <Step key={"interval"}>
                            <StepLabel>{"Interval"}</StepLabel>
                        </Step>
                    </Stepper>
                </Card>
                <Grid container spacing={2} >
                    {this.getStep()}
                </Grid>
            </>
        )
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default NewRapport