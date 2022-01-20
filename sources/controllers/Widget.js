import Controller from "./Controller"
import Package from '../package.json'
import _ from 'lodash'
import Tracing from "../utils/Tracing"
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'

class Widget extends Controller {

    constructor(smartobjectManager, moduleManager, moduleController, smartobjectController) {
        super()
        this.moduleManager = moduleManager
        this.moduleController = moduleController
        this.smartobjectController = smartobjectController
        this.smartobjectManager = smartobjectManager
    }

    async getPackageName(type,object) {
        let packageName = "n/a"
        if(type == "smartobject") {
            let resultSmartobject = await this.smartobjectController.getOne(object)
            if(resultSmartobject.error) {
                return resultSmartobject
            }
            let smartobject = resultSmartobject.data
            if(smartobject.configuration != null) {
                packageName = smartobject.configuration.name
            } else {
                return new Result(Package.name, true, "Missing configuration with smartobject n°" + object) 
            }
        } else {
            packageName= object
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

            let packageNameResult = await this.getPackageName(widget.type,widget.object)
            if(packageNameResult.error) {
                return packageNameResult
            }
            let packageName = packageNameResult.data
            let widgetConfiguration = false 
            let resultWidget = this.getWidget(packageName,widget.reference)
            if(resultWidget.error) {
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
                    value.value = value.value.replace("{settings." + setting.reference + "}",settings[setting.reference])
                    return value
                })
            })
            for (let indexWidgetDataSource = 0; indexWidgetDataSource < widgetConfiguration.dataSources.length; indexWidgetDataSource++) {
                let dataSource = widgetConfiguration.dataSources[indexWidgetDataSource]
                let resultDataSource = await this.getDataSourceValue(packageName,dataSource,settings, widget.object)
                if(resultDataSource.error) {
                    return resultDataSource
                }
                widget.dataSources[dataSource] = resultDataSource.data.value
                widget.values = widget.values.map(value => {
                    value.value = value.value.replace("{" + dataSource + "}", resultDataSource.data.value)
                    return value
                })
            }

            if(widget.type == "smartobject") {
                let smartobjectResult = await this.smartobjectController.getOne(widget.object)
                if(smartobjectResult.error) {
                    return smartobjectResult
                }
                widget.values = widget.values.map(value => {
                    value.value = value.value.replace("{smartobject.reference}",smartobjectResult.data.reference)
                    return value
                })
            }


            widget.values = widget.values.map(value => {
                value.value = capitalizeFirstLetter(value.value) 
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

    async insert(reference, type, object,settings) {
        try {
            if (reference) {
                if (type) {
                    if(type == "smartobject" || type == "module") {
                        if (object) {
                            if (settings) {
                                let resultInsertWidget = await this.sqlWidget.insert({
                                    type: type,
                                    object: object,
                                    reference: reference
                                })
                                if(resultInsertWidget.error) {
                                    return resultInsertWidget
                                }
                                let idWidget = resultInsertWidget.data.insertId
                                for (let indexSettings = 0; indexSettings < settings.length; indexSettings++) {
                                    let setting = settings[indexSettings]
                                    let resultInsertWidgetArgument = await this.sqlWidgetArgument.insert({
                                        reference: setting.reference,
                                        value: setting.value,
                                        type:  setting.type,
                                        widget: idWidget
                                    })
                                    if(resultInsertWidgetArgument.error) {
                                        return resultInsertWidgetArgument
                                    }
                                }
                                let resultGetOne = await this.getOne(idWidget)
                                if(resultGetOne.error) {
                                    await this.delete(idWidget)
                                }
                                return resultGetOne
                            } else {
                                Tracing.warning(Package.name, "Missing settings")
                                return new Result(Package.name, true, "Missing settings")
                            }
                        } else {
                            Tracing.warning(Package.name, "Missing object")
                            return new Result(Package.name, true, "Missing object")
                        }
                    } else {
                        Tracing.warning(Package.name, "Invalid type")
                        return new Result(Package.name, true, "Invalid type")
                    }
                } else {
                    Tracing.warning(Package.name, "Missing type")
                    return new Result(Package.name, true, "Missing type")
                }
            } else {
                Tracing.warning(Package.name, "Missing reference")
                return new Result(Package.name, true, "Missing reference")
            }

        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert widget")
            return new Result(Package.name, true, "Error occurred when insert widget")
        }

    }


    async delete(idWidget) {
        try {
            Tracing.verbose(Package.name, "Delete widget " + idWidget)
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


    getConfiguration(pModule) {
        try {
            let configuration = require(pModule + "/package.json")
            return new Result(Package.name, false, "", configuration)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get configuration in module")
            return new Result(Package.name, true, "Error occurred when get configuration in module")
        }
    }

    async getDataSourceValue(pModule, idDataSource, settings = {}, id = -1) {
        try {
            let resultGetDataSource = this.getDataSource(pModule, idDataSource)
            if (resultGetDataSource.error) {
                return resultGetDataSource
            }
            let resultConfiguration = this.getConfiguration(pModule)
            if (resultConfiguration.error) {
                return resultConfiguration
            }
            let configuration = resultConfiguration.data
            let dataSource = resultGetDataSource.data
            let action = false
            configuration.actions.forEach(pAction => {
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
                    let resultAction = {
                        error: true,
                        message: "n/a"
                    }
                    if(configuration.module == "module") {
                        resultAction = await this.moduleController.executeAction(pModule, action.id, settings)
                    } else if(configuration.module == "smartobject") {
                        resultAction =  await this.smartobjectController.executeAction(id, action.id, 1, settings, true)
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
            Tracing.error(Package.name, "Error occurred when get data source value in widget")
            return new Result(Package.name, true, "Error occurred when get data source value in widget")
        }
    }

    getDataSource(pModule, idDataSource) {
        try {
            let resultConfiguration = this.getConfiguration(pModule)
            if (resultConfiguration.error) {
                return resultConfiguration
            }
            let configuration = resultConfiguration.data
            if (Array.isArray(configuration.dataSources)) {
                let dataSource = false
                configuration.dataSources.forEach(pDataSource => {
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

    getWidget(pModule, idWidget) {
        try {
            let resultConfiguration = this.getConfiguration(pModule)
            if (resultConfiguration.error) {
                return resultConfiguration
            }
            let configuration = resultConfiguration.data
            if (Array.isArray(configuration.widgets)) {
                let widget = false
                configuration.widgets.forEach(pWidget => {
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
            } else {
                Tracing.error(Package.name, "Widgets was not implemented")
                return new Result(Package.name, true, "Widgets was not implemented")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get widget in module")
            return new Result(Package.name, true, "Error occurred when get widget in module")
        }
    }


}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default Widget