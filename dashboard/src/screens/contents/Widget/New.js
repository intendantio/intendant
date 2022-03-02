import React from 'react'
import Alert from '../../../components/Alert'
import Action from '../../../components/Action'
import Request from '../../../utils/Request'

import AccordionSkeleton from '../../../components/AccordionSkeleton'

import { Grid, Card, AccordionDetails, CardContent, Box, Accordion, AccordionSummary, Typography, Button, Paper, Divider, CardHeader, CardActions } from '@mui/material'
import { ExpandLess, ExpandMore, SettingsSharp } from '@mui/icons-material'
import WidgetNewItem from '../../../components/WidgetNewItem'
import Loading from '../../../components/Loading'
import Desktop from '../../../components/Desktop'
import Utils from '../../../utils/Utils'



class NewWidget extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
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
        props.setTitle("New widget")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultModules = await new Request().get().fetch("/api/modules")
        let resultSmartobjects = await new Request().get().fetch("/api/smartobjects")
        if (resultSmartobjects.error) {
            this.props.setMessage(resultSmartobjects.package + " : " + resultSmartobjects.message)
            this.props.history.push('/widget')
        } else if (resultModules.error) {
            this.props.setMessage(resultModules.package + " : " + resultModules.message)
            this.props.history.push('/widget')
        } else {
            let configurations = []

            resultSmartobjects.data.forEach(smartobject => {
                if (Array.isArray(smartobject.widgets) && smartobject.widgets.length > 0) {
                    configurations.push(smartobject)
                }
            })

            resultModules.data.forEach(pModule => {
                console.log(pModule)
                if (Array.isArray(pModule.widgets) && pModule.widgets.length > 0) {
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
                this.props.setMessage("No widget available")
                this.props.history.push('/widget')
            } else {
                this.setState({ loading: false, configurations: configurations })
            }
        }
    }

    async submit(callback) {

        let settings = []
        let resetState = {}
        for (let indexSettings = 0; indexSettings < this.state.settings.length; indexSettings++) {
            let setting = this.state.settings[indexSettings]

            resetState["widget-" + setting.id] = null
            settings.push({
                reference: setting.id,
                value: this.state["widget-" + setting.id] ? this.state["widget-" + setting.id] : null,
                type: typeof this.state["widget-" + setting.id]
            })
        }
        let result = await new Request().post({
            reference: this.state.widget.id,
            type: this.state.configuration.configuration.module,
            object: this.state.configuration.configuration.module == "smartobject" ? this.state.configuration.id : Utils.getSum(this.state.configuration.name),
            settings: settings
        }).fetch("/api/widgets")

        if (result.error) {
            callback()
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState(resetState)
            document.getElementById('main').scroll({ top: 0, left: 0 })
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
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, marginBottom: 10, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Widget</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Show what you need</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    {
                        this.state.configurations.map((configuration, index) => (
                            <Accordion style={{ marginBottom: 10, borderRadius: 5 }} variant='outlined' expanded={this.state.index == index} onChange={() => { this.setState({ index: this.state.index == index ? -1 : index }) }}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    <Box>
                                        <Typography variant='subtitle1'  >
                                            {configuration.reference}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <Divider style={{ marginBottom: 15 }} />
                                <AccordionDetails>
                                    <Grid container spacing={1} >
                                        {
                                            configuration.widgets.map((widget, pIndex) => {
                                                return (
                                                    <WidgetNewItem
                                                        index={pIndex}
                                                        open={
                                                            this.state.open &&
                                                            this.state.widget.id == widget.id &&
                                                            this.state.configuration.id == configuration.id
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
                </Loading>
            </ >
        )
    }
}

export default NewWidget