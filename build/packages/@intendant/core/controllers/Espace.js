"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _Controller=_interopRequireDefault(require("./Controller")),_package=_interopRequireDefault(require("../package.json"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Espace extends _Controller.default{async getAll(){return this.sqlEspace.getAll()}}var _default=Espace;exports.default=_default,module.exports=exports.default;