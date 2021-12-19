import Controller from "./Controller"
import Package from '../package.json'
import _ from 'lodash'
import Tracing from "../utils/Tracing"

class Widget extends Controller {

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
                return {
                    error: true,
                    message: "Widget not found",
                    package: Package.name
                }
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
                    if(content.type.reference == 'list') {
                        let depth = extract.value.split("[x]").length
                        if(depth == 2) {
                            let setData = extract.value.split("[x]")[0]
                            let subData = extract.value.split("[x]")[1]
                            if(subData.length > 0) {
                                subData = subData.substring(1)
                            }
                            let setValue = _.get(data.data, setData)
                            if(Array.isArray(setValue)) {
                                setValue.forEach(sValue => {
                                    addonsContents.push({
                                        id: content.id,
                                        widget: 1,
                                        type: content.type,
                                        native: content.native,
                                        content:  extracts.content.replace(extract.key, subData == "" ? sValue :  _.get(sValue,subData))
                                    })
                                })
                                extracts.content = ""
                            } else {
                                extracts.content = extracts.content.replace(extract.key,'NotArray')
                            }
                        } else if(depth > 2) {
                            extracts.content = extracts.content.replace(extract.key, 'MultipleArray')
                        } else if(depth == 1) {
                            extracts.content = extracts.content.replace(extract.key, "UnknownArray")
                        }
                    } else {
                        value = data.error ? data.package : _.get(data.data, extract.value)
                        if(typeof value == 'object') {
                            value = JSON.stringify(value)
                        } else if(typeof value == 'boolean') {
                            value = 'Boolean'
                        } else if(Array.isArray(value)) {
                            value = 'Array'
                        }
                        extracts.content = extracts.content.replace(extract.key, value)
                    }

                })
                if(content.type.reference == 'list' && extracts.content == "") {
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
            return {
                error: false,
                data: widget
            }
        } catch (error) {
            console.log(error)
            Tracing.error(Package.name,"Widget : " + error.toString() )
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
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
                    if (this.core.manager.smartobject.smartobjects.has(smartobjectRequest.data.id)) {
                        let resultAction = await this.core.manager.smartobject.smartobjects.get(smartobjectRequest.data.id).action(action.action, pArguments)
                        if (resultAction.error) {
                            return resultAction
                        }
                        data[action.reference] = resultAction.data
                    } else {
                        return {
                            error: true,
                            package: Package.name,
                            message: "Smartobject not found"
                        }
                    }
                } else if (action.type === "module") {
                    let resultAction = await this.core.manager.module.executeAction(action.object, action.action, pArguments)
                    if (resultAction.error) {
                        return resultAction
                    }
                    data[action.reference] = resultAction.data
                } else {
                    Tracing.error(Package.name, "Invalid type '" + action.type + "'")
                    return {
                        error: true,
                        message: "Invalid type '" + action.type + "'",
                        package: Package.name
                    }
                }
            }
            return {
                error: false,
                package: Package.name,
                message: '',
                data: data
            }
        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
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
            return {
                error: false,
                package: Package.name,
                message: '',
                data: newWidget
            }
        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
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
                            return {
                                error: false,
                                package: Package.name,
                                message: ''
                            }
                        } else {
                            Tracing.warning(Package.name, "Missing icon action when sources widget")
                            return {
                                error: true,
                                message: "Missing sources action",
                                package: Package.name
                            }
                        }
                    } else {
                        Tracing.warning(Package.name, "Missing icon action when contents widget")
                        return {
                            error: true,
                            message: "Missing contents action",
                            package: Package.name
                        }
                    }
                } else {
                    Tracing.warning(Package.name, "Missing icon action when insert widget")
                    return {
                        error: true,
                        message: "Missing icon action",
                        package: Package.name
                    }
                }
            } else {
                Tracing.warning(Package.name, "Missing reference action when insert widget")
                return {
                    error: true,
                    message: "Missing reference action",
                    package: Package.name
                }
            }

        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
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
                return {
                    error: false,
                    package: Package.name,
                    message: ''
                }
            } else {
                Tracing.warning(Package.name, "Missing smartobject settings name")
                return {
                    error: true,
                    message: "Missing smartobject settings name",
                    package: Package.name
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
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
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
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
                                return {
                                    error: true,
                                    message: "Widget not found",
                                    package: Package.name
                                }
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
                            return {
                                error: false,
                                message: "",
                                package: Package.name
                            }
                        } else {
                            Tracing.warning(Package.name, "Missing arguments")
                            return {
                                error: true,
                                message: "Missing arguments action",
                                package: Package.name
                            }
                        }
                    } else {
                        Tracing.warning(Package.name, "Missing action")
                        return {
                            error: true,
                            message: "Missing action action",
                            package: Package.name
                        }
                    }
                } else {
                    Tracing.warning(Package.name, "Missing source")
                    return {
                        error: true,
                        message: "Missing source action",
                        package: Package.name
                    }
                }
            } else {
                Tracing.warning(Package.name, "Missing reference")
                return {
                    error: true,
                    message: "Missing reference action",
                    package: Package.name
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
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
                        return {
                            error: true,
                            message: "Widget not found",
                            package: Package.name
                        }
                    }
                    let widgetSourceRequest = await this.sqlWidgetContent.insert({
                        type: idType,
                        content: content,
                        widget: idWidget,
                    })
                    if (widgetSourceRequest.error) {
                        return widgetSourceRequest
                    }
                    return {
                        error: false,
                        message: "",
                        package: Package.name
                    }
                } else {
                    Tracing.warning(Package.name, "Missing content")
                    return {
                        error: true,
                        message: "Missing content action",
                        package: Package.name
                    }
                }
            } else {
                Tracing.warning(Package.name, "Missing type")
                return {
                    error: true,
                    message: "Missing type action",
                    package: Package.name
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
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
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async deleteContent(idWidget, idContent) {
        try {
            let widgetContentRequest = await this.sqlWidgetContent.deleteAllByField({ widget: idWidget, id: idContent })
            if (widgetContentRequest.error) {
                return widgetContentRequest
            }
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async getConfiguration() {
        try {
            let contentTypes = await this.sqlWidgetContentType.getAll()
            if (contentTypes.error) {
                return contentTypes
            }
            return {
                error: false,
                package: Package.name,
                message: "",
                data: {
                    contents: {
                        types: contentTypes.data
                    }
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"Widget : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default Widget