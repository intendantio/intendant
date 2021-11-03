"use strict";var _configuration=_interopRequireDefault(require("../configuration.json")),_core=_interopRequireDefault(require("@intendant/core/__mocks__/core")),_package=_interopRequireDefault(require("../package.json"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}let settings={id:"1",path:"fakeip",apikey:"apikey"};describe(_package.default.name,()=>{/* @intendant/smartobject */ /* @intendant/hue-sensor-smartobject */beforeEach(()=>jest.resetModules()),test("action success",async()=>{let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("test",{message:"test-jest"});expect(c).toEqual({package:_package.default.name,data:{}})}),test("action not found",async()=>{let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("test-no-found",{message:"test-jest"});expect(c).toEqual({package:_package.default.name,message:"Action not found 'test-no-found'"})}),test("action throw",async()=>{let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("test",{message:"test-jest",throw:!0});expect(c).toEqual({package:_package.default.name,message:"An error has occurred when test '\"test-error\"'"})}),test("action success > checkPresence",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>({state:{data:"jest-mock"}}),status:200}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("checkPresence",{});expect(c).toEqual({package:_package.default.name,error:!1,message:"",data:{state:{data:"jest-mock"}}})}),test("action error status > checkPresence",async()=>{jest.mock("node-fetch",()=>async()=>({status:500}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("checkPresence",{});expect(c).toEqual({package:_package.default.name,error:!0,message:"Invalid status 500"})}),test("action error request > checkPresence",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>[{error:"jest-error"}],status:200}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("checkPresence",{});expect(c).toEqual({package:_package.default.name,error:!0,message:"Invalid request \"jest-error\""})})});