"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("../package")),_md=_interopRequireDefault(require("md5"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Modules{constructor(a){this.core=a,this.connector=a.connector,this.logger=a.logger,this.installModules=[],this.logger.verbose(_package.default.name,"Start Module Manager"),this.modules=new Map}restart(){this.logger.verbose(_package.default.name,"Restart Module Manager"),this.modules=new Map,this.installModules.forEach(async a=>{this.logger.verbose(_package.default.name,"Module "+a+" has installed");let b=require(a),c=new b(this.core);this.modules.set(a,c)})}getByHash(a){let b=!1;return this.installModules.forEach(c=>{(0,_md.default)(c)==a&&(b=c)}),b}async executeAction(a,b,c){if(this.modules.has(a)){let d=this.modules.get(a);return"function"==typeof d["__"+b]?await d["__"+b](c):{error:!0,package:_package.default.name,message:"Action not found"}}return{error:!0,package:_package.default.name,message:"Module not found"}}getAll(){this.core.logger.verbose(_package.default.name,"Get all modules");let a=[];return this.installModules.forEach(b=>{try{let c=require(b+"/Package.json");a.push(c)}catch(a){this.core.logger.error(_package.default.name,"Impossible get configuration in "+b+" module"),this.core.logger.error(_package.default.name,JSON.stringify(a.toString()))}}),{error:!1,package:_package.default.name,message:"",data:a}}}var _default=Modules;exports.default=_default,module.exports=exports.default;