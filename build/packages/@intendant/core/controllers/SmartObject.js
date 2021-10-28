"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("../package")),_Controller=_interopRequireDefault(require("./Controller"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class SmartObject extends _Controller.default{async getAll(){let a=[],b=await this.sqlSmartobject.getAll();if(b.error)return b;else{let c=b.data;for(let b=0;b<c.length;b++){let d=c[b],e=await this.getOne(d.id);if(e.error)return e;a.push(e.data)}}return{error:!1,code:"ok",message:"",data:a}}async deleteSettings(a){let b=await this.sqlSmartobjectArgument.getOne(a);if(b.error)return b;let c=b.data,d=await this.sqlSmartobjectArgument.deleteAllByField({id:a});if(d.error)return d;let e=await this.core.manager.smartobject.update(c.smartobject);return e.error?e:{error:!1,message:"",code:"ok"}}async insertSettings(a,b,c){if(b){if(c){let d=await this.sqlSmartobject.getOne(a);if(d.error)return d;let e=await this.sqlSmartobjectArgument.insert({id:null,smartobject:a,reference:b,value:c});if(e.error)return e;let f=await this.core.manager.smartobject.update(d.data.id);return f.error?f:{error:!1,message:"",code:"ok"}}return this.core.logger.warning(_package.default.name+">insertSettings>missingParameter","Missing smartobject settings value"),{error:!0,message:"Missing smartobject settings value",code:_package.default.name+">insertSettings>missingParameter"}}return this.core.logger.warning(_package.default.name+">insertSettings>missingParameter","Missing smartobject settings reference"),{error:!0,message:"Missing smartobject settings reference",code:_package.default.name+">insertSettings>missingParameter"}}async getOne(a){let b=await this.sqlSmartobject.getOne(a);if(b.error)return b;if(!1===b.data)return{error:!0,message:"Smartobject not found",code:_package.default.name+">Smartobject>NotFound"};let c=b.data,d=await this.sqlSmartobjectArgument.getAllByField({smartobject:c.id});if(d.error)return d;let e=d.data,f=await this.sqlSmartobjectStatus.getOne(c.status);if(f.error)return f;let g=f.data,h=await this.sqlSmartobjectProfile.getAllByField({smartobject:c.id});if(h.error)return h;let i=h.data,j=[],k=null;return this.core.manager.smartobject.smartobjects.has(c.reference)&&(j=this.core.manager.smartobject.smartobjects.get(c.reference).moduleConfiguration.actions,j=j.map(a=>(a.allow=!1,a)),k=this.core.manager.smartobject.smartobjects.get(c.reference).moduleConfiguration.icon),{error:!1,data:{id:c.id,icon:k,module:c.module,reference:c.reference,lastUse:c.last_use,status:g,settings:e,actions:j,profiles:i}}}async insertSmartobjectProfile(a,b){let c=await this.sqlSmartobject.getOne(a);if(c.error)return c;let d=c.data,e=await this.sqlSmartobjectProfile.getOneByField({smartobject:a,profile:b});if(e.error)return e;let f=e.data;if(!1===f){let a=await this.sqlSmartobjectProfile.insert({id:null,smartobject:d.id,profile:b});if(a.error)return a}return{error:!1,message:"",code:"ok"}}async deleteSmartobjectProfile(a,b){let c=await this.sqlSmartobject.getOne(a);if(c.error)return c;let d=c.data,e=await this.sqlSmartobjectProfile.getOneByField({smartobject:a,profile:b});if(e.error)return e;let f=e.data;if(f){let a=await this.sqlSmartobjectProfile.deleteAllByField({id:f.id});if(a.error)return a}return{error:!1,message:"",code:"ok"}}async updateLastUse(a){let b=await this.sqlSmartobject.updateAll({last_use:"DATE:NOW"},{id:a});return b.error?b:{error:!1,message:"",code:"ok"}}async insert(a,b,c){if(a){if(!b)return this.core.logger.warning(_package.default.name,"Missing smartobject reference"),{error:!0,message:"Missing smartobject reference",code:"missing-smartobject-reference"};if(c){let d=await this.sqlSmartobject.getOneByField({reference:b});if(d.error)return d;let e=d.data;if(e)return this.core.logger.warning(_package.default.name,"Smartobject already exist"),{error:!0,message:"Smartobject already exist",code:"reference-already-exist-smartobject-parameters"};else{let d=await this.sqlSmartobject.insert({id:null,module:a,status:"2",reference:b,last_use:"DATE:NOW"});if(d.error)return d;else{let a=d.data.insertId;for(let b=0;b<c.length;b++){let d=c[b],e=await this.sqlSmartobjectArgument.insert({id:null,smartobject:a,reference:d.reference,value:d.value});if(e.error)return e}return this.core.manager.smartobject.update(a),{error:!1,message:"",code:"ok"}}}}else return this.core.logger.warning(_package.default.name,"Missing smartobject settings"),{error:!0,message:"Missing smartobject settings",code:"missing-smartobject-settings"}}else return this.core.logger.warning(_package.default.name,"Missing smartobject module"),{error:!0,message:"Missing smartobject module",code:"missing-smartobject-module"}}async delete(a){let b=await this.sqlSmartobjectArgument.deleteAllByField({smartobject:a});if(b.error)return b;let c=await this.sqlSmartobject.deleteOne(a);return c.error?c:{error:!1,message:"",code:"ok"}}isAllow(a,b,c=!1){let d=!1;return a.profiles.forEach(a=>{a.profile==b&&(d=!0)}),d||c}async executeAction(a,b,c,d,e=!1){if(b){if(c){let f=await this.sqlSmartobject.getOne(a);if(f.error)return f;if(!1==f.data)return{error:!0,message:"Smartobject not found",code:_package.default.name+">NotFound"};if(this.core.manager.smartobject.smartobjects.has(f.data.reference)){let a=this.core.manager.smartobject.smartobjects.get(f.data.reference),g=await this.getOne(a.id);return this.isAllow(g.data,c,e)?a.action(b,d):{error:!0,message:"You are not allowed",code:_package.default.name+">forbiden"}}return this.core.logger.warning(_package.default.name,"Smartobject "+reference+" is missing"),{error:!0,message:"Smartobject "+reference+" is not loaded",code:_package.default.name+">NotLoaded"}}return this.core.logger.warning(_package.default.name,"Missing smartobject arguments when executeAction"),{error:!0,message:"Missing smartobject arguments",code:_package.default.name+">Missing>SmartobjectArgument"}}return this.core.logger.warning(_package.default.name,"Missing smartobject action when executeAction"),{error:!0,message:"Missing smartobject action",code:"missing-smartobject-action"}}//TODO getConfiguration
async getConfiguration(){this.core.logger.verbose(_package.default.name,"Get all modules");let a=[];return this.core.configuration.smartobjects.forEach(b=>{try{let c=require(b+"/configuration.json");a.push(c)}catch(a){this.core.logger.warning(_package.default.name,"Impossible get configuration in "+b+" module")}}),{error:!1,code:"ok",message:"",data:a}}}var _default=SmartObject;exports.default=_default,module.exports=exports.default;