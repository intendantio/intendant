"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("../package")),_Tracing=_interopRequireDefault(require("../utils/Tracing")),_Result=_interopRequireDefault(require("../utils/Result")),_Manager=_interopRequireDefault(require("./Manager"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Automation extends _Manager.default{constructor(a){super(),this.core=a,this.instances=new Map}async before(){let a=await this.automationController.getAll();if(a.error)return void _Tracing.default.error(_package.default.name,a.message);let b=a.data;b.forEach(async a=>{!1==this.instances.has(a.id)&&"smartobject"==a.trigger.type&&(this.addTrigger(a.id,a.trigger,()=>{if("smartobject"==a.action.type){let b=parseInt(a.action.object);if(this.smartobjectManager.instances.has(b)){let c={};a.action.settings.forEach(a=>{c[a.reference]=a.value}),this.smartobjectController.executeAction(b,a.action.action,1,c)}else _Tracing.default.error(_package.default.name,"Smartobject not instanciate")}else if("process"==a.action.type){let b=parseInt(a.action.object),c={};a.action.settings.forEach(a=>{c[a.reference]=a.value}),this.processController.executeAction(b,1,c,!0)}}),this.instances.set(a.id,!0))})}async addTrigger(a,b,c){let d=parseInt(b.object),e=await this.smartobjectController.getOne(d);if(e.error)return void _Tracing.default.error(_package.default.name,e.error);if(this.smartobjectManager.instances.has(d)){let f=e.data;f.configuration.triggers.forEach(e=>{e.id==b.trigger&&"callback"==e.type&&this.smartobjectManager.instances.get(d).addCallback(e.id,"automation-"+a,c)})}else _Tracing.default.error(_package.default.name,"Smartobject not instanciate")}async removeTrigger(a,b){let c=parseInt(b.object),d=await this.smartobjectController.getOne(c);if(d.error)return d;if(this.smartobjectManager.instances.has(c)){let e=d.data;e.configuration.triggers.forEach(d=>{d.id==b.trigger&&"callback"==d.type&&this.smartobjectManager.instances.get(c).removeCallback(d.id,"automation-"+a)})}return new _Result.default(_package.default.name,!1,"")}async removeInstance(a){if(this.instances.has(a)){let b=await this.automationController.getOne(a);if(b.error)return b;let c=await this.removeTrigger(a,b.data.trigger);if(c.error)return c;this.instances.delete(a)}return new _Result.default(_package.default.name,!1,"")}}var _default=Automation;exports.default=_default,module.exports=exports.default;