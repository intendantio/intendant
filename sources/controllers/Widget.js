import Controller from "./Controller"
import Package from '../package.json'
import _ from 'lodash'
import Tracing from "../utils/Tracing"
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'

class Widget extends Controller {

    async getOne(idSmartobject, idWidget) {
        try {
            let resultWidgets = this.getAllWidgets(idSmartobject)
            if (resultWidgets.error) {
                return resultWidgets
            }
            let widgetConfiguration = undefined
            resultWidgets.data.forEach(widget => {
                if (widget.id == idWidget) {
                    widgetConfiguration = widget
                }
            })
            if (widgetConfiguration == undefined) {
                return new Result(Package.name, true, "Widget not available")
            }
            let widget = {}
            widget.values = JSON.parse(JSON.stringify(widgetConfiguration.contents))
            widget.title = JSON.parse(JSON.stringify(widgetConfiguration.title))
            widget.dataSources = {}
            for (let indexWidgetDataSource = 0; indexWidgetDataSource < widgetConfiguration.dataSources.length; indexWidgetDataSource++) {
                let dataSource = widgetConfiguration.dataSources[indexWidgetDataSource]
                let resultDataSource = await this.getDataSourceValue(idSmartobject, dataSource)
                if (resultDataSource.error) {
                    return resultDataSource
                }
                widget.dataSources[dataSource] = resultDataSource.data.value
                widget.values = widget.values.map(value => {
                    value.value = value.value.replace("{" + dataSource + "}", resultDataSource.data.value)
                    if(value.styles) {
                        for (let keyStyle in value.styles) {
                            let style = value.styles[keyStyle]
                            value.styles[keyStyle] = style.replace("{" + dataSource + "}", resultDataSource.data.value)
                        }
                    }
                    return value
                })
                widget.title.value = widget.title.value.replace("{" + dataSource + "}", resultDataSource.data.value)
                if(widget.title.styles) {
                    for (let keyStyle in widget.title.styles) {
                        let style = widget.title.styles[keyStyle]
                        widget.title.styles[keyStyle] = style.replace("{" + dataSource + "}", resultDataSource.data.value)
                    }
                }
            }

            let smartobjectResult = await this.smartobjectController.getOne(idSmartobject)
            if (smartobjectResult.error) {
                return smartobjectResult
            }
            widget.values = widget.values.map(value => {
                value.value = value.value.replace("{smartobject.reference}", smartobjectResult.data.reference)
                return value
            })
            if(widget.title.styles) {
                for (let keyStyle in widget.title.styles) {
                    let style = widget.title.styles[keyStyle]
                    widget.title.styles[keyStyle] = style.replace("{smartobject.reference}", smartobjectResult.data.reference)
                }
            }
            widget.title.value = widget.title.value.replace("{smartobject.reference}", smartobjectResult.data.reference)

            return new Result(Package.name, false, "", widget)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one widget")
            return new Result(Package.name, true, "Error occurred when get one widget")
        }
    }

    getAllActions(idSmartobject) {
        try {
            if (this.smartobjectManager.instances.has(parseInt(idSmartobject))) {
                let instance = this.smartobjectManager.instances.get(parseInt(idSmartobject))
                let actions = instance.getActions()
                if (actions == undefined) { actions = [] }
                return new Result(Package.name, false, "", actions)
            } else {
                Tracing.error(Package.name, "Smartobject not found (all)")
                return new Result(Package.name, true, "Smartobject not found (all)")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all actions")
            return new Result(Package.name, true, "Error occurred when get all actions")
        }
    }

    getAllDataSources(idSmartobject) {
        try {
            if (this.smartobjectManager.instances.has(parseInt(idSmartobject))) {
                let instance = this.smartobjectManager.instances.get(parseInt(idSmartobject))
                let dataSources = instance.getDataSources()
                if (dataSources == undefined) { dataSources = [] }
                return new Result(Package.name, false, "", dataSources)
            }  else {
                Tracing.error(Package.name, "Smartobject not found (ds)")
                return new Result(Package.name, true, "Smartobject not found (ds)")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get data sources")
            return new Result(Package.name, true, "Error occurred when get data sources")
        }
    }

    getAllWidgets(idSmartobject) {
        try {
            if (this.smartobjectManager.instances.has(parseInt(idSmartobject))) {
                let instance = this.smartobjectManager.instances.get(parseInt(idSmartobject))
                let widgets = instance.getWidgets()
                if (widgets == undefined) { widgets = [] }
                return new Result(Package.name, false, "", widgets)
            } else {
                Tracing.error(Package.name, "Smartobject not found (gw)")
                return new Result(Package.name, true, "Smartobject not found (gw)")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all widgets")
            return new Result(Package.name, true, "Error occurred when get all widgets")
        }
    }

    getConfiguration(pModule) {
        try {
            let configuration = require("../essentials/" + pModule + "/package.json")
            return new Result(Package.name, false, "", configuration)
        } catch (error) {
            console.log(error)
            Tracing.error(Package.name, "Error occured when get configuration")
            return new Result(Package.name, true, "Error occured when get configuration")
        }
    }

    async getDataSourceValue(idSmartobject, idDataSource) {
        try {
            let resultGetDataSource = this.getDataSource(idSmartobject, idDataSource)
            if (resultGetDataSource.error) {
                return resultGetDataSource
            }
            let resultAllActions = this.getAllActions(idSmartobject)
            if (resultAllActions.error) {
                return resultAllActions
            }
            let dataSource = resultGetDataSource.data
            let action = false
            resultAllActions.data.forEach(pAction => {
                if (pAction.id == dataSource.action) {
                    action = pAction
                }
            })
            if (action) {
                let missingSettings = []
                action.settings.forEach(setting => {
                    if (settings[setting.id] == undefined) {
                        missingSettings.push(setting)
                    }
                })
                if (missingSettings.length == 0) {
                    let resultAction = await this.smartobjectController.executeAction(idSmartobject, action.id)
                    if (resultAction.error) {
                        return resultAction
                    } else {
                        return new Result(Package.name, false, "", {
                            value: _.get(resultAction.data, dataSource.path)
                        })
                    }
                } else {
                    return new Result(Package.name, true, "Missing settings", missingSettings)
                }
            } else {
                Tracing.warning(Package.name, "Malformed datasource (missing action)")
                return new Result(Package.name, true, "Malformed datasource (missing action)")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get data source value")
            return new Result(Package.name, true, "Error occurred when get data source value")
        }
    }

    getDataSource(idSmartobject, idDataSource) {
        try {
            let resultAllDataSources = this.getAllDataSources(idSmartobject)
            if (resultAllDataSources.error) {
                return resultAllDataSources
            }
            if (Array.isArray(resultAllDataSources.data)) {
                let dataSource = false
                resultAllDataSources.data.forEach(pDataSource => {
                    if (pDataSource.id == idDataSource) {
                        dataSource = pDataSource
                    }
                })
                if (dataSource) {
                    return new Result(Package.name, false, "", dataSource)
                } else {
                    Tracing.warning(Package.name, "Datasource not found " + idDataSource)
                    return new Result(Package.name, true, "Datasource not found" + idDataSource)
                }
            } else {
                Tracing.error(Package.name, "Datasources was not implemented")
                return new Result(Package.name, true, "Datasources was not implemented")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get data source value in module")
            return new Result(Package.name, true, "Error occurred when get data source value in module")
        }
    }

}

export default Widget