"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _Controller=_interopRequireDefault(require("./Controller")),_nodeFetch=_interopRequireDefault(require("node-fetch")),_extractZip=_interopRequireDefault(require("extract-zip")),_fs=_interopRequireDefault(require("fs")),_npm=_interopRequireDefault(require("npm")),_package=_interopRequireDefault(require("../package.json")),_child_process=require("child_process");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Market extends _Controller.default{async install(a){try{this.core.logger.verbose(_package.default.name,"Market controller : download file from https://market.intendant.io");let b=await(0,_nodeFetch.default)("https://market.intendant.io"),c=await b.json();if(c=c.filter(b=>b.name==a),0==c.length)return this.core.logger.warning(_package.default.name,"Market controller : package not found "+a),{package:_package.default.name,message:"",error:!0};if(1<c.length)return this.core.logger.warning(_package.default.name,"Market controller : package not found "+a),{package:_package.default.name,message:"",error:!0};else{let b=c[0];return this.core.logger.verbose(_package.default.name,"Market controller : install package "+b.raw),await new Promise(a=>{(0,_child_process.exec)("npm install "+b.raw+" --silent 2>&1 | tee t",()=>{a()})}),this.core.logger.verbose(_package.default.name,"Market controller : install "+a+" successful"),a.includes("smartobject")?(this.core.logger.verbose(_package.default.name,"Market controller : restart smartobject manager"),this.core.manager.smartobject.installSmartobjects.push(a),await this.core.manager.smartobject.restart()):a.includes("module")&&(this.core.logger.verbose(_package.default.name,"Market controller : restart module manager"),this.core.manager.module.installModules.push(a),this.core.manager.module.restart()),{package:_package.default.name,message:"",error:!1}}}catch(a){return this.core.logger.error("Market : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}async uninstall(a){try{return this.core.logger.verbose(_package.default.name,"Market controller : delete Package "+a),this.core.logger.verbose(_package.default.name,"Market controller : restart configuration"),this.core.manager.module.installModules=this.core.manager.module.installModules.filter(b=>a!=b),this.core.manager.smartobject.installSmartobjects=this.core.manager.smartobject.installSmartobjects.filter(b=>a!=b),this.core.manager.module.restart(),await this.core.manager.smartobject.restart(),{package:_package.default.name,message:"",error:!1}}catch(a){return this.core.logger.error("Market : "+a.toString()),{package:_package.default.name,error:!0,message:"Internal server error"}}}}var _default=Market;exports.default=_default,module.exports=exports.default;