"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("../package")),_connector=_interopRequireDefault(require("../connector")),_Tracing=_interopRequireDefault(require("../utils/Tracing")),_StackTrace=_interopRequireDefault(require("../utils/StackTrace")),_fs=_interopRequireDefault(require("fs")),_Result=_interopRequireDefault(require("../utils/Result")),_Manager=_interopRequireDefault(require("./Manager"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Smartobject extends _Manager.default{constructor(a){/* Private */ /* Connector */super(),_Tracing.default.verbose(_package.default.name,"Start smartobject manager"),this.core=a,this.packages=[],this.instances=new Map,this.sqlSmartobject=new _connector.default("smartobject"),this.sqlSmartobjectArgument=new _connector.default("smartobject_argument")}async before(){try{let a=await this.sqlSmartobject.updateAll({status:2});if(a.error)return _Tracing.default.warning(_package.default.name,a.package+" "+a.message),a;let b=await this.initialisation();return b.error?b:new _Result.default(_package.default.name,!1,"")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when executing before function"),new _Result.default(_package.default.name,!0,"Error occurred when executing before function")}}async initialisation(){try{let a=await this.smartobjectController.getAll();if(a.error)return a;for(let b=0;b<a.data.length;b++){let c=a.data[b],d=await this.instanciate(c);if(d.error)return d}return new _Result.default(_package.default.name,!1,"")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when initialisation smartobject manager"),new _Result.default(_package.default.name,!0,"Error occurred when initialisation smartobject manager")}}async restart(){try{return this.packages=[],this.instances=new Map,await this.before()}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when restart smartobject manager"),new _Result.default(_package.default.name,!0,"Error occurred when restart smartobject manager")}}async instanciate(a){try{if(!1===this.instances.has(a.id))if(this.packages.includes(a.module))try{let b={};a.arguments.forEach(a=>{b[a.reference]=a.value});let c=require(a.module+"/package.json"),d=require(a.module),e=new d(this.core,a.id,a.reference,b,_Tracing.default,c),f=await this.sqlSmartobject.updateAll({status:1},{id:a.id});if(f.error)return f;this.instances.set(a.id,e),_Tracing.default.verbose(_package.default.name,"Instanciate smartobject n\xB0"+a.id)}catch(a){_StackTrace.default.save(a),_Tracing.default.error(_package.default.name,a)}else if(_fs.default.existsSync("./node_modules/"+a.module)){this.packages.push(a.module);let b=await this.instanciate(a);if(b.error)return b}else{let b=await this.sqlSmartobject.updateAll({status:3},{id:a.id});if(b.error)return b;_Tracing.default.warning(_package.default.name,"Missing package : "+a.module)}return new _Result.default(_package.default.name,!1,"")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when instanciate an smartobject"),new _Result.default(_package.default.name,!0,"Error occurred when instanciate an smartobject")}}async update(a){_Tracing.default.verbose(_package.default.name,"Update smartobject instance n\xB0"+a);try{let b=await this.smartobjectController.getOne(a);if(b.error)return b;let c=b.data;this.instances.has(c.id)&&this.instances.delete(c.id);let d=await this.instanciate(c);return d.error?d:new _Result.default(_package.default.name,!1,"")}catch(b){return _Tracing.default.error(_package.default.name,"An error occurred when update smartobject instance n\xB0"+a),_StackTrace.default.save(b),new _Result.default(_package.default.name,!0,"Error occurred when update smartobject")}}getAll(){try{let a=[];for(let b=0;b<this.packages.length;b++){let c=this.packages[b],d=require(c+"/package.json");a.push(d)}return new _Result.default(_package.default.name,!1,"",a)}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when get all configuration in smartobject manager"),new _Result.default(_package.default.name,!0,"Error occurred when get all configuration in smartobject manage")}}}var _default=Smartobject;exports.default=_default,module.exports=exports.default;