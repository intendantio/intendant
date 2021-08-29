"use strict";var _core=_interopRequireDefault(require("@intendant/core/__mocks__/core")),_cache=_interopRequireDefault(require("@intendant/core/__mocks__/cache")),_package=_interopRequireDefault(require("../package.json"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}describe("@intendant/external-recipe-modules",()=>{beforeEach(()=>jest.resetModules()),test("action success > getRecipe",async()=>{jest.mock("node-fetch",()=>async()=>({text:async()=>"",status:200})),jest.mock("match-all",()=>()=>({toArray:()=>["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]}));let a=require("../index"),b=new a(_core.default),c=await b.__getRecipe({recipe:"jest-recipe"});expect(c).toEqual({code:"ok",error:!1,message:"",data:{},source:"https://www.marmiton.org"})}),test("action success > getRecipe",async()=>{jest.mock("node-fetch",()=>async()=>({text:async()=>({}),status:200})),jest.mock("match-all",()=>()=>({toArray:()=>["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]}));let a=require("../index"),b=new a(_core.default),c=await b.__getRecipe();expect(c).toEqual({code:_package.default.name+">getRecipe>recipe>missing",error:!0,message:"Recipe is missing"})}),test("action error status > getRecipe",async()=>{jest.mock("node-fetch",()=>async()=>({status:500})),jest.mock("match-all",()=>()=>({toArray:()=>["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]}));let a=require("../index"),b=new a(_core.default),c=await b.__getRecipe({recipe:"jest-recipe"});expect(c).toEqual({code:_package.default.name+">getRecipe>code>invalidStatus>500",error:!0,message:"Invalid status 500"})}),test("action error request > getRecipe",async()=>{jest.mock("node-fetch",()=>async()=>({text:async()=>[{error:{description:"jest-error"}}],status:200})),jest.mock("match-all",()=>()=>({}));let a=require("../index"),b=new a(_core.default),c=await b.__getRecipe({recipe:"jest-recipe"});expect(c).toEqual({code:_package.default.name+">getRecipe>throwException",error:!0,message:"Throw exception"})}),test("action success cache > getRecipe",async()=>{jest.mock("node-fetch",()=>async()=>({text:async()=>"",status:200})),jest.mock("match-all",()=>()=>({toArray:()=>["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]}));let a=require("../index");_core.default.controller.cache=_cache.default.inCache;let b=new a(_core.default),c=await b.__getRecipe({recipe:"jest-recipe"});expect(c).toEqual({code:"ok",error:!1,message:"",data:{jest:"cache"},source:"cache://www.marmiton.org"})}),test("action error cache > getRecipe",async()=>{jest.mock("node-fetch",()=>async()=>({text:async()=>"",status:200})),jest.mock("match-all",()=>()=>({toArray:()=>["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]}));let a=require("../index");_core.default.controller.cache=_cache.default.errorInCache;let b=new a(_core.default),c=await b.__getRecipe({recipe:"jest-recipe"});expect(c).toEqual({code:"@intendant/core>get>jest-error",error:!0,cache:!1,message:"jest-error"})})});