"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _Controller=_interopRequireDefault(require("./Controller")),_package=_interopRequireDefault(require("../package.json")),_lodash=_interopRequireDefault(require("lodash")),_Tracing=_interopRequireDefault(require("../utils/Tracing"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Widget extends _Controller.default{extract(a){let b="",c=[],d="",e=0,f=!1;for(let g=0;g<a.length;g++){const h=a[g];"{"===h&&!1===f?f=!0:"}"!==h&&f?d+=h:"}"===h&&f?(f=!1,c.push({key:"{key-"+e+"}",value:d}),b=b+"{key-"+e+"}",e++,d=""):b+=h}return{content:b,extracts:c}}async getOne(a){try{let b=await this.sqlWidget.getOne(a);if(b.error)return b;if(!1==b.data)return{error:!0,message:"Widget not found",package:_package.default.name};let c=b.data,d=await this.sqlWidgetContent.getAllByField({widget:c.id});if(d.error)return d;let e=[],f=d.data;for(let a=0;a<f.length;a++){let b=f[a],c=await this.sqlWidgetContentType.getOne(b.type);if(c.error)return c;b.type=c.data,e.push(b)}f=e;let g=await this.sqlWidgetSource.getAllByField({widget:c.id});if(g.error)return g;let h=[];for(let a=0;a<g.data.length;a++){let b=g.data[a],c=await this.sqlWidgetSourceArgument.getAllByField({widget_source:b.id});if(c.error)return c;b.arguments=c.data,h.push(b)}let i=await this.getSource(h);c.sources=h;let j=[];return c.contents=f.map(a=>{a.native=a.content;let b=this.extract(a.content);if(b.extracts.forEach(c=>{let d="";if("list"==a.type.reference){let d=c.value.split("[x]").length;if(2==d){let d=c.value.split("[x]")[0],e=c.value.split("[x]")[1];0<e.length&&(e=e.substring(1));let f=_lodash.default.get(i.data,d);Array.isArray(f)?(f.forEach(d=>{j.push({id:a.id,widget:1,type:a.type,native:a.native,content:b.content.replace(c.key,""==e?d:_lodash.default.get(d,e))})}),b.content=""):b.content=b.content.replace(c.key,"NotArray")}else 2<d?b.content=b.content.replace(c.key,"MultipleArray"):1==d&&(b.content=b.content.replace(c.key,"UnknownArray"))}else d=i.error?i.package:_lodash.default.get(i.data,c.value),"object"==typeof d?d=JSON.stringify(d):"boolean"==typeof d?d="Boolean":Array.isArray(d)&&(d="Array"),b.content=b.content.replace(c.key,d)}),"list"!=a.type.reference||""!=b.content)return a.content=b.content,a}),c.contents=c.contents.filter(a=>null!=a),j.forEach(a=>{c.contents.push(a)}),{error:!1,data:c}}catch(a){return console.log(a),_Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async getSource(a){try{let b={};for(let c=0;c<a.length;c++){let d=a[c],e={};if(d.arguments.forEach(a=>{e[a.reference]=a.value}),"smartobject"===d.type){let a=await this.sqlSmartobject.getOne(d.object);if(a.error)return a;if(this.core.manager.smartobject.smartobjects.has(a.data.id)){let c=await this.core.manager.smartobject.smartobjects.get(a.data.id).action(d.action,e);if(c.error)return c;b[d.reference]=c.data}else return{error:!0,package:_package.default.name,message:"Smartobject not found"}}else if("module"===d.type){let a=await this.core.manager.module.executeAction(d.object,d.action,e);if(a.error)return a;b[d.reference]=a.data}else return _Tracing.default.error(_package.default.name,"Invalid type '"+d.type+"'"),{error:!0,message:"Invalid type '"+d.type+"'",package:_package.default.name}}return{error:!1,package:_package.default.name,message:"",data:b}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async getAll(){try{let a=await this.sqlWidget.getAll();if(a.error)return a;let b=a.data,c=[];for(let a=0;a<b.length;a++){let d=b[a],e=await this.getOne(d.id);if(e.error)return e;c.push(e.data)}return{error:!1,package:_package.default.name,message:"",data:c}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async insert(a,b,c,d){try{if(a){if(b){if(c){if(d){let e=await this.sqlWidget.insert({reference:a,icon:b});if(e.error)return e;let f=e.data.insertId;for(let a=0;a<c.length;a++){let b=c[a],d=await this.sqlWidgetContent.insert({type:b.type.id,content:b.content,widget:f});if(d.error)return d}for(let a=0;a<d.length;a++){let b=d[a],c=await this.sqlWidgetSource.insert({reference:b.reference,widget:f,object:b.source.id,action:b.action.id,type:b.source.type});if(c.error)return c;let e=c.data.insertId;for(let a=0;a<b.arguments.length;a++){let c=b.arguments[a],d=await this.sqlWidgetSourceArgument.insert({reference:c.reference,value:c.value,widget_source:e});if(d.error)return d}}return{error:!1,package:_package.default.name,message:""}}return _Tracing.default.warning(_package.default.name,"Missing icon action when sources widget"),{error:!0,message:"Missing sources action",package:_package.default.name}}return _Tracing.default.warning(_package.default.name,"Missing icon action when contents widget"),{error:!0,message:"Missing contents action",package:_package.default.name}}return _Tracing.default.warning(_package.default.name,"Missing icon action when insert widget"),{error:!0,message:"Missing icon action",package:_package.default.name}}return _Tracing.default.warning(_package.default.name,"Missing reference action when insert widget"),{error:!0,message:"Missing reference action",package:_package.default.name}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async update(a,b){try{if(b){let c=await this.sqlWidget.getOne(a);if(c.error)return c;let d=await this.sqlWidgetContent.updateAll({content:b.native},{id:b.id});return d.error?d:{error:!1,package:_package.default.name,message:""}}return _Tracing.default.warning(_package.default.name,"Missing smartobject settings name"),{error:!0,message:"Missing smartobject settings name",package:_package.default.name}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async delete(a){try{_Tracing.default.verbose(_package.default.name,"Delete widget "+a);let b=await this.sqlWidgetSource.getAllByField({widget:a});if(b.error)return b;let c=b.data;for(let a=0;a<c.length;a++){let b=c[a],d=await this.sqlWidgetSourceArgument.deleteAllByField({widget_source:b.id});if(d.error)return d}let d=await this.sqlWidgetSource.deleteAllByField({widget:a});if(d.error)return d;let e=await this.sqlWidgetContent.deleteAllByField({widget:a});if(e.error)return e;let f=await this.sqlWidget.deleteOne(a);return f.error?f:{error:!1,message:"",package:_package.default.name}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async insertSource(a,b,c,d,e){try{if(b){if(c){if(d){if(e){let f=await this.sqlWidget.getOne(a);if(f.error)return f;if(!1==f.data)return{error:!0,message:"Widget not found",package:_package.default.name};let g=await this.sqlWidgetSource.insert({reference:b,widget:a,object:c.id,action:d.id,type:c.type});if(g.error)return g;let h=g.data.insertId;for(let a=0;a<e.length;a++){let b=e[a],c=await this.sqlWidgetSourceArgument.insert({reference:b.reference,value:b.value,widget_source:h});if(c.error)return c}return{error:!1,message:"",package:_package.default.name}}return _Tracing.default.warning(_package.default.name,"Missing arguments"),{error:!0,message:"Missing arguments action",package:_package.default.name}}return _Tracing.default.warning(_package.default.name,"Missing action"),{error:!0,message:"Missing action action",package:_package.default.name}}return _Tracing.default.warning(_package.default.name,"Missing source"),{error:!0,message:"Missing source action",package:_package.default.name}}return _Tracing.default.warning(_package.default.name,"Missing reference"),{error:!0,message:"Missing reference action",package:_package.default.name}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async insertContent(a,b,c){try{if(b){if(c){let d=await this.sqlWidget.getOne(a);if(d.error)return d;if(!1==d.data)return{error:!0,message:"Widget not found",package:_package.default.name};let e=await this.sqlWidgetContent.insert({type:b,content:c,widget:a});return e.error?e:{error:!1,message:"",package:_package.default.name}}return _Tracing.default.warning(_package.default.name,"Missing content"),{error:!0,message:"Missing content action",package:_package.default.name}}return _Tracing.default.warning(_package.default.name,"Missing type"),{error:!0,message:"Missing type action",package:_package.default.name}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async deleteSource(a,b){try{let c=await this.sqlWidgetSourceArgument.deleteAllByField({widget_source:b});if(c.error)return c;let d=await this.sqlWidgetSource.deleteAllByField({widget:a,id:b});return d.error?d:{error:!1,message:"",package:_package.default.name}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async deleteContent(a,b){try{let c=await this.sqlWidgetContent.deleteAllByField({widget:a,id:b});return c.error?c:{error:!1,message:"",package:_package.default.name}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async getConfiguration(){try{let a=await this.sqlWidgetContentType.getAll();return a.error?a:{error:!1,package:_package.default.name,message:"",data:{contents:{types:a.data}}}}catch(a){return _Tracing.default.error(_package.default.name,"Widget : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}}var _default=Widget;exports.default=_default,module.exports=exports.default;