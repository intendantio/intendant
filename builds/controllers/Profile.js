"use strict";var _Controller=_interopRequireDefault(require("./Controller"));Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Profile extends _Controller.default{async getAll(){try{return await this.sqlProfile.getAll()}catch(a){return this.core.logger.error("Profile : "+a.toString()),{package:Package.name,error:!0,message:"Internal server error"}}}async getOne(a){try{return await this.sqlAuthorization.getOne(a)}catch(a){return this.core.logger.error("Profile : "+a.toString()),{package:Package.name,error:!0,message:"Internal server error"}}}}var _default=Profile;exports.default=_default,module.exports=exports.default;