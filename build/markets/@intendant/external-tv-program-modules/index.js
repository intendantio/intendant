"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("./package.json")),_nodeFetch=_interopRequireDefault(require("node-fetch")),_xml2js=_interopRequireDefault(require("xml2js"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class ExternalRecipe{constructor(a){this.core=a,this.configuration="https://xmltv.ch/xmltv/xmltv-tnt.xml"}/*
        Action
    */async __getProgram(a={}){try{let b="";if(a.program){let c=await this.core.controller.cache.get({reference:_package.default.name});if(c.error)return c;if(c.cache)this.core.logger.verbose(_package.default.name,"Use cache"),b=c.data;else{let a=await(0,_nodeFetch.default)(this.configuration),c=await a.text();b=c,await this.core.controller.cache.insert({reference:_package.default.name,data:c,interval:2592e3})}let d=await _xml2js.default.parseStringPromise(b),e=!1,f={};if(d.tv.channel.forEach(b=>{b["display-name"][0].toLowerCase()==a.program.toLowerCase()&&(e=!0,f=b)}),!1==e)return this.core.logger.warning(_package.default.name,"Program is missing"),{error:!0,code:_package.default.name+">getProgram>program>missing",message:"Program is missing"};else{let b=f.$.id,c=new Date,e=c.getDate(),g=d.tv.programme.filter(a=>a.$.channel.toLowerCase()==b.toLowerCase());if(g=g.filter(b=>b.$.start.slice(6,8)==e&&parseInt(b.$.start.slice(8,10))==a.hour&&parseInt(b.$.start.slice(10,12))==a.minute),0==g.length)return{error:!0,code:_package.default.name+">getProgram>program>missing",message:"Program is missing"};else{let a=g[0];return{error:!1,code:"ok",data:{title:a.title[0]},message:""}}}}else return this.core.logger.warning(_package.default.name,"Program is missing"),{error:!0,code:_package.default.name+">getProgram>program>missing",message:"Program is missing"}}catch(a){return this.core.logger.warning(_package.default.name,"Throw exception"),{error:!0,code:_package.default.name+">getProgram>throwException",message:"Throw exception"}}}async __getAllProgram(a={}){try{let a="",b=await this.core.controller.cache.get({reference:_package.default.name});if(b.error)return b;if(b.cache)this.core.logger.verbose(_package.default.name,"Use cache"),a=b.data;else{let b=await(0,_nodeFetch.default)(this.configuration),c=await b.text();a=c,await this.core.controller.cache.insert({reference:_package.default.name,data:c,interval:2592e3})}let c=await _xml2js.default.parseStringPromise(a),d=c.tv.channel.map(a=>a["display-name"][0].toLowerCase());return{error:!1,code:"ok",data:d,message:""}}catch(a){return this.core.logger.warning(_package.default.name,"Throw exception"),{error:!0,code:_package.default.name+">getAllProgram>throwException",message:"Throw exception"}}}}var _default=ExternalRecipe;exports.default=_default,module.exports=exports.default;