"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _Controller=_interopRequireDefault(require("./Controller")),_package=_interopRequireDefault(require("../package.json")),_lodash=_interopRequireDefault(require("lodash"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Widget extends _Controller.default{extract(a){let b="",c=[],d="",e=0,f=!1;for(let g=0;g<a.length;g++){const h=a[g];"{"===h&&!1===f?f=!0:"}"!==h&&f?d+=h:"}"===h&&f?(f=!1,c.push({key:"{key-"+e+"}",value:d}),b=b+"{key-"+e+"}",e++,d=""):b+=h}return{content:b,extracts:c}}async getOne(a){let b=await this.sqlWidget.getOne(a);if(b.error)return b;if(!1==b.data)return{error:!0,message:"Widget not found",package:_package.default.name};let c=b.data,d=await this.sqlWidgetContent.getAllByField({widget:c.id});if(d.error)return d;let e=[],f=d.data;for(let b=0;b<f.length;b++){let a=f[b],c=await this.sqlWidgetContentType.getOne(a.type);if(c.error)return c;a.type=c.data,e.push(a)}f=e;let g=await this.sqlWidgetSource.getAllByField({widget:c.id});if(g.error)return g;let h=[];for(let b=0;b<g.data.length;b++){let a=g.data[b],c=await this.sqlWidgetSourceArgument.getAllByField({widget_source:a.id});if(c.error)return c;a.arguments=c.data,h.push(a)}let i=await this.getSource(h);return c.sources=h,c.contents=f.map(a=>{a.native=a.content;let b=this.extract(a.content);return b.extracts.forEach(c=>{let d=i.error?i.package:_lodash.default.get(i.data,c.value);if(Array.isArray(d)&&"list"==a.type.reference){let a="";d.forEach((b,c)=>{try{a=a+(0==c?"":"\n")+"- "+b.toString()}catch(a){}}),d=a}else if(Array.isArray(d)){let a="";d.forEach((b,c)=>{try{a=a+(0==c?"":" ")+b.toString()}catch(a){}}),d=a}b.content=b.content.replace(c.key,d)}),a.content=b.content,a}),{error:!1,data:c}}async getSource(a){let b={};for(let c=0;c<a.length;c++){let d=a[c],e={};if(d.arguments.forEach(a=>{e[a.reference]=a.value}),"smartobject"===d.type){let a=await this.sqlSmartobject.getOne(d.object);if(a.error)return a;if(this.core.manager.smartobject.smartobjects.has(a.data.reference)){let c=await this.core.manager.smartobject.smartobjects.get(a.data.reference).action(d.action,e);if(c.error)return c;b[d.reference]=c.data}else return{error:!0,package:_package.default.name,message:"Smartobject not found"}}else if("module"===d.type){let a=await this.core.manager.module.executeAction(d.object,d.action,e);if(a.error)return a;b[d.reference]=a.data}else return this.core.logger.error(_package.default.name,"Invalid type '"+d.type+"'"),{error:!0,message:"Invalid type '"+d.type+"'",package:_package.default.name}}return{error:!1,package:_package.default.name,message:"",data:b}}async getAll(){let a=await this.sqlWidget.getAll();if(a.error)return a;let b=a.data,c=[];for(let a=0;a<b.length;a++){let d=b[a],e=await this.getOne(d.id);if(e.error)return e;c.push(e.data)}return{error:!1,package:_package.default.name,message:"",data:c}}async insert(a,b,c,d){if(a){if(b){if(c){if(d){let e=await this.sqlWidget.insert({reference:a,icon:b});if(e.error)return e;let f=e.data.insertId;for(let a=0;a<c.length;a++){let b=c[a],d=await this.sqlWidgetContent.insert({type:b.type.id,content:b.content,widget:f});if(d.error)return d}for(let a=0;a<d.length;a++){let b=d[a],c=await this.sqlWidgetSource.insert({reference:b.reference,widget:f,object:b.source.id,action:b.action.id,type:b.source.type});if(c.error)return c;let e=c.data.insertId;for(let a=0;a<b.arguments.length;a++){let c=b.arguments[a],d=await this.sqlWidgetSourceArgument.insert({reference:c.reference,value:c.value,widget_source:e});if(d.error)return d}}return{error:!1,package:_package.default.name,message:""}}return this.core.logger.warning(_package.default.name,"Missing icon action when sources widget"),{error:!0,message:"Missing sources action",package:_package.default.name}}return this.core.logger.warning(_package.default.name,"Missing icon action when contents widget"),{error:!0,message:"Missing contents action",package:_package.default.name}}return this.core.logger.warning(_package.default.name,"Missing icon action when insert widget"),{error:!0,message:"Missing icon action",package:_package.default.name}}return this.core.logger.warning(_package.default.name,"Missing reference action when insert widget"),{error:!0,message:"Missing reference action",package:_package.default.name}}async update(a,b){if(b){let c=await this.sqlWidget.getOne(a);if(c.error)return c;let d=await this.sqlWidgetContent.updateAll({content:b.native},{id:b.id});return d.error?d:{error:!1,package:_package.default.name,message:""}}return this.core.logger.warning(_package.default.name,"Missing smartobject settings name"),{error:!0,message:"Missing smartobject settings name",package:_package.default.name}}async delete(a){this.core.logger.verbose(_package.default.name,"Delete widget "+a);let b=await this.sqlWidgetSource.getAllByField({widget:a});if(b.error)return b;let c=b.data;for(let b=0;b<c.length;b++){let a=c[b],d=await this.sqlWidgetSourceArgument.deleteAllByField({widget_source:a.id});if(d.error)return d}let d=await this.sqlWidgetSource.deleteAllByField({widget:a});if(d.error)return d;let e=await this.sqlWidgetContent.deleteAllByField({widget:a});if(e.error)return e;let f=await this.sqlWidget.deleteOne(a);return f.error?f:{error:!1,message:"",package:_package.default.name}}async insertSource(a,b,c,d,e){if(b){if(c){if(d){if(e){let f=await this.sqlWidget.getOne(a);if(f.error)return f;if(!1==f.data)return{error:!0,message:"Widget not found",package:_package.default.name};let g=await this.sqlWidgetSource.insert({reference:b,widget:a,object:c.id,action:d.id,type:c.type});if(g.error)return g;let h=g.data.insertId;for(let a=0;a<e.length;a++){let b=e[a],c=await this.sqlWidgetSourceArgument.insert({reference:b.reference,value:b.value,widget_source:h});if(c.error)return c}return{error:!1,message:"",package:_package.default.name}}return this.core.logger.warning(_package.default.name,"Missing arguments"),{error:!0,message:"Missing arguments action",package:_package.default.name}}return this.core.logger.warning(_package.default.name,"Missing action"),{error:!0,message:"Missing action action",package:_package.default.name}}return this.core.logger.warning(_package.default.name,"Missing source"),{error:!0,message:"Missing source action",package:_package.default.name}}return this.core.logger.warning(_package.default.name,"Missing reference"),{error:!0,message:"Missing reference action",package:_package.default.name}}async insertContent(a,b,c){if(b){if(c){let d=await this.sqlWidget.getOne(a);if(d.error)return d;if(!1==d.data)return{error:!0,message:"Widget not found",package:_package.default.name};let e=await this.sqlWidgetContent.insert({type:b,content:c,widget:a});return e.error?e:{error:!1,message:"",package:_package.default.name}}return this.core.logger.warning(_package.default.name,"Missing content"),{error:!0,message:"Missing content action",package:_package.default.name}}return this.core.logger.warning(_package.default.name,"Missing type"),{error:!0,message:"Missing type action",package:_package.default.name}}async deleteSource(a,b){let c=await this.sqlWidgetSourceArgument.deleteAllByField({widget_source:b});if(c.error)return c;let d=await this.sqlWidgetSource.deleteAllByField({widget:a,id:b});return d.error?d:{error:!1,message:"",package:_package.default.name}}async deleteContent(a,b){let c=await this.sqlWidgetContent.deleteAllByField({widget:a,id:b});return c.error?c:{error:!1,message:"",package:_package.default.name}}async getConfiguration(){let a=await this.sqlWidgetContentType.getAll();return a.error?a:{error:!1,package:_package.default.name,message:"",data:{contents:{types:a.data}}}}}var _default=Widget;exports.default=_default,module.exports=exports.default;