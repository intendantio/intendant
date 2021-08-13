"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _Jwt=_interopRequireDefault(require("./tools/Jwt")),_md=_interopRequireDefault(require("md5")),_Controller=_interopRequireDefault(require("./Controller")),_package=_interopRequireDefault(require("../package.json"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Authentification extends _Controller.default{async getAll(){return this.sqlAuthorization.getAll()}async getAllAuthorizationByProfile(a){let b=await this.sqlAuthorization.getAll();if(b.error)return b;else{let c=await this.sqlAuthorizationProfile.getAllByField({profile:a});if(c.error)return c;else{let a=[];return b.data.forEach(b=>{let d=!1;c.data.forEach(c=>{b.id===c.authorization&&(d=!0,a.push({id:b.id,reference:b.reference,method:b.method,secure:1}))}),!1==d&&a.push({id:b.id,reference:b.reference,method:b.method,secure:0})}),{data:a,code:"ok",message:""}}}}async checkAuthorization(a={}){let b=a.headers.authorization,c=await this.sqlAuthorization.getOneByField({reference:a.url,method:a.method});if(c.error)return this.core.logger.warning(_package.default.name,c.message+a.method+" "+a.url),{error:!0,message:c.messsage+" "+a.method+" "+a.url,code:"authorization-not-found"};if(!1==c.data&&(await this.sqlAuthorization.insert({id:null,reference:a.url,method:a.method,secure:"1"}),c=await this.sqlAuthorization.getOneByField({reference:a.url,method:a.method})),0===c.data.secure)return{error:!1,message:"ok",code:"ok"};let d=_Jwt.default.verifyAccessToken(b,this.core.configuration.token);if(d.valid){let a=d.login.split("~"),b=await this.sqlUser.getOneByField({login:a[1]});if(a[0]!=this.core.salt)return this.core.logger.warning(_package.default.name,"Jwt Token invalid"),{error:!0,message:"Jwt Token invalid",code:_package.default.name+">Token>Invalid"};if(b.error)return b;if(b.data){let a=await this.sqlAuthorizationProfile.getOneByField({profile:b.data.profile,authorization:c.data.id});return a.error?a:a.data?{error:!1,message:"ok",code:"ok",profile:b.data.profile,user:b.data.id}:(this.core.logger.warning(_package.default.name,"Forbiden"),{error:!0,message:"Forbidden",code:_package.default.name+">Forbidden"})}return this.core.logger.warning(_package.default.name,"User not found"),{error:!0,message:"User invalid",code:_package.default.name+">User>NotFound"}}return this.core.logger.warning(_package.default.name,"Jwt Token invalid"),{error:!0,message:"Jwt Token invalid",code:_package.default.name+">Token>Invalid"}}async getToken(a,b){if(!(a&&""!==a))return this.core.logger.warning(_package.default.name,"Login is empty"),{error:!0,message:"Login is empty",code:"authentification-login-empty"};if(b&&""!==b){let c=await this.sqlUser.getOneByField({login:a});if(c.error)return c;else{let d=c.data;return d?(0,_md.default)(b+d.salt)===d.password?{error:!1,message:"",code:"ok",profile:d.profile,token:_Jwt.default.generateAccessToken(this.core.salt+"~"+a,this.core.configuration.token)}:{error:!0,message:"Password is invalid",code:"authentification-password-invalid"}:{error:!0,message:"Login is invalid",code:"authentification-login-invalid"}}}else return this.core.logger.warning(_package.default.name,"Password is empty"),{error:!0,message:"Password is empty",code:"authentification-password-empty"}}async updateAuthorizationByProfile(a,b,c){let d=await this.sqlAuthorizationProfile.getOneByField({authorization:b,profile:a});if(d.error)return d;if(0===c){let b=await this.sqlAuthorizationProfile.deleteAllByField({profile:a,authorization:settings.authorization});return b.error?b:{error:!1,message:"",code:"ok"}}if(d.data)return{error:!1,message:"",code:"ok"};else{let c=await this.sqlAuthorizationProfile.insert({id:null,authorization:b,profile:a});return c.error?c:{error:!1,message:"",code:"ok"}}}}var _default=Authentification;exports.default=_default,module.exports=exports.default;