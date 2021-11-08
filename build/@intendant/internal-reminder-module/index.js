"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("./package.json")),_moment=_interopRequireDefault(require("moment"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class InternalListManager{constructor(a){this.core=a}async __create(a={}){return a.flag=(0,_moment.default)().unix(),await this.core.controller.storage.setItem(_package.default.name,a)}async __getOne(a={}){let b=await this.core.controller.storage.getItem(_package.default.name+"/"+a.reference);if(b.error)return b;let c=b.data;return!1==c?{package:_package.default.name,message:"Reminder with reference "+a.reference+" is not found",error:!0}:(c.active=!(c.flag+1e3*(60*(60*c.interval))>(0,_moment.default)().unix()),c.action=c.active?c.action_active:c.action_inactive,{package:_package.default.name,message:"",error:!1,data:c})}async __update(a={}){let b=await this.core.controller.storage.getItem(_package.default.name+"/"+a.reference);if(b.error)return b;let c=b.data;return!1==c?{package:_package.default.name,message:"Reminder with reference "+a.reference+" is not found",error:!0}:(c.flag=(0,_moment.default)().unix(),await this.core.controller.storage.setItem(_package.default.name,c))}}var _default=InternalListManager;exports.default=_default,module.exports=exports.default;