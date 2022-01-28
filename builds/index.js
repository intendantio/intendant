"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("./package.json")),_Routine=_interopRequireDefault(require("./controllers/Routine")),_Smartobject=_interopRequireDefault(require("./controllers/Smartobject")),_Authentification=_interopRequireDefault(require("./controllers/Authentification")),_Process=_interopRequireDefault(require("./controllers/Process")),_Profile=_interopRequireDefault(require("./controllers/Profile")),_Storage=_interopRequireDefault(require("./controllers/Storage")),_Client=_interopRequireDefault(require("./controllers/Client")),_Widget=_interopRequireDefault(require("./controllers/Widget")),_Cache=_interopRequireDefault(require("./controllers/Cache")),_User=_interopRequireDefault(require("./controllers/User")),_Espace=_interopRequireDefault(require("./controllers/Espace")),_Market=_interopRequireDefault(require("./controllers/Market")),_Notification=_interopRequireDefault(require("./controllers/Notification")),_Localisation=_interopRequireDefault(require("./controllers/Localisation")),_Essential=_interopRequireDefault(require("./controllers/Essential")),_Module=_interopRequireDefault(require("./controllers/Module")),_Rapport=_interopRequireDefault(require("./controllers/Rapport")),_gateways=_interopRequireDefault(require("./gateways")),_Smartobject2=_interopRequireDefault(require("./managers/Smartobject")),_Modules=_interopRequireDefault(require("./managers/Modules")),_Routine2=_interopRequireDefault(require("./managers/Routine")),_Rapports=_interopRequireDefault(require("./managers/Rapports")),_Tracing=_interopRequireDefault(require("./utils/Tracing"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Core{constructor(a){/* Manager */ /* Controller */console.clear(),_Tracing.default.welcome(),this.configuration=a,this.salt=_package.default.name,this.manager={},this.manager.smartobject=new _Smartobject2.default(this),this.manager.module=new _Modules.default(this),this.manager.routine=new _Routine2.default(this),this.manager.rapport=new _Rapports.default(this),this.controller={authentification:new _Authentification.default(this.configuration.token,this.salt),smartobject:new _Smartobject.default(this.manager.smartobject),routine:new _Routine.default(this.manager.routine),module:new _Module.default(this.manager.module),market:new _Market.default(this.manager.smartobject,this.manager.module),profile:new _Profile.default,storage:new _Storage.default,client:new _Client.default,user:new _User.default,cache:new _Cache.default,espace:new _Espace.default,notification:new _Notification.default},this.controller.widget=new _Widget.default(this.manager.smartobject,this.manager.module,this.controller.module,this.controller.smartobject),this.controller.rapport=new _Rapport.default(this.manager.rapport,this.controller.widget,this.controller.smartobject),this.controller.localisation=new _Localisation.default(this.controller.smartobject),this.controller.essential=new _Essential.default(this.controller),this.controller.process=new _Process.default(this.manager.smartobject,this.manager.module,this.controller.essential),setTimeout(()=>{this.api=new _gateways.default(this),this.manager.rapport.initialisation()},1e3)}}var _default=Core;exports.default=_default,module.exports=exports.default;