"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("./package.json")),_Routine=_interopRequireDefault(require("./controllers/Routine")),_SmartObject=_interopRequireDefault(require("./controllers/SmartObject")),_Authentification=_interopRequireDefault(require("./controllers/Authentification")),_Process=_interopRequireDefault(require("./controllers/Process")),_Profile=_interopRequireDefault(require("./controllers/Profile")),_Storage=_interopRequireDefault(require("./controllers/Storage")),_Client=_interopRequireDefault(require("./controllers/Client")),_Widget=_interopRequireDefault(require("./controllers/Widget")),_Cache=_interopRequireDefault(require("./controllers/Cache")),_User=_interopRequireDefault(require("./controllers/User")),_Espace=_interopRequireDefault(require("./controllers/Espace")),_Market=_interopRequireDefault(require("./controllers/Market")),_Notification=_interopRequireDefault(require("./controllers/Notification")),_Math=_interopRequireDefault(require("./controllers/tools/Math")),_Smartobject=_interopRequireDefault(require("./managers/Smartobject")),_Modules=_interopRequireDefault(require("./managers/Modules")),_Routine2=_interopRequireDefault(require("./managers/Routine")),_connector=_interopRequireDefault(require("./connector")),_tracing=_interopRequireDefault(require("./tracing")),_fs=_interopRequireDefault(require("fs"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Core{constructor(a){/* Controller */a.tracing==null?(logger.verbose=()=>{},logger.warning=()=>{},logger.error=()=>{}):((a.tracing.verbose==null||!1==a.tracing.verbose)&&(logger.verbose=()=>{}),(a.tracing.warning==null||!1==a.tracing.warning)&&(logger.warning=()=>{}),(a.tracing.error==null||!1==a.tracing.error)&&(logger.error=()=>{})),this.configuration=a,this.logger=_tracing.default,this.connector=_connector.default,this.salt=_package.default.name+"-"+_package.default.version,this.logger.verbose(_package.default.name,"Core : instanciate controller"),this.controller={},this.controller.routine=new _Routine.default(this),this.controller.smartobject=new _SmartObject.default(this),this.controller.authentification=new _Authentification.default(this),this.controller.profile=new _Profile.default(this),this.controller.process=new _Process.default(this),this.controller.storage=new _Storage.default(this),this.controller.client=new _Client.default(this),this.controller.widget=new _Widget.default(this),this.controller.user=new _User.default(this),this.controller.cache=new _Cache.default(this),this.controller.espace=new _Espace.default(this),this.controller.market=new _Market.default(this),this.controller.notification=new _Notification.default(this),setTimeout(()=>{/* Manager */this.logger.verbose(_package.default.name,"Core : instanciate manager"),this.manager={},this.manager.smartobject=new _Smartobject.default(this),this.manager.module=new _Modules.default(this),setTimeout(()=>{this.manager.routine=new _Routine2.default(this)},5e3)},100)}}var _default=Core;exports.default=_default,module.exports=exports.default;