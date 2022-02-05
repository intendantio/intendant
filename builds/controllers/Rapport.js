"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _Controller=_interopRequireDefault(require("./Controller")),_StackTrace=_interopRequireDefault(require("../utils/StackTrace")),_Tracing=_interopRequireDefault(require("../utils/Tracing")),_Result=_interopRequireDefault(require("../utils/Result")),_package=_interopRequireDefault(require("../package.json")),_moment=_interopRequireDefault(require("moment"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}const TYPES=["lineChart","pieChart"];class Rapport extends _Controller.default{constructor(a,b,c){super(),this.rapportManager=a,this.widgetController=b,this.smartobjectController=c}async getOne(a){try{let b=await this.sqlRapport.getOne(a);if(b.error)return b;if(!1==b.data)return new _Result.default(_package.default.name,!0,"Missing rapport n\xB0"+a);let c=await this.sqlRapportArgument.getAllByField({rapport:a});if(c.error)return c;b.data.settings=c.data;let d=await this.sqlRapportData.execute("SELECT * FROM rapport_data WHERE rapport = "+a+" ORDER BY date DESC LIMIT 1");if(d.error)return d;b.data.lastData=0!=d.data.length&&d.data[0];let e=await this.sqlRapportData.execute("SELECT count(*) as total FROM rapport_data WHERE rapport = "+a+" ");if(e.error)return e;b.data.total=0==e.data.length?0:e.data[0].total;let f="";if("smartobject"==b.data.type){let a=await this.widgetController.getPackageName("smartobject",b.data.object);if(a.error)return a;f=a.data;let c=await this.smartobjectController.getOne(b.data.object);if(c.error)return c;b.data.smartobject=c.data}else f=b.data.object;let g=await this.widgetController.getConfiguration(f);return g.error?g:(b.data.configuration=g.data,b)}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when get one rapport"),new _Result.default(_package.default.name,!0,"Error occurred when get one rapport")}}async getAll(){try{let a=await this.sqlRapport.getAll();if(a.error)return a;let b=[];for(let c=0;c<a.data.length;c++){let d=a.data[c],e=await this.getOne(d.id);if(e.error)return e;b.push(e.data)}return new _Result.default(_package.default.name,!1,"",b)}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when get all rapport"),new _Result.default(_package.default.name,!0,"Error occurred when get all rapport")}}async insert(a,b,c,d,e,f){try{if(TYPES.includes(b)){/*if(interval < 120 ) {
                    Tracing.warning(Package.name, "Interval is too small, minimum 120 seconds")
                    return new Result(Package.name, false, "Interval is too small, minimum 120 seconds")
                }*/let g=await this.sqlRapport.insert({type:a,chart:b,object:c,reference:d,interval:e});if(g.error)return g;for(let a=0;a<f.length;a++){let b=f[a],c=await this.sqlRapportArgument.insert({reference:b.reference,value:b.value,type:b.type,rapport:g.data.insertId});if(c.error)return c}return this.rapportManager.initialisation(g.data.insertId),await this.getOne(g.data.insertId)}return _Tracing.default.error(_package.default.name,"Invalid rapport type"),new _Result.default(_package.default.name,!1,"Invalid rapport type")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when insert rapport"),new _Result.default(_package.default.name,!0,"Error occurred when insert rapport")}}async delete(a){try{let b=await this.rapportManager.delete(a);if(b.error)return b;let c=await this.truncate(a);if(c.error)return c;let d=await this.sqlRapport.deleteOne(a);return d.error?d:new _Result.default(_package.default.name,!1,"")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when delete rapport"),new _Result.default(_package.default.name,!0,"Error occurred when delete rapport")}}async truncate(a){try{let b=await this.sqlRapportData.deleteAllByField({rapport:a});return b.error?b:new _Result.default(_package.default.name,!1,"")}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when truncate rapport"),new _Result.default(_package.default.name,!0,"Error occurred when truncate rapport")}}async insertData(a,b){try{let c=await this.getOne(a);if(c.error)return c;let d=(0,_moment.default)().valueOf(),e="";e="string"==typeof b?b:"object"==typeof b?JSON.stringify(b):"number"==typeof b?b.toString():"boolean"==typeof b?b?"true":"false":"unknown";let f=await this.sqlRapportData.insert({date:d,rapport:a,value:e});return f.error?f:new _Result.default(_package.default.name,!1,"",{})}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when insert data rapport"),new _Result.default(_package.default.name,!0,"Error occurred when insert data rapport")}}async getData(a,b,c){try{let d=await this.getOne(a);if(d.error)return d;let e=await this.sqlRapportData.execute("SELECT * FROM rapport_data WHERE rapport="+a+" AND date >="+b+" AND date <="+c+" ORDER BY date ASC");return e.error?e:(e.data=e.data.map(a=>(delete a.rapport,delete a.id,a)),new _Result.default(_package.default.name,!1,"",e.data))}catch(a){return _StackTrace.default.save(a),_Tracing.default.error(_package.default.name,"Error occurred when get data rapport"),new _Result.default(_package.default.name,!0,"Error occurred when get data rapport")}}}var _default=Rapport;exports.default=_default,module.exports=exports.default;