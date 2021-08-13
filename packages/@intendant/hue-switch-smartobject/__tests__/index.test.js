"use strict";var _configuration=_interopRequireDefault(require("../configuration.json")),_core=_interopRequireDefault(require("@intendant/core/__mocks__/core")),_package=_interopRequireDefault(require("../package.json"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}let settings={id:"1",path:"fakeip",apikey:"apikey"};describe(_package.default.name,()=>{/* @intendant/smartobject */ /* @intendant/hue-sensor-smartobject */ /* getConfiguration */ /* getState */beforeEach(()=>jest.resetModules()),test("action success",async()=>{let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("test",{message:"test-jest"});expect(c).toEqual({code:"ok",error:!1,message:"test-jest",data:{}})}),test("action not found",async()=>{let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("test-no-found",{message:"test-jest"});expect(c).toEqual({code:"@intendant/smartobject>Action>NotFound>test-no-found",error:!0,message:"Action not found 'test-no-found'"})}),test("action throw",async()=>{let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("test",{message:"test-jest",throw:!0});expect(c).toEqual({code:"@intendant/smartobject>Error>test",error:!0,message:"An error has occurred when test '\"test-error\"'"})}),test("action success > getConfiguration",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>({state:{data:"jest-mock"}}),status:200}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getConfiguration",{});expect(c).toEqual({code:"ok",error:!1,message:"",data:{state:{data:"jest-mock"}}})}),test("action error status > getConfiguration",async()=>{jest.mock("node-fetch",()=>async()=>({status:500}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getConfiguration",{});expect(c).toEqual({code:_package.default.name+">getConfiguration>invalidStatus>500",error:!0,message:"Invalid status 500"})}),test("action error request > getConfiguration",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>[{error:"jest-error"}],status:200}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getConfiguration",{});expect(c).toEqual({code:_package.default.name+">getConfiguration>invalidRequest>error",error:!0,message:"Invalid request jest-error"})}),test("action error > getState",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>({}),status:200}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getState",{});expect(c).toEqual({code:_package.default.name+">getState>invalidResult",error:!0,message:"Invalid result"})}),test("action success > getState",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>({capabilities:{inputs:[{events:[{buttonevent:1}]}]},state:{buttonevent:1,lastupdate:null}}),status:200}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getState",{});expect(c).toEqual({code:"ok",error:!1,message:"",data:{event:1,lastEvent:0,type:""}})}),test("action error status > getState",async()=>{jest.mock("node-fetch",()=>async()=>({status:500}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getState",{});expect(c).toEqual({code:_package.default.name+">getState>invalidStatus>500",error:!0,message:"Invalid status 500"})}),test("action error request > getState",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>[{error:"jest-error"}],status:200}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getState",{});expect(c).toEqual({code:_package.default.name+">getState>invalidRequest>error",error:!0,message:"Invalid request jest-error"})})});