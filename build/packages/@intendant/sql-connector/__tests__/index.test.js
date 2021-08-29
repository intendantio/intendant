"use strict";var _index=_interopRequireDefault(require("../index")),_core=_interopRequireDefault(require("@intendant/core/__mocks__/core"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}jest.mock("util",()=>({promisify:a=>({bind:()=>a})}));let table="jest_table",instanceConnector=new _index.default({connector:{}},_core.default,"jest_table");describe("@intendant/sql-connector",()=>{test("getOne",async()=>{expect(await instanceConnector.getOne(1)).toEqual({code:"ok",error:!1,message:"",data:{}})}),test("getOneByField",async()=>{expect(await instanceConnector.getOneByField({id:"test",value:"jest",date:"DATE:NOW"})).toEqual({code:"ok",error:!1,message:"",data:{}})}),test("getAllByField",async()=>{expect(await instanceConnector.getAllByField({})).toEqual({code:"ok",error:!1,message:"",data:[{}]})}),test("getAll",async()=>{expect(await instanceConnector.getAll()).toEqual({code:"ok",error:!1,message:"",data:[{}]})}),test("deleteOne",async()=>{expect(await instanceConnector.deleteOne(1)).toEqual({code:"ok",error:!1,message:""})}),test("deleteAllByField",async()=>{expect(await instanceConnector.deleteAllByField({})).toEqual({code:"ok",error:!1,message:""})}),test("updateAll",async()=>{expect(await instanceConnector.updateAll({id:null,value:"jest",date:"DATE:NOW"},{})).toEqual({code:"ok",error:!1,message:""})}),test("truncate",async()=>{expect(await instanceConnector.truncate(1)).toEqual({code:"ok",error:!1,message:""})}),test("execute",async()=>{expect(await instanceConnector.execute("")).toEqual({code:"ok",error:!1,message:"",data:[{}]})}),test("insert",async()=>{expect(await instanceConnector.insert({id:null,value:"jest",date:"DATE:NOW",datecustom:"DATE:CUSTOMTIME"})).toEqual({code:"ok",error:!1,message:"",data:[{}]})}),test("getOne - error",async()=>{expect(await instanceConnector.getOne()).toEqual({code:"@intendant/sql-connector>getOne>error",error:!0,message:"Invalid parameter"})}),test("getOneByField - error",async()=>{expect(await instanceConnector.getOneByField()).toEqual({code:"@intendant/sql-connector>getOneByField>error",error:!0,message:"Invalid parameter"})}),test("getAllByField - error",async()=>{expect(await instanceConnector.getAllByField()).toEqual({code:"@intendant/sql-connector>getAllByField>error",error:!0,message:"Invalid parameter"})}),test("deleteOne - error",async()=>{expect(await instanceConnector.deleteOne()).toEqual({code:"@intendant/sql-connector>deleteOne>error",error:!0,message:"Invalid parameter"})}),test("deleteAllByField - error",async()=>{expect(await instanceConnector.deleteAllByField()).toEqual({code:"@intendant/sql-connector>deleteAllByField>error",error:!0,message:"Invalid parameter"})}),test("updateAll - error",async()=>{expect(await instanceConnector.updateAll()).toEqual({code:"@intendant/sql-connector>updateAll>error",error:!0,message:"Invalid parameter"})}),test("execute - error",async()=>{expect(await instanceConnector.execute()).toEqual({code:"@intendant/sql-connector>execute>error",error:!0,message:"Invalid parameter"})}),test("insert - error",async()=>{expect(await instanceConnector.insert()).toEqual({code:"@intendant/sql-connector>insert>error",error:!0,message:"Invalid parameter"})});let a="jest-error";test("getOne - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.getOne(1)).toEqual({code:"@intendant/sql-connector>getOne>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})}),test("getOneByField - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.getOneByField({})).toEqual({code:"@intendant/sql-connector>getOneByField>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})}),test("getAll - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.getAll({})).toEqual({code:"@intendant/sql-connector>getAll>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})}),test("getAllByField - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.getAllByField({})).toEqual({code:"@intendant/sql-connector>getAllByField>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})}),test("deleteOne - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.deleteOne(1)).toEqual({code:"@intendant/sql-connector>deleteOne>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})}),test("truncate - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.truncate(1)).toEqual({code:"@intendant/sql-connector>truncate>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})}),test("deleteAllByField - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.deleteAllByField({})).toEqual({code:"@intendant/sql-connector>deleteAllByField>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})}),test("updateAll - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.updateAll({},{})).toEqual({code:"@intendant/sql-connector>updateAll>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})}),test("execute - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.execute("")).toEqual({code:"@intendant/sql-connector>execute>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})}),test("insert - throw",async()=>{instanceConnector._query=async()=>{throw a},expect(await instanceConnector.insert({})).toEqual({code:"@intendant/sql-connector>insert>catchError",error:!0,message:"jest_table catch an error : \"jest-error\""})})});