"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _Controller=_interopRequireDefault(require("./Controller")),_package=_interopRequireDefault(require("../package.json"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Process extends _Controller.default{async getOne(a){let b=await this.sqlProcess.getOne(a);if(b.error)return b;if(!1===b.data)return{error:!0,message:"Process not found",code:_package.default.name+">Process>NotFound"};let c=await this.sqlProcessAction.getAllByField({process:a});if(c.error)return c;let d=[];for(let b=0;b<c.data.length;b++){let a=c.data[b],e=await this.sqlProcessActionArgument.getAllByField({process_action:a.id});if(e.error)return e;a.arguments=e.data,d.push(a)}let e=await this.sqlProcessInput.getAllByField({process:a});if(e.error)return e;let f=await this.sqlProcessProfile.getAllByField({process:a});if(f.error)return f;let g=await this.sqlEspace.getOne(b.data.espace);if(g.error)return g;let h=b.data;return h.actions=d,h.inputs=e.data.map(a=>(a.id=a.reference,a)),h.profiles=f.data,h.espace=g.data,{error:!1,message:"",code:"ok",data:h}}async getAll(){let a=await this.sqlProcess.getAll();if(a.error)return a;else{let b=[],c=a.data;for(let a=0;a<c.length;a++){let d=c[a],e=await this.getOne(d.id);if(e.error)return e;b.push(e.data)}return{error:!1,message:"",code:"ok",data:b}}}async delete(a){let b=await this.sqlProcessAction.getAllByField({process:a});if(b.error)return b;for(let c,d=0;d<b.data.length;d++)c=b.data[d],await this.sqlProcessActionArgument.deleteAllByField({process_action:c.id});return await this.sqlProcessInput.deleteAllByField({process:a}),await this.sqlProcessAction.deleteAllByField({process:a}),await this.sqlProcessProfile.deleteAllByField({process:a}),await this.sqlProcess.deleteOne(a),{error:!1,message:"",code:"ok"}}async insertProcessProfile(a,b){let c=await this.sqlProcess.getOne(a);if(c.error)return c;let d=c.data,e=await this.sqlProcessProfile.getOneByField({Process:a,profile:b});if(e.error)return e;let f=e.data;if(!1===f){let a=await this.sqlProcessProfile.insert({id:null,Process:d.id,profile:b});if(a.error)return a}return{error:!1,message:"",code:"ok"}}async deleteProcessProfile(a,b){let c=await this.sqlProcess.getOne(a);if(c.error)return c;let d=c.data,e=await this.sqlProcessProfile.getOneByField({Process:a,profile:b});if(e.error)return e;let f=e.data;if(f){let a=await this.sqlProcessProfile.deleteAllByField({id:f.id});if(a.error)return a}return{error:!1,message:"",code:"ok"}}isAllow(a,b,c=!1){let d=!1;return a.profiles.forEach(a=>{a.profile==b&&(d=!0)}),d||c}async executeAction(a,b,c,d=!1){let e=await this.getOne(a,b,d);if(e.error)return e;let f=e.data;if(this.isAllow(f,b,d)){let a=f.actions,b=[];for(let d=0;d<a.length;d++){const e=a[d];let g={};if(e.arguments.forEach(a=>{for(let b in c){let d=c[b];a.value=a.value.replace("{"+b+"}",d)}g[a.reference]=a.value}),this.core.logger.verbose(_package.default.name,"Argument inflate "+JSON.stringify(g)),e.enable===f.enable||"simple"===f.mode)if("smartobject"===e.type){let a=await this.sqlSmartobject.getOne(e.object);if(a.error)return a;let c=await this.core.manager.smartobject.smartobjects.get(a.data.reference).action(e.action,g);if(c.error)return c;b.push(c.data)}else if("module"===e.type){let a=await this.core.manager.module.executeAction(e.object,e.action,g);if(a.error)return a;b.push(a.data)}else return this.core.logger.error(_package.default.name,"Invalid type '"+e.type+"'"),{error:!0,message:"Invalid type '"+e.type+"'",code:_package.default.name+">Type>Invalid"}}return"switch"===f.mode&&(await this.sqlProcess.updateAll({enable:0==f.enable?1:0},{id:f.id})),{error:!1,message:"",code:"ok",data:b}}return{error:!0,message:"You are not allowed",code:_package.default.name+">forbiden"}}async insert(a,b,c,d,e,f,g,h,i,j){let k=await this.sqlProcess.insert({id:null,reference:a,name:b,name_enable:c,name_disable:d,description:e,espace:f,icon:g,enable:"0",mode:h});if(k.error)return k;let l=k.data.insertId;for(let k=0;k<i.length;k++){let a=i[k],b=await this.sqlProcessAction.insert({id:null,process:l,object:a.source.id,action:a.action.id,enable:a.enable?1:0,type:a.source.type});if(b.error)return b;let c=b.data.insertId;for(let b=0;b<a.arguments.length;b++){let d=a.arguments[b],e=await this.sqlProcessActionArgument.insert({id:null,reference:d.reference,value:d.value,process_action:c});if(e.error)return e}}for(let k=0;k<j.length;k++){let a=j[k],b=await this.sqlProcessInput.insert({id:null,reference:a.reference,name:a.name,type:a.type,enable:a.enable,process:l});if(b.error)return b}return{error:!1,message:"",code:"ok"}}async insertAction(a,b,c,d,e){let f=await this.sqlProcess.getOne(a);if(f.error)return f;let g=f.data,h=await this.sqlProcessAction.insert({id:null,process:g.id,object:b.id,action:c.id,enable:d?1:0,type:b.type});if(h.error)return h;let i=h.data.insertId;for(let f=0;f<e.length;f++){let a=e[f],b=await this.sqlProcessActionArgument.insert({id:null,reference:a.reference,value:a.value,process_action:i});if(b.error)return b}return{error:!1,message:"",code:"ok"}}async deleteAction(a,b){let c=await this.sqlProcessActionArgument.deleteAllByField({process_action:b});if(c.error)return c;let d=await this.sqlProcessAction.deleteAllByField({id:b});return d.error?d:{error:!1,message:"",code:"ok"}}async insertInput(a,b,c,d,e){if(a){if(b){if(c){if(d){if(null!=e){let f=await this.sqlProcess.getOne(a);if(f.error)return f;let g=await this.sqlProcessInput.getOneByField({process:a,reference:b});if(g.error)return g;if(!1==g.data){let f=await this.sqlProcessInput.insert({id:null,reference:b,name:c,type:d,enable:e,process:a});return f.error?f:{error:!1,message:"",code:"ok"}}return this.core.logger.warning(_package.default.name+">insertInput>alreadyExist","Reference already exist"),{error:!0,message:"Reference already exist",code:_package.default.name+">insertInput>alreadyExist"}}return this.core.logger.warning(_package.default.name+">insertInput>missingParameter","Missing process settings enable"),{error:!0,message:"Missing process settings enable",code:_package.default.name+">insertInput>missingParameter"}}return this.core.logger.warning(_package.default.name+">insertInput>missingParameter","Missing process settings type"),{error:!0,message:"Missing process settings type",code:_package.default.name+">insertInput>missingParameter"}}return this.core.logger.warning(_package.default.name+">insertInput>missingParameter","Missing process settings name"),{error:!0,message:"Missing process settings name",code:_package.default.name+">insertInput>missingParameter"}}return this.core.logger.warning(_package.default.name+">insertInput>missingParameter","Missing process settings reference"),{error:!0,message:"Missing process settings reference",code:_package.default.name+">insertInput>missingParameter"}}return this.core.logger.warning(_package.default.name+">insertInput>missingParameter","Missing process settings id"),{error:!0,message:"Missing process settings id",code:_package.default.name+">insertInput>missingParameter"}}async deleteInput(a,b){console.log(a,b);let c=await this.sqlProcessInput.deleteAllByField({reference:b,process:a});return c.error?c:{error:!1,message:"",code:"ok"}}}var _default=Process;exports.default=_default,module.exports=exports.default;