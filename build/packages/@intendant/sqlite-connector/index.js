"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _util=_interopRequireDefault(require("util")),_connector=_interopRequireDefault(require("@intendant/connector")),_Connection=_interopRequireDefault(require("./lib/Connection")),_package=_interopRequireDefault(require("./package.json"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class SQLite extends _connector.default{constructor(a,b,c){try{super(a,b,c),this._name=c,this._configuration=a,this._connector=_Connection.default.getInstance(a)}catch(a){throw this._core.logger.error(_package.default.name,"Error occured in "+this._name+" table"),a}}check(a){!1==this._connector.open?(this._core.logger.error(_package.default.name,"Unable to connect at database "+this._configuration.connector.database+" "+this._name),this._core.logger.error(_package.default.name,"Please check the configuration of the connector and the status of the database"),process.exit(0)):this._connector.inTransaction&&setTimeout(()=>{this.check(a)},2e3)}async getOne(a){if(this.check(),"string"==typeof a||"number"==typeof a)try{let b=await this._connector.prepare("SELECT * FROM "+this._name+" WHERE id="+a).all();return{code:"ok",error:!1,data:1==b.length&&b[0],message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{code:_package.default.name+">getOne>catchError",error:!0,message:b}}else return{code:_package.default.name+">getOne>error",message:"Invalid parameter",error:!0}}async getOneByField(a){if(this.check("getOneByField"),"object"==typeof a)try{let b=await this._connector.prepare("SELECT * FROM "+this._name+this.getWhere(a)).all();return{code:"ok",error:!1,data:1==b.length&&b[0],message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{code:_package.default.name+">getOneByField>catchError",error:!0,message:b}}else return{code:_package.default.name+">getOneByField>error",message:"Invalid parameter",error:!0}}async getAllByField(a){if(this.check("getAllByField"),"object"==typeof a)try{let b=await this._connector.prepare("SELECT * FROM "+this._name+this.getWhere(a)).all();return{code:"ok",data:b,error:!1,message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{code:_package.default.name+">getAllByField>catchError",error:!0,message:b}}else return{code:_package.default.name+">getAllByField>error",message:"Invalid parameter",error:!0}}async getAll(){this.check("getAll");try{let a=await this._connector.prepare("SELECT * FROM "+this._name).all();return{code:"ok",data:a,error:!1,message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{code:_package.default.name+">getAll>catchError",error:!0,message:b}}}async deleteOne(a){if(this.check("deleteOne"),"string"==typeof a||"number"==typeof a)try{return await this._connector.prepare("DELETE FROM "+this._name+" WHERE id="+a).run(),{code:"ok",error:!1,message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{code:_package.default.name+">deleteOne>catchError",error:!0,message:b}}else return{code:_package.default.name+">deleteOne>error",message:"Invalid parameter",error:!0}}async deleteAllByField(a){if(this.check("deleteAllByField"),"object"==typeof a)try{return await this._connector.prepare("DELETE FROM "+this._name+this.getWhere(a)).run(),{code:"ok",error:!1,message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{code:_package.default.name+">deleteAllByField>catchError",error:!0,message:b}}else return{code:_package.default.name+">deleteAllByField>error",message:"Invalid parameter",error:!0}}async updateAll(a,b={}){if(this.check("updateAll"),"object"==typeof b&&"object"==typeof a)try{return await this._connector.prepare("UPDATE "+this._name+this.getSet(a)+this.getWhere(b)).run(),{code:"ok",error:!1,message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{code:_package.default.name+">updateAll>catchError",error:!0,message:b}}else return{code:_package.default.name+">updateAll>error",message:"Invalid parameter",error:!0}}async truncate(){this.check("truncate");try{return await this._connector.prepare("DELETE FROM "+this._name).run(),{code:"ok",error:!1,message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{code:_package.default.name+">truncate>catchError",error:!0,message:b}}}async insert(a){if(this.check("insert"),"object"==typeof a)try{let b="(",c="(";for(let d in a){let e=a[d];b=b+"`"+d+"`,",null==e?c+="NULL,":"number"==typeof e?c=c+""+e+",":"boolean"==typeof e?c=c+"'"+e+"',":"DATE:CUSTOM"==e.slice(0,11)?c=c+e.slice(11)+",":"DATE:NOW"==e?c+="date('now'),":"string"==typeof e&&(c=c+"'"+e+"',")}c=c.slice(0,-1),c+=")",b=b.slice(0,-1),b+=")";let d=await this._connector.prepare("INSERT INTO "+this._name+" "+b+" VALUES "+c).run();return d={insertId:d.lastInsertRowid},{code:"ok",error:!1,data:d,message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{code:_package.default.name+">insert>catchError",error:!0,message:b}}else return{code:_package.default.name+">insert>error",message:"Invalid parameter",error:!0}}async execute(a){if(this.check("execute"),"string"==typeof a)try{a=a.replace("DATE:NOW","date('now')");let b=await this._connector.prepare(a).all();return{code:"ok",error:!1,data:b,message:""}}catch(a){let b=this._name+" catch an error : "+JSON.stringify(a.toString());return this._core.logger.error(_package.default.name,b),{error:!0,code:_package.default.name+">execute>catchError",message:b}}else return{code:_package.default.name+">execute>error",message:"Invalid parameter",error:!0}}getWhere(a){let b=0,c=" WHERE ";for(let d in a){let e=a[d];0<b&&(c+=" AND "),c="object"==typeof e?"DATE:NOW"==e.value?c+d+e.statement+"date('now')":c+d+e.statement+"'"+e.value+"'":c+d+"='"+e+"'",++b}return 0===b?"":c}getSet(a){let b=0,c=" SET ";for(let d in a){let e=a[d];0<b&&(c+=" , "),null==e?c=c+d+"=NULL,":"number"==typeof e?c=c+d+"="+e+",":"DATE:CUSTOM"==e.slice(0,11)?c=c+d+"=date('now',+"+d.slice(11)+" second),":"DATE:NOW"==e?c=c+d+"=date('now'),":"string"==typeof e&&(c=c+d+"='"+e+"',"),++b}return c=c.slice(0,-1),0===b?"":c}}var _default=SQLite;exports.default=_default,module.exports=exports.default;