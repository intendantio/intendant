"use strict";var _configuration=_interopRequireDefault(require("../configuration.json")),_core=_interopRequireDefault(require("@intendant/core/__mocks__/core")),_cache=_interopRequireDefault(require("@intendant/core/__mocks__/cache")),_package=_interopRequireDefault(require("../package.json"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}let settings={clientId:"jest-clientId",token:"jest-token",clientSecret:"jest-clientSecret",device:"jest-device"};describe(_package.default.name,()=>{/* @intendant/smartobject */ /* @intendant/netatmo-home-coach-smartobject */beforeEach(()=>jest.resetModules()),test("action success",async()=>{let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("test",{message:"test-jest"});expect(c).toEqual({code:"ok",error:!1,message:"test-jest",data:{}})}),test("action not found",async()=>{let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("test-no-found",{message:"test-jest"});expect(c).toEqual({code:"@intendant/smartobject>Action>NotFound>test-no-found",error:!0,message:"Action not found 'test-no-found'"})}),test("action throw",async()=>{let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("test",{message:"test-jest",throw:!0});expect(c).toEqual({code:"@intendant/smartobject>Error>test",error:!0,message:"An error has occurred when test '\"test-error\"'"})}),test("action success > getData",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>({error:{code:""},status:"ok",body:{devices:{data:"jest-mock"}}}),status:200}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getData",{});expect(c).toEqual({code:"ok",error:!1,message:"",data:{error:{code:""},status:"ok",body:{devices:{data:"jest-mock"}}}})}),test("action error status > getData",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>({error:{code:""},status:"ok",body:{devices:{data:"jest-mock"}}}),status:500}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getData",{});expect(c).toEqual({code:_package.default.name+">getData>invalidStatus>500",error:!0,message:"Invalid status 500"})}),test("action error request > getData",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>({error:{message:"jest-error"},status:"error",body:{devices:{data:"jest-mock"}}}),status:200}));let a=require("../index"),b=new a(settings,_core.default,_configuration.default),c=await b.action("getData",{});expect(c).toEqual({code:_package.default.name+">getData>invalidRequest>error",error:!0,message:"Invalid request jest-error"})}),test("action error cache > getData",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>({error:{message:"jest-error"},status:"error",body:{devices:{data:"jest-mock"}}}),status:200}));let a=require("../index");_core.default.controller.cache=_cache.default.errorInCache;let b=new a(settings,_core.default,_configuration.default),c=await b.action("getData",{});expect(c).toEqual({code:_package.default.name+">getData>@intendant/core>get>jest-error",error:!0,message:"jest-error"})}),test("action in cache > getData",async()=>{jest.mock("node-fetch",()=>async()=>({json:async()=>({error:{message:"jest-error"},status:"error",body:{devices:{data:"jest-mock"}}}),status:200}));let a=require("../index");_core.default.controller.cache=_cache.default.inCache;let b=new a(settings,_core.default,_configuration.default),c=await b.action("getData");expect(c).toEqual({code:"ok",error:!1,message:"",data:{jest:"cache"}})})});