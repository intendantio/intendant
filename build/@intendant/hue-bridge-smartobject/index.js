"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _smartobject=_interopRequireDefault(require("@intendant/smartobject")),_nodeFetch=_interopRequireDefault(require("node-fetch")),_package=_interopRequireDefault(require("./package.json")),_https=_interopRequireDefault(require("https"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}const httpsAgent=new _https.default.Agent({rejectUnauthorized:!1});class Hub extends _smartobject.default{constructor(a,b,c){super(a,b,c,_package.default),this.updateState(),this.listener={}}async updateState(){try{this.core.logger.verbose(_package.default.name,"Long polling");let a=await(0,_nodeFetch.default)("https://"+this.settings.path+"/eventstream/clip/v2",{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json","hue-application-key":this.settings.apikey},agent:httpsAgent});if(200==a.status){let b=await a.json(),c=b[0];c.data.forEach(a=>{"function"==typeof this.listener[a.id]&&(a.creationtime=c.creationtime,this.listener[a.id](a))})}setTimeout(()=>{this.updateState()},500)}catch(a){setTimeout(()=>{this.updateState()},1200000)}}}var _default=Hub;exports.default=_default,module.exports=exports.default;