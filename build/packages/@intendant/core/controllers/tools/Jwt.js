"use strict";var _jsonwebtoken=_interopRequireDefault(require("jsonwebtoken"));Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Jwt{static generateAccessToken(a,b){return _jsonwebtoken.default.sign(a,b)}static verifyAccessToken(a="",b){if(0===a.length)return{valid:!1};try{return{valid:!0,login:_jsonwebtoken.default.verify(a,b)}}catch(a){return{valid:!1}}}}var _default=Jwt;exports.default=_default,module.exports=exports.default;