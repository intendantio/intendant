import Controller from "./Controller"
import Package from '../package.json'
import _ from 'lodash'
import Tracing from "../utils/Tracing"
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'

class Widget extends Controller {

    constructor(smartobjectManager, moduleManager) {
        super()
        this.moduleManager = moduleManager
        this.smartobjectManager = smartobjectManager
    }

    extract(str) {
        let newTmp = ""
        let arrTmp = []
        let tmp = ""
        let key = 0
        let state = false
        for (let index = 0; index < str.length; index++) {
            const it = str[index]
            if (it === "{" && state === false) {
                state = true
            } else if (it !== "}" && state) {
                tmp = tmp + it
            } else if (it === "}" && state) {
                state = false
                arrTmp.push({ key: "{key-" + key + "}", value: tmp })
                newTmp = newTmp + "{key-" + key + "}"
                key++
                tmp = ""
            } else {
                newTmp = newTmp + it
            }
        }
        return {
            content: newTmp,
            extracts: arrTmp
        }
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
            let requestWidgetContent = await this.sqlWidgetContent.getAllByField({
                widget: widget.id
            })
            if (requestWidgetContent.error) {
                return requestWidgetContent
            }
            let _contents = []
            let contents = requestWidgetContent.data
            for (let indexSource = 0; indexSource < contents.length; indexSource++) {
                let content = contents[indexSource]
                let requestWidgetContentType = await this.sqlWidgetContentType.getOne(content.type)
                if (requestWidgetContentType.error) {
                    return requestWidgetContentType
                }
                content.type = requestWidgetContentType.data
                _contents.push(content)
            }
            contents = _contents
            let requestWidgetSource = await this.sqlWidgetSource.getAllByField({
                widget: widget.id
            })
            if (requestWidgetSource.error) {
                return requestWidgetSource
            }
            let sources = []
            for (let indexSource = 0; indexSource < requestWidgetSource.data.length; indexSource++) {
                let source = requestWidgetSource.data[indexSource]
                let requestWidgetSourceArgument = await this.sqlWidgetSourceArgument.getAllByField({
                    widget_source: source.id
                })
                if (requestWidgetSourceArgument.error) {
                    return requestWidgetSourceArgument
                }
                source.arguments = requestWidgetSourceArgument.data
                sources.push(source)
            }
            let data = await this.getSource(sources)
            widget.sources = sources
            let addonsContents = []
            widget.contents = contents.map(content => {
                content.native = content.content
                let extracts = this.extract(content.content)
                extracts.extracts.forEach(extract => {
                    let value = ""
                    if (content.type.reference == 'list') {
                        let depth = extract.value.split("[x]").length
                        if (depth == 2) {
                            let setData = extract.value.split("[x]")[0]
                            let subData = extract.value.split("[x]")[1]
                            if (subData.length > 0) {
                                subData = subData.substring(1)
                            }
                            let setValue = _.get(data.data, setData)
                            if (Array.isArray(setValue)) {
                                setValue.forEach(sValue => {
                                    addonsContents.push({
                                        id: content.id,
                                        widget: 1,
                                        type: content.type,
                                        native: content.native,
                                        content: extracts.content.replace(extract.key, subData == "" ? sValue : _.get(sValue, subData))
                                    })
                                })
                                extracts.content = ""
                            } else {
                                extracts.content = extracts.content.replace(extract.key, 'NotArray')
                            }
                        } else if (depth > 2) {
                            extracts.content = extracts.content.replace(extract.key, 'MultipleArray')
                        } else if (depth == 1) {
                            extracts.content = extracts.content.replace(extract.key, "UnknownArray")
                        }
                    } else {
                        value = data.error ? data.package : _.get(data.data, extract.value)
                        if (typeof value == 'object') {
                            value = JSON.stringify(value)
                        } else if (typeof value == 'boolean') {
                            value = 'Boolean'
                        } else if (Array.isArray(value)) {
                            value = 'Array'
                        }
                        extracts.content = extracts.content.replace(extract.key, value)
                    }
                })
                if (content.type.reference == 'list' && extracts.content == "") {
                    return undefined
                }
                content.content = extracts.content
                return content
            })
            widget.contents = widget.contents.filter(content => {
                return content != undefined
            })
            addonsContents.forEach(addonsContent => {
                widget.contents.push(addonsContent)
            })
            return new Result(Package.name, false, "", widget)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one widget")
            return new Result(Package.name, true, "Error occurred when get one widget")
        }

    }

    async getSource(actions) {
        try {
            let data = {}
            for (let index = 0; index < actions.length; index++) {
                let action = actions[index]
                let pArguments = {}
                action.arguments.forEach(argument => {
                    pArguments[argument.reference] = argument.value
                })
                if (action.type === "smartobject") {
                    let smartobjectRequest = await this.sqlSmartobject.getOne(action.object)
                    if (smartobjectRequest.error) {
                        return smartobjectRequest
                    }
                    if (this.smartobjectManager.instances.has(smartobjectRequest.data.id)) {
                        let resultAction = await this.smartobjectManager.instances.get(smartobjectRequest.data.id).action(action.action, pArguments)
                        if (resultAction.error) {
                            return resultAction
                        }
                        data[action.reference] = resultAction.data
                    } else {
                        return new Result(Package.name, true, "Smartobject not found")
                    }
                } else if (action.type === "module") {
                    let resultAction = await this.moduleManager.executeAction(action.object, action.action, pArguments)
                    if (resultAction.error) {
                        return resultAction
                    }
                    data[action.reference] = resultAction.data
                } else {
                    Tracing.error(Package.name, "Invalid type")
                    return new Result(Package.name, true, "Invalid type")
                }
            }
            return new Result(Package.name, false, "", data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get source widget")
            return new Result(Package.name, true, "Error occurred when get source widget")
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

    async insert(reference, icon, contents, sources) {
        try {
            if (reference) {
                if (icon) {
                    if (contents) {
                        if (sources) {
                            let resultInsertWidgetRequest = await this.sqlWidget.insert({
                                reference: reference,
                                icon: icon
                            })
                            if (resultInsertWidgetRequest.error) {
                                return resultInsertWidgetRequest
                            }
                            let widgetId = resultInsertWidgetRequest.data.insertId
                            for (let indexContent = 0; indexContent < contents.length; indexContent++) {
                                let content = contents[indexContent]
                                let resultInsertWidgetContentRequest = await this.sqlWidgetContent.insert({
                                    type: content.type.id,
                                    content: content.content,
                                    widget: widgetId
                                })
                                if (resultInsertWidgetContentRequest.error) {
                                    return resultInsertWidgetContentRequest
                                }
                            }
                            for (let indexSource = 0; indexSource < sources.length; indexSource++) {
                                let source = sources[indexSource]
                                let resultInsertWidgetSourceRequest = await this.sqlWidgetSource.insert({
                                    reference: source.reference,
                                    widget: widgetId,
                                    object: source.source.id,
                                    action: source.action.id,
                                    type: source.source.type,
                                })
                                if (resultInsertWidgetSourceRequest.error) {
                                    return resultInsertWidgetSourceRequest
                                }
                                let sourceId = resultInsertWidgetSourceRequest.data.insertId
                                for (let indexSourceArgument = 0; indexSourceArgument < source.arguments.length; indexSourceArgument++) {
                                    let argument = source.arguments[indexSourceArgument]
                                    let resultInsertWidgetSourceArgumentRequest = await this.sqlWidgetSourceArgument.insert({
                                        reference: argument.reference,
                                        value: argument.value,
                                        widget_source: sourceId
                                    })
                                    if (resultInsertWidgetSourceArgumentRequest.error) {
                                        return resultInsertWidgetSourceArgumentRequest
                                    }
                                }
                            }
                            return new Result(Package.name, false, "")
                        } else {
                            Tracing.warning(Package.name, "Missing source")
                            return new Result(Package.name, true, "Missing source")
                        }
                    } else {
                        Tracing.warning(Package.name, "Missing content")
                        return new Result(Package.name, true, "Missing content")
                    }
                } else {
                    Tracing.warning(Package.name, "Missing icon")
                    return new Result(Package.name, true, "Missing icon")
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

    async update(idWidget, content) {
        try {
            if (content) {
                let requestGetOne = await this.sqlWidget.getOne(idWidget)
                if (requestGetOne.error) {
                    return requestGetOne
                }
                let requestUpdate = await this.sqlWidgetContent.updateAll({ content: content.native }, { id: content.id })
                if (requestUpdate.error) {
                    return requestUpdate
                }
                return new Result(Package.name, false, "")
            } else {
                Tracing.warning(Package.name, "Missing content")
                return new Result(Package.name, false, "Missing content")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update widget")
            return new Result(Package.name, true, "Error occurred when update widget")
        }

    }

    async delete(idWidget) {
        try {
            Tracing.verbose(Package.name, "Delete widget " + idWidget)
            let widgetSourceRequest = await this.sqlWidgetSource.getAllByField({ widget: idWidget })
            if (widgetSourceRequest.error) {
                return widgetSourceRequest
            }
            let widgetSources = widgetSourceRequest.data
            for (let index = 0; index < widgetSources.length; index++) {
                let widgetSource = widgetSources[index]
                let widgetSourceArgumentRequest = await this.sqlWidgetSourceArgument.deleteAllByField({ widget_source: widgetSource.id })
                if (widgetSourceArgumentRequest.error) {
                    return widgetSourceArgumentRequest
                }
            }
            let widgetSourceDeleteRequest = await this.sqlWidgetSource.deleteAllByField({ widget: idWidget })
            if (widgetSourceDeleteRequest.error) {
                return widgetSourceDeleteRequest
            }
            let widgetContentDeleteRequest = await this.sqlWidgetContent.deleteAllByField({ widget: idWidget })
            if (widgetContentDeleteRequest.error) {
                return widgetContentDeleteRequest
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

    async insertSource(idWidget, reference, source, action, pArguments) {
        try {
            if (reference) {
                if (source) {
                    if (action) {
                        if (pArguments) {
                            let widgetRequest = await this.sqlWidget.getOne(idWidget)
                            if (widgetRequest.error) {
                                return widgetRequest
                            }
                            if (widgetRequest.data == false) {
                                return new Result(Package.name, true, "Widget not found")
                            }
                            let widgetSourceRequest = await this.sqlWidgetSource.insert({
                                reference: reference,
                                widget: idWidget,
                                object: source.id,
                                action: action.id,
                                type: source.type,
                            })
                            if (widgetSourceRequest.error) {
                                return widgetSourceRequest
                            }
                            let sourceId = widgetSourceRequest.data.insertId
                            for (let indexSourceArgument = 0; indexSourceArgument < pArguments.length; indexSourceArgument++) {
                                let argument = pArguments[indexSourceArgument]
                                let resultInsertWidgetSourceArgumentRequest = await this.sqlWidgetSourceArgument.insert({
                                    reference: argument.reference,
                                    value: argument.value,
                                    widget_source: sourceId
                                })
                                if (resultInsertWidgetSourceArgumentRequest.error) {
                                    return resultInsertWidgetSourceArgumentRequest
                                }
                            }
                            return new Result(Package.name, false, "")
                        } else {
                            Tracing.warning(Package.name, "Missing arguments")
                            return new Result(Package.name, true, "Missing arguments")
                        }
                    } else {
                        Tracing.warning(Package.name, "Missing action")
                        return new Result(Package.name, true, "Missing action")
                    }
                } else {
                    Tracing.warning(Package.name, "Missing source")
                    return new Result(Package.name, true, "Missing source")
                }
            } else {
                Tracing.warning(Package.name, "Missing reference")
                return new Result(Package.name, true, "Missing reference")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert source widget")
            return new Result(Package.name, true, "Error occurred when insert source widget")
        }

    }

    async insertContent(idWidget, idType, content) {
        try {
            if (idType) {
                if (content) {
                    let widgetRequest = await this.sqlWidget.getOne(idWidget)
                    if (widgetRequest.error) {
                        return widgetRequest
                    }
                    if (widgetRequest.data == false) {
                        return new Result(Package.name, true, "Widget not found")
                    }
                    let widgetSourceRequest = await this.sqlWidgetContent.insert({
                        type: idType,
                        content: content,
                        widget: idWidget,
                    })
                    if (widgetSourceRequest.error) {
                        return widgetSourceRequest
                    }
                    return new Result(Package.name, false, "")
                } else {
                    Tracing.warning(Package.name, "Missing content")
                    return new Result(Package.name, true, "Missing content")
                }
            } else {
                Tracing.warning(Package.name, "Missing type")
                return new Result(Package.name, true, "Missing type")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert content widget")
            return new Result(Package.name, true, "Error occurred when insert content widget")
        }

    }

    async deleteSource(idWidget, idSource) {
        try {
            let widgetSourceArgumentRequest = await this.sqlWidgetSourceArgument.deleteAllByField({ widget_source: idSource })
            if (widgetSourceArgumentRequest.error) {
                return widgetSourceArgumentRequest
            }
            let widgetSourceRequest = await this.sqlWidgetSource.deleteAllByField({ widget: idWidget, id: idSource })
            if (widgetSourceRequest.error) {
                return widgetSourceRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete source widget")
            return new Result(Package.name, true, "Error occurred when delete source widget")
        }

    }

    async deleteContent(idWidget, idContent) {
        try {
            let widgetContentRequest = await this.sqlWidgetContent.deleteAllByField({ widget: idWidget, id: idContent })
            if (widgetContentRequest.error) {
                return widgetContentRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete content widget")
            return new Result(Package.name, true, "Error occurred when delete content widget")
        }

    }

    async getConfiguration() {
        try {
            let contentTypes = await this.sqlWidgetContentType.getAll()
            if (contentTypes.error) {
                return contentTypes
            }
            return new Result(Package.name, false, "", {
                contents: {
                    types: contentTypes.data
                }
            })
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get configuration widget")
            return new Result(Package.name, true, "Error occurred when get configuration widget")
        }
    }

}

export default Widget