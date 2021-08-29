import Controller from "./Controller"
import Package from '../package.json'
import _ from 'lodash'
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
        let requestWidget = await this.sqlWidget.getOne(idWidget)
        if (requestWidget.error) {
            return requestWidget
        }
        if (requestWidget.data == false) {
            return {
                error: true,
                message: "Widget not found",
                code: Package.name + ">Widget>NotFound"
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
        widget.contents = contents.map(content => {
            content.native = content.content
            let extracts = this.extract(content.content)
            extracts.extracts.forEach(extract => {
                let value = data.error ? data.code : _.get(data.data, extract.value)
                if (Array.isArray(value) && content.type.reference == 'list') {
                    let _content = ""
                    value.forEach((_value, index) => {
                        try {
                            _content = _content + (index == 0 ? "" : "\n") + "- " + _value.toString()
                        } catch (error) { }
                    })
                    value = _content
                } else if (Array.isArray(value)) {
                    let _content = ""
                    value.forEach((_value, index) => {
                        try {
                            _content = _content + (index == 0 ? "" : " ") + _value.toString()
                        } catch (error) { }
                    })
                    value = _content
                }

                extracts.content = extracts.content.replace(extract.key, value)
            })
            content.content = extracts.content
            return content
        })
        return {
            error: false,
            data: widget
        }
    }

    async getSource(actions) {
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
                if(this.core.manager.smartobject.smartobjects.has(smartobjectRequest.data.reference)) {
                    let resultAction = await this.core.manager.smartobject.smartobjects.get(smartobjectRequest.data.reference).action(action.action, pArguments)
                    if (resultAction.error) {
                        return resultAction
                    }
                    data[action.reference] = resultAction.data
                } else {
                    return {
                        error: true,
                        code: Package.name + '>SmartobjectNotFound>' + smartobjectRequest.data.reference,
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
                this.core.logger.error(Package.name, "Invalid type '" + action.type + "'")
                return {
                    error: true,
                    message: "Invalid type '" + action.type + "'",
                    code: Package.name + '>Type>Invalid'
                }
            }
        }
        return {
            error: false,
            code: 'ok',
            message: '',
            data: data
        }
    }

    async getAll() {
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
            code: 'ok',
            message: '',
            data: newWidget
        }
    }

    async insert(reference,icon,contents,sources) {
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
                            code: 'ok',
                            message: ''
                        }
                    } else {
                        this.core.logger.warning(Package.name, "Missing icon action when sources widget")
                        return {
                            error: true,
                            message: "Missing sources action",
                            code: "missing-sources-action"
                        }
                    }
                } else {
                    this.core.logger.warning(Package.name, "Missing icon action when contents widget")
                    return {
                        error: true,
                        message: "Missing contents action",
                        code: "missing-contents-action"
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Missing icon action when insert widget")
                return {
                    error: true,
                    message: "Missing icon action",
                    code: "missing-icon-action"
                }
            }
        } else {
            this.core.logger.warning(Package.name, "Missing reference action when insert widget")
            return {
                error: true,
                message: "Missing reference action",
                code: "missing-reference-action"
            }
        }
    }

    async update(idWidget, content) {
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
                code: 'ok',
                message: ''
            }
        } else {
            this.core.logger.warning(Package.name + ">insertSettings>missingParameter", "Missing smartobject settings name")
            return {
                error: true,
                message: "Missing smartobject settings name",
                code: Package.name + ">update>missingParameter"
            }
        }
    }

    async delete(idWidget) {
        this.core.logger.verbose(Package.name, "Delete widget " + idWidget)
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
            code: "ok"
        }
    }

    async insertSource(idWidget, reference, source, action, pArguments) {
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
                                code: Package.name + ">widget>notFound"
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
                            code: "ok"
                        }
                    } else {
                        this.core.logger.warning(Package.name, "Missing arguments")
                        return {
                            error: true,
                            message: "Missing arguments action",
                            code: "missing-arguments-action"
                        }
                    }
                } else {
                    this.core.logger.warning(Package.name, "Missing action")
                    return {
                        error: true,
                        message: "Missing action action",
                        code: "missing-action-action"
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Missing source")
                return {
                    error: true,
                    message: "Missing source action",
                    code: "missing-source-action"
                }
            }
        } else {
            this.core.logger.warning(Package.name, "Missing reference")
            return {
                error: true,
                message: "Missing reference action",
                code: "missing-reference-action"
            }
        }
    }

    async insertContent(idWidget, idType , content) {
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
                        code: Package.name + ">widget>notFound"
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
                    code: "ok"
                }
            } else {
                this.core.logger.warning(Package.name, "Missing content")
                return {
                    error: true,
                    message: "Missing content action",
                    code: "missing-content-action"
                }
            }
        } else {
            this.core.logger.warning(Package.name, "Missing type")
            return {
                error: true,
                message: "Missing type action",
                code: "missing-type-action"
            }
        }
    }

    async deleteSource(idWidget, idSource) {
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
            code: "ok"
        }
    }

    async deleteContent(idWidget, idContent) {
        let widgetContentRequest = await this.sqlWidgetContent.deleteAllByField({ widget: idWidget, id: idContent })
        if (widgetContentRequest.error) {
            return widgetContentRequest
        }
        return {
            error: false,
            message: "",
            code: "ok"
        }
    }

    async getConfiguration() {
        let contentTypes =  await this.sqlWidgetContentType.getAll()
        if(contentTypes.error) {
            return contentTypes
        }
        return {
            error: false,
            code: "ok",
            message: "",
            data: {
                contents: {
                    types: contentTypes.data
                }
            }
        }
    }

}

export default Widget