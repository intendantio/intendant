"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _express=_interopRequireDefault(require("express")),_bodyParser=_interopRequireDefault(require("body-parser")),cors=_interopRequireWildcard(require("cors")),_package=_interopRequireDefault(require("../package.json")),_Smartobject=_interopRequireDefault(require("./Smartobject")),_User=_interopRequireDefault(require("./User")),_Profile=_interopRequireDefault(require("./Profile")),_Routine=_interopRequireDefault(require("./Routine")),_Process=_interopRequireDefault(require("./Process")),_Authentification=_interopRequireDefault(require("./Authentification")),_Authorization=_interopRequireDefault(require("./Authorization")),_Module=_interopRequireDefault(require("./Module")),_Ping=_interopRequireDefault(require("./Ping")),_GetStarted=_interopRequireDefault(require("./GetStarted")),_Client=_interopRequireDefault(require("./Client")),_Widget=_interopRequireDefault(require("./Widget")),_Configuration=_interopRequireDefault(require("./Configuration")),_Market=_interopRequireDefault(require("./Market")),_Tracing=_interopRequireDefault(require("../utils/Tracing"));function _getRequireWildcardCache(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(_getRequireWildcardCache=function(a){return a?c:b})(a)}function _interopRequireWildcard(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=_getRequireWildcardCache(b);if(c&&c.has(a))return c.get(a);var d={},e=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var f in a)if("default"!=f&&Object.prototype.hasOwnProperty.call(a,f)){var g=e?Object.getOwnPropertyDescriptor(a,f):null;g&&(g.get||g.set)?Object.defineProperty(d,f,g):d[f]=a[f]}return d.default=a,c&&c.set(a,d),d}function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class API{constructor(a){const b=(0,_express.default)();b.use(_bodyParser.default.json({limit:"50mb",extended:!0})),b.use(cors.default()),b.use("/admin",_express.default.static(__dirname+"/../public")),b.use("/admin/*",_express.default.static(__dirname+"/../public")),(0,_Authorization.default)(b,a),(0,_Authentification.default)(b,a),(0,_Smartobject.default)(b,a),(0,_User.default)(b,a),(0,_Profile.default)(b,a),(0,_Routine.default)(b,a),(0,_Process.default)(b,a),(0,_Module.default)(b,a),(0,_Ping.default)(b,a),(0,_GetStarted.default)(b,a),(0,_Client.default)(b,a),(0,_Widget.default)(b,a),(0,_Configuration.default)(b,a),(0,_Market.default)(b,a),b.use((a,b)=>{b.redirect("/admin")}),b.listen(a.configuration.port,()=>{_Tracing.default.verbose(_package.default.name,"Gateway : Instanciate Intendant"),_Tracing.default.verbose(_package.default.name,"Gateway : start listening localhost:"+a.configuration.port)})}}var _default=API;exports.default=_default,module.exports=exports.default;