"use strict";var _index=_interopRequireDefault(require("../index"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}describe("@intendant/console",()=>{test("verbose",()=>{expect(_index.default.verbose("jest-object","jest-message")).toBe(!0)}),test("warning",()=>{expect(_index.default.warning("jest-object","jest-message")).toBe(!0)}),test("error",()=>{expect(_index.default.error("jest-object","jest-message")).toBe(!0)}),test("throw error - verbose",()=>{expect(_index.default.verbose("jest-object")).toBe(!1)}),test("throw error - warning",()=>{expect(_index.default.warning("jest-object")).toBe(!1)}),test("throw error - error",()=>{expect(_index.default.error("jest-object")).toBe(!1)}),test("throw error - verbose",()=>{expect(_index.default.verbose(null,"jest-message")).toBe(!1)}),test("throw error - warning",()=>{expect(_index.default.warning(null,"jest-message")).toBe(!1)}),test("throw error - error",()=>{expect(_index.default.error(null,"jest-message")).toBe(!1)})});