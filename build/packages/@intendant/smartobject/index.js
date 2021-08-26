"use strict";var _package=_interopRequireDefault(require("./package.json"));Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class SmartObject{constructor(a,b,c){this.moduleConfiguration=c,this.settings=a,this.id=a._id,this.logger=b.logger,this.core=b,this.moduleConfiguration.settings.map(a=>{if(typeof this.settings[a.id]!=a.type)throw _package.default.name+">Missing settings>"+a.id})}async action(a,b){if(this["__"+a])try{return this.core.controller.smartobject.updateLastUse(this.id),await this["__"+a](b)}catch(b){let c="An error has occurred when "+a+" '"+JSON.stringify(b.toString()).slice(0,100)+"'";return this.logger.warning(_package.default.name,c),{error:!0,code:_package.default.name+">Error>"+a,message:c}}else return this.logger.warning(_package.default.name,"Action not found "+a),{error:!0,code:_package.default.name+">Action>NotFound>"+a,message:"Action not found '"+a+"'"}}async __test(a){if(a.throw)throw"test-error";return{code:"ok",data:{},error:!1,message:a.message}}}var _default=SmartObject;exports.default=_default,module.exports=exports.default;