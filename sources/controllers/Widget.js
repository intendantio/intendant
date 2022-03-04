import Controller from "./Controller"
import Package from '../package.json'
import _ from 'lodash'
import Tracing from "../utils/Tracing"
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'

class Widget extends Controller {

    async getPackageName(type, object) {
        let packageName = ""
        if (type == "smartobject") {
            let resultSmartobject = await this.smartobjectController.getOne(object)
            if (resultSmartobject.error) {
                return resultSmartobject
            }
            let smartobject = resultSmartobject.data
            if (smartobject.configuration != null) {
                packageName = smartobject.configuration.name
            } else {
                return new Result(Package.name, true, "Missing configuration with smartobject n°" + object)
            }
        } else if (type == "module") {
            let resultModule = await this.moduleController.getBySum(object)
            if(resultModule.error) {
                return resultModule
            }
            if(resultModule.data == false) {
                return new Result(Package.name, true, "Missing configuration with module n°" + object)
            }
            packageName = resultModule.data
        } else {
            return new Result(Package.name, true, "Invalid type")
        }
        return new Result(Package.name, false, "", packageName)
    }

    async getOne(idWidget) {
        try {
            let requestWidget = await this.sqlWidget.getOne(idWidget)
            if (requestWidget.error) {
                return requestWidget
            }
            if (requestWidget.data == false) {
                return new Result(Package.name, true, "Widget not found")
            }
            let widget = requestWidget.data
            let requestWidgetSettings = await this.sqlWidgetArgument.getAllByField({
                widget: widget.id
            })
            if (requestWidgetSettings.error) {
                return requestWidgetSettings
            }
            let packageNameResult = await this.getPackageName(widget.type, widget.object)
            if (packageNameResult.error) {
                return packageNameResult
            }
            let packageName = packageNameResult.data
            let widgetConfiguration = false
            let resultWidget = this.getWidget(packageName, widget.reference, widget.object, widget.type)
            if (resultWidget.error) {
                return resultWidget
            }
            widgetConfiguration = resultWidget.data
            let settings = {}
            widget.contents = JSON.parse(JSON.stringify(widgetConfiguration.contents))
            widget.values = JSON.parse(JSON.stringify(widgetConfiguration.contents))
            widget.dataSources = {}
            requestWidgetSettings.data.forEach(setting => {
                switch (setting.type) {
                    case "string":
                        settings[setting.reference] = setting.value
                        break
                    case "integer":
                        settings[setting.reference] = parseInt(setting.value)
                        break
                    case "boolean":
                        settings[setting.reference] = setting.value == "true" ? true : false
                        break
                }
                widget.values = widget.values.map(value => {
                    value.value = value.value.replace("{settings." + setting.reference + "}", settings[setting.reference])
                    return value
                })
            })

            for (let indexWidgetDataSource = 0; indexWidgetDataSource < widgetConfiguration.dataSources.length; indexWidgetDataSource++) {
                let dataSource = widgetConfiguration.dataSources[indexWidgetDataSource]
                let resultDataSource = await this.getDataSourceValue(packageName, dataSource, widget.type, settings, widget.object)
                if (resultDataSource.error) {
                    return resultDataSource
                }
                widget.dataSources[dataSource] = resultDataSource.data.value
                widget.values = widget.values.map(value => {
                    value.value = value.value.replace("{" + dataSource + "}", resultDataSource.data.value)
                    return value
                })
            }

            if (widget.type == "smartobject") {
                let smartobjectResult = await this.smartobjectController.getOne(widget.object)
                if (smartobjectResult.error) {
                    return smartobjectResult
                }
                widget.values = widget.values.map(value => {
                    value.value = value.value.replace("{smartobject.reference}", smartobjectResult.data.reference)
                    return value
                })
            }

            widget.values = widget.values.map(value => {
                value.value = value.value
                return value
            })
            widget.settings = requestWidgetSettings.data
            return new Result(Package.name, false, "", widget)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one widget")
            return new Result(Package.name, true, "Error occurred when get one widget")
        }
    }

    async getAll() {
        try {
            let requestGetAll = await this.sqlWidget.getAll()
            if (requestGetAll.error) {
                return requestGetAll
            }
            let widgets = requestGetAll.data
            let newWidget = []
            for (let indexWidget = 0; indexWidget < widgets.length; indexWidget++) {
                let widget = widgets[indexWidget]
                let resultWidget = await this.getOne(widget.id)
                if (resultWidget.error) {
                    return resultWidget
                }
                newWidget.push(resultWidget.data)
            }
            return new Result(Package.name, false, "", newWidget)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all widget")
            return new Result(Package.name, true, "Error occurred when get all widget")
        }
    }

    async insert(reference,object,type,settings) {
        try {
            let resultInsertWidget = await this.sqlWidget.insert({
                type: type,
                object: object,
                reference: reference
            })
            if (resultInsertWidget.error) {
                return resultInsertWidget
            }
            let idWidget = resultInsertWidget.data.insertId
            for (let indexSettings = 0; indexSettings < settings.length; indexSettings++) {
                let setting = settings[indexSettings]
                let resultInsertWidgetArgument = await this.sqlWidgetArgument.insert({
                    reference: setting.reference,
                    value: setting.value,
                    type: setting.type,
                    widget: idWidget
                })
                if (resultInsertWidgetArgument.error) {
                    return resultInsertWidgetArgument
                }
            }
            let resultGetOne = await this.getOne(idWidget)
            if (resultGetOne.error) {
                await this.delete(idWidget)
            }
            return resultGetOne

        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert widget")
            return new Result(Package.name, true, "Error occurred when insert widget")
        }
    }

    async delete(idWidget) {
        try {
            let widgetArgumentRequest = await this.sqlWidgetArgument.deleteAllByField({ widget: idWidget })
            if (widgetArgumentRequest.error) {
                return widgetArgumentRequest
            }
            let widgetDeleteRequest = await this.sqlWidget.deleteOne(idWidget)
            if (widgetDeleteRequest.error) {
                return widgetDeleteRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete widget")
            return new Result(Package.name, true, "Error occurred when delete widget")
        }
    }

    getAllActions(pModule, idSource, type) {
        try {
            let resultInstance = this.getInstance(pModule, idSource, type)
            if (resultInstance.error) {
                return resultInstance
            } else {
                let actions = resultInstance.data.getActions()
                if(actions == undefined) { actions = [] }
                return new Result(Package.name, false, "",actions)
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all actions")
            return new Result(Package.name, true, "Error occurred when get all actions")
        }
    }

    getAllDataSources(pModule, idSource, type) {
        try {
            let resultInstance = this.getInstance(pModule, idSource, type)
            if (resultInstance.error) {
                return resultInstance
            } else {
                let dataSources = resultInstance.data.getDataSources()
                if(dataSources == undefined) { dataSources = [] }
                return new Result(Package.name, false, "",dataSources)
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get data sources")
            return new Result(Package.name, true, "Error occurred when get data sources")
        }
    }

    getAllWidgets(pModule, idSource, type) {
        try {
            let resultInstance = this.getInstance(pModule, idSource, type)
            if (resultInstance.error) {
                return resultInstance
            } else {
                let widgets = resultInstance.data.getWidgets()
                if(widgets == undefined) { widgets = [] }
                return new Result(Package.name, false, "",widgets)
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all widgets")
            return new Result(Package.name, true, "Error occurred when get all widgets")
        }
    }

    getConfiguration(pModule) {
        try {
            let configuration = require(pModule + "/package.json")
            return new Result(Package.name, false, "", configuration)
        } catch (error) {
            Tracing.error(Package.name, "Error occured when get configuration")
            return new Result(Package.name, true, "Error occured when get configuration")
        }
    }

    getInstance(pModule, idSource, type) {
        try {
            if (type == "module") {
                let configuration = this.getConfiguration(pModule)
                if (configuration.error) {
                    return configuration
                }
                return new Result(Package.name, false, "", {
                    getActions: () => { return configuration.data.actions },
                    getDataSources: () => { return configuration.data.dataSources },
                    getWidgets: () => { return configuration.data.widgets }
                })
            } else if (type == "smartobject") {
                if (this.smartobjectManager.instances.has(parseInt(idSource))) {
                    let instance = this.smartobjectManager.instances.get(parseInt(idSource))
                    if (instance.configurations.name == pModule) {
                        return new Result(Package.name, false, "", instance)
                    } else {
                        Tracing.error(Package.name, "Invalid module type")
                        return new Result(Package.name, true, "Invalid module type")
                    }
                } else {
                    Tracing.error(Package.name, "Smartobject not found (gi)")
                    return new Result(Package.name, true, "Smartobject not found (gi)")
                }
            } else {
                Tracing.error(Package.name, "Invalid type")
                return new Result(Package.name, true, "Invalid type")
            }
        } catch (error) {
            Tracing.error(Package.name, "Error occured when get instance")
            return new Result(Package.name, true, "Error occured when get instance")
        }
    }

    async getDataSourceValue(pModule, idDataSource, type, settings = {}, idSource = -1) {
        try {
            let resultGetDataSource = this.getDataSource(pModule, idDataSource, idSource, type)
            if (resultGetDataSource.error) {
                return resultGetDataSource
            }
            let resultAllActions = this.getAllActions(pModule, idSource, type)
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
                    let resultAction = { error: true, message: "" }
                    if (type == "module") {
                        resultAction = await this.moduleController.executeAction(pModule, action.id, settings)
                    } else if (type == "smartobject") {
                        resultAction = await this.smartobjectController.executeAction(idSource, action.id, 1, settings, true)
                    }
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

    getDataSource(pModule, idDataSource, idSource, type) {
        try {
            let resultAllDataSources = this.getAllDataSources(pModule, idSource, type)
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
                    Tracing.warning(Package.name, "Datasource not found")
                    return new Result(Package.name, true, "Datasource not found")
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

    getWidget(pModule, idWidget, idSource, type) {
        try {
            let resultAllWidgets = this.getAllWidgets(pModule, idSource, type)
            if (resultAllWidgets.error) {
                return resultAllWidgets
            }
            let widget = false
            resultAllWidgets.data.forEach(pWidget => {
                if (pWidget.id == idWidget) {
                    widget = pWidget
                }
            })
            if (widget) {
                return new Result(Package.name, false, "", widget)
            } else {
                Tracing.warning(Package.name, "Widget not found")
                return new Result(Package.name, true, "Widget not found")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get widget in module")
            return new Result(Package.name, true, "Error occurred when get widget in module")
        }
    }

}

export default Widget