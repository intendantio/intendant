"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _smartobject=_interopRequireDefault(require("@intendant/smartobject")),_nodeFetch=_interopRequireDefault(require("node-fetch")),_package=_interopRequireDefault(require("./package.json"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class HueSensor extends _smartobject.default{constructor(a,b,c){let d=require("./configuration.json");super(a,b,c,d)}/*
        Action
    */async __checkPresence(a={}){let b=await(0,_nodeFetch.default)("http://"+this.settings.path+"/api/"+this.settings.apikey+"/sensors/"+this.settings.id);if(200==b.status){let a=await b.json();if(Array.isArray(a)){let b=0==a.length?"":a[0].error;return this.logger.warning(this.key,"/checkPresence - error code "+b.type+" return"),{error:!0,package:_package.default.name,message:"Invalid request "+JSON.stringify(b)}}return{error:!1,package:_package.default.name,message:"",data:a}}return{error:!0,package:_package.default.name,message:"Invalid status "+b.status}}}var _default=HueSensor;exports.default=_default,module.exports=exports.default;