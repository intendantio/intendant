"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _betterSqlite=_interopRequireDefault(require("better-sqlite3")),_fs=_interopRequireDefault(require("fs")),_util=_interopRequireDefault(require("util"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}let instance=null;class Connection{static getInstance(a){return null===instance&&(instance=(0,_betterSqlite.default)(a.file?a.file:"intendant.db"),_fs.default.readFileSync("./intendant.sqlite.sql").toString().split(";").forEach(a=>{instance.prepare(a).run()})),instance}}var _default=Connection;exports.default=_default,module.exports=exports.default;