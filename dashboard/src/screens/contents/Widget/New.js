import React from 'react'
import Alert from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'

import AccordionSkeleton from '../../../components/AccordionSkeleton'

import { Grid, Card, AccordionDetails, CardContent, Box, Accordion, AccordionSummary, Typography, Button, Paper, Divider, CardHeader, CardActions } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import WidgetNewItem from '../../../components/WidgetNewItem'



class NewWidget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            enabled: false,
            message: "",
            loading: true,
            index: -1,
            open: false,
            widget: {
                settings: []
            },
            configuration: {
                module: "module"
            },
            configurations: [],
            settings: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/smartobjects")
        let resultConfigurationModule = await new Request().get().fetch("/api/modules/configuration")
        let resultConfigurationSmartobject = await new Request().get().fetch("/api/smartobjects")
        if (result.error) {
            this.setState({ enabled: true, message: result.package + " : " + result.message })
        } else if (resultConfigurationModule.error) {
            this.setState({ enabled: true, message: resultConfigurationModule.package + " : " + resultConfigurationModule.message })
        } else if (resultConfigurationSmartobject.error) {
            this.setState({ enabled: true, message: resultConfigurationSmartobject.package + " : " + resultConfigurationSmartobject.message })
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

            this.setState({ enabled: false, message: "", loading: false, configurations: configurations })
        }
    }

    async submit(callback) {

        let settings = []

        for (let indexSettings = 0; indexSettings < this.state.settings.length; indexSettings++) {
            let setting = this.state.settings[indexSettings];
            if (this.state["settings-" + setting.id] == undefined) {
                this.setState({ enabled: true, loading: false, message: "Missing " + setting.id })
                return
            }
            settings.push({
                reference: setting.id,
                value: this.state["settings-" + setting.id] ? this.state["settings-" + setting.id] : "",
                type: typeof this.state["settings-" + setting.id]
            })
        }
        let result = await new Request().post({
            reference: this.state.widget.id,
            type: this.state.configuration.module,
            object: this.state.configuration.module == "smartobject" ? this.state.configuration.smartobject.id : this.state.configuration.name,
            settings: settings
        }).fetch("/api/widgets")

        if (result.error) {
            callback()
            this.setState({ enabled: true, loading: false, message: result.package + " : " + result.message })
        } else {
            document.getElementById('main').scroll({
                top: 0,
                left: 0
            })
            this.props.history.push('/widget')
        }
    }

    delete(index) {
        let contents = []
        this.state.contents.forEach((content, pindex) => {
            if (pindex != index) { contents.push(content) }
        })
        this.setState({ contents: contents })
    }

    selectWidget(configuration, widget) {
        if (this.state.open && configuration.module == "smartobject" && this.state.configuration.module == "smartobject" && this.state.configuration.smartobject.id == configuration.smartobject.id) {
            return
        } else if (this.state.open && widget.name == this.state.widget.name && configuration.module == "module" && this.state.configuration.module == "module") {
            return
        }
        this.setState({
            open: false
        })
        let settings = []
        let settingsId = []
        if (Array.isArray(configuration.dataSources)) {
            let actions = []
            configuration.dataSources.forEach(dataSource => {
                if (widget.dataSources.includes(dataSource.id) && actions.includes(dataSource.action) == false) {
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
        this.setState({ widget: widget, settings: settings, configuration: configuration }, () => {
            this.setState({ open: true })
        })
    }


    render() {
        return (
            <div>
                <Paper variant="outlined" style={{ padding: 16, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h5' >Widget</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Show what you need</Typography>
                </Paper>
                {
                    this.state.loading ?
                        <Box style={{ marginTop: 10 }}>
                            <AccordionSkeleton />
                            <AccordionSkeleton />
                            <AccordionSkeleton />
                            <AccordionSkeleton />
                            <AccordionSkeleton />
                            <AccordionSkeleton />
                        </Box>
                        :
                        this.state.configurations.map((configuration, index) => (
                            Array.isArray(configuration.widgets) &&
                            <Accordion style={{ marginBottom: 10, borderRadius: 5 }} elevation={0} variant='outlined' expanded={this.state.index == index} onChange={() => { this.setState({ index: this.state.index == index ? -1 : index }) }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel4bh-content"
                                    id="panel4bh-header"
                                >
                                    {
                                        configuration.module == "smartobject" ?
                                            <Box>
                                                <Typography variant='subtitle1'  >
                                                    {configuration.smartobject.reference}
                                                </Typography>
                                                <Typography variant='body2' color="text.secondary"  >
                                                    {configuration.name}
                                                </Typography>
                                            </Box>

                                            :
                                            <Typography variant='h6' color="text.secondary"  >
                                                {configuration.name}
                                            </Typography>
                                    }
                                </AccordionSummary>
                                <Divider style={{ marginBottom: 15 }} />
                                <AccordionDetails>
                                    <Grid container spacing={2} >
                                        {
                                            configuration.widgets.map((widget, pIndex) => {
                                                return (
                                                    <WidgetNewItem
                                                        key={pIndex}
                                                        open={
                                                            this.state.open &&
                                                            this.state.widget.id == widget.id &&
                                                            (
                                                                this.state.configuration.module == "smartobject" &&
                                                                    configuration.module == "smartobject" ? this.state.configuration.smartobject.id == configuration.smartobject.id ? true : false : true)
                                                        }
                                                        onSelect={() => { this.selectWidget(configuration, widget) }}
                                                        onClose={() => { this.setState({ open: false }) }}
                                                        onSubmit={(callback) => { this.submit(callback) }}
                                                        setState={this.setState.bind(this)}
                                                        widget={widget}
                                                        settings={this.state.settings}
                                                        configuration={configuration}
                                                    />
                                                )
                                            })
                                        }
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        ))
                }
                <Alert onClose={() => { this.setState({ enabled: false }) }} open={this.state.enabled} severity={"error"}>
                    {this.state.message}
                </Alert>
            </div >
        )
    }
}

export default NewWidget