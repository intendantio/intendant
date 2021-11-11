"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("./package.json")),_nodeFetch=_interopRequireDefault(require("node-fetch"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class ExternalWeather{constructor(a){this.core=a}async request(a){let b=await(0,_nodeFetch.default)("https://www.prevision-meteo.ch/services/json/"+a);if(200===b.status){let a=await b.json();return a.errors?{error:!0,package:_package.default.name,message:"Invalid result code '"+a.errors[0].text+"'"}:{error:!1,package:_package.default.name,message:"",data:a}}return this.core.logger.warning(_package.default.name,"Invalid result status '"+b.status+"'"),{error:!0,package:_package.default.name,message:"Invalid status "+b.status}}async __currentCondition(a={}){try{if(a.city){let b=await this.core.controller.cache.get({reference:_package.default.name+"-currentCondition-"+a.city});if(b.error)return b;if(b.cache)return this.core.logger.verbose(_package.default.name,"Use cache"),{error:!1,package:_package.default.name,message:"",data:b.data};let c=await this.request(a.city);if(c.error)return c;let d=c.data,e={temperature:d.current_condition.tmp,humidity:d.current_condition.humidity,pressure:d.current_condition.pressure,wind:{speed:d.current_condition.wnd_spd,direction:d.current_condition.wnd_dir},description:{label:d.current_condition.condition,image:d.current_condition.icon}};return await this.core.controller.cache.insert({reference:_package.default.name+"-currentCondition-"+a.city,data:e,interval:600}),{error:!1,package:_package.default.name,message:"",data:e}}return this.core.logger.warning(_package.default.name,"City is missing"),{error:!0,package:_package.default.name,message:"City is missing"}}catch(a){return this.core.logger.error(_package.default.name,a.toString()),{error:!0,package:_package.default.name,message:"Throw exception"}}}async __cityInformation(a={}){try{if(a.city){let b=await this.core.controller.cache.get({reference:_package.default.name+"-cityInformation-"+a.city});if(b.error)return b;if(b.cache)return this.core.logger.verbose(_package.default.name,"Use cache"),{error:!1,package:_package.default.name,message:"",data:b.data};let c=await this.request(a.city);if(c.error)return c;let d=c.data,e={name:d.city_info.name,country:d.city_info.country,latitude:d.city_info.latitude,longitude:d.city_info.longitude,sunrise:d.city_info.sunrise,sunset:d.city_info.sunset};return await this.core.controller.cache.insert({reference:_package.default.name+"-cityInformation-"+a.city,data:e,interval:600}),{error:!1,package:_package.default.name,message:"",data:e}}return this.core.logger.warning(_package.default.name,"City is missing"),{error:!0,package:_package.default.name,message:"City is missing"}}catch(a){return this.core.logger.error(_package.default.name,a.toString()),{error:!0,package:_package.default.name,message:"Throw exception"}}}async __forcastCondition(a={}){try{if(a.city){if([1,2,3].includes(parseInt(a.forecast))){if([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].includes(parseInt(a.time))){let b=await this.core.controller.cache.get({reference:_package.default.name+"-forcastCondition-"+a.city+"-"+a.forecast+"-"+a.time});if(b.error)return b;if(b.cache)return this.core.logger.verbose(_package.default.name,"Use cache"),{error:!1,package:_package.default.name,message:"",data:b.data};let c=await this.request(a.city);if(c.error)return c;let d=c.data,e=d["fcst_day_"+(parseInt(a.forecast)+1)],f=e.hourly_data[a.time+"H00"],g={temperature:f.TMP2m,humidity:f.HUMIDEX,pressure:f.PRMSL,wind:{speed:f.WINSPD10m,direction:f.WINDDIRCARD10},description:{label:f.CONDITION,image:f.ICON}};return await this.core.controller.cache.insert({reference:_package.default.name+"-forcastCondition-"+a.city+"-"+a.forecast+"-"+a.time,data:g,interval:600}),{error:!1,package:_package.default.name,message:"",data:g}}return this.core.logger.warning(_package.default.name,"Time is missing"),{error:!0,package:_package.default.name,message:"Time is missing"}}return this.core.logger.warning(_package.default.name,"Forecast is missing"),{error:!0,package:_package.default.name,message:"Forecast is missing"}}return this.core.logger.warning(_package.default.name,"City is missing"),{error:!0,package:_package.default.name,message:"City is missing"}}catch(a){return this.core.logger.error(_package.default.name,a.toString()),{error:!0,package:_package.default.name,message:"Throw exception"}}}}var _default=ExternalWeather;exports.default=_default,module.exports=exports.default;