"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("../package")),_Controller=_interopRequireDefault(require("./Controller")),_Tracing=_interopRequireDefault(require("../utils/Tracing")),_Result=_interopRequireDefault(require("../utils/Result")),_StackTrace=_interopRequireDefault(require("../utils/StackTrace"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Room extends _Controller.default{constructor(a){super(),this.smartobjectController=a}async getAll(){try{let a=await this.sqlRoom.getAll();return a.error?a:new _Result.default(_package.default.name,!1,"",a.data)}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when get all rooms"),new _Result.default(_package.default.name,!0,"Error occurred when get all rooms")}}async getOne(a){try{let b=await this.sqlRoom.getOne(a);if(b.error)return b;let c=await this.sqlSmartobject.getAllByField({room:a});if(c.error)return c;b.data.smartobjects=[];for(let a=0;a<c.data.length;a++){let d=c.data[a],e=await this.smartobjectController.getOne(d.id);b.data.smartobjects.push(e.data)}let d=await this.sqlRoomProfile.getAllByField({room:a});return d.error?d:(b.data.profiles=d.data,new _Result.default(_package.default.name,!1,"",b.data))}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when get one rooms"),new _Result.default(_package.default.name,!0,"Error occurred when get one rooms")}}async insert(a){a.name=a.name.toLowerCase();try{if(a.name){let b={id:null,name:a.name,description:a.description,icon:a.icon},c=await this.sqlRoom.getAllByField({name:a.icon});if(c.error)return c;if(0<c.data.length)return _Tracing.default.warning(_package.default.name,"Room already exist"),new _Result.default(_package.default.name,!0,"Room already exist");let d=await this.sqlRoom.insert(b);return d.error?d:new _Result.default(_package.default.name,!1,"")}return _Tracing.default.warning(_package.default.name,"Missing name"),new _Result.default(_package.default.name,!0,"Missing name")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when insert room"),new _Result.default(_package.default.name,!0,"Error occurred when insert room")}}async delete(a){try{let b=await this.sqlSmartobject.getAllByField({room:a});if(b.error)return b;if(0<b.data.length)return _Tracing.default.warning(_package.default.name,"Cannot delete an room when it contain an smartobject"),new _Result.default(_package.default.name,!0,"Cannot delete an room when it contain an smartobject");let c=await this.sqlRoom.deleteOne(a);return c.error?c:new _Result.default(_package.default.name,!1,"")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when delete room"),new _Result.default(_package.default.name,!0,"Error occurred when delete room")}}async insertRoomProfile(a,b){try{let c=await this.sqlRoom.getOne(a);if(c.error)return c;let d=c.data,e=await this.sqlRoomProfile.getOneByField({room:a,profile:b});if(e.error)return e;let f=e.data;if(console.log(e),!1===f){let a=await this.sqlRoomProfile.insert({id:null,room:d.id,profile:b});if(a.error)return a}return new _Result.default(_package.default.name,!1,"")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when insert room profile"),new _Result.default(_package.default.name,!0,"Error occurred when insert room profile")}}async deleteRoomProfile(a,b){try{let c=await this.sqlRoom.getOne(a);if(c.error)return c;let d=await this.sqlRoomProfile.getOneByField({room:a,profile:b});if(d.error)return d;let e=d.data;if(e){let a=await this.sqlRoomProfile.deleteAllByField({id:e.id});if(a.error)return a}return new _Result.default(_package.default.name,!1,"")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when delete room profile"),new _Result.default(_package.default.name,!0,"Error occurred when delete room profile")}}/* Déprécié */async executeAction(a,b,c){let d=await this.sqlRoom.getOne(a);if(d.error)return d;if(!1==d.data)return _Tracing.default.warning(_package.default.name,"Room not found"),new _Result.default(_package.default.name,!0,"Room not found");let e=await this.sqlSmartobject.getAllByField({room:a});if(e.error)return e;let f=[];return e.data.forEach(a=>{let c=require(a.module+"/package.json");c.actions.forEach(c=>{c.alias==b&&f.push({id:a.id,action:c})})}),f.forEach(async a=>{await this.smartobjectController.executeAction(a.id,a.action.id,1,c,!1)}),new _Result.default(_package.default.name,!1,"")}}var _default=Room;exports.default=_default,module.exports=exports.default;