"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _package=_interopRequireDefault(require("./package.json")),_Routine=_interopRequireDefault(require("./controllers/Routine")),_SmartObject=_interopRequireDefault(require("./controllers/SmartObject")),_Authentification=_interopRequireDefault(require("./controllers/Authentification")),_Process=_interopRequireDefault(require("./controllers/Process")),_Profile=_interopRequireDefault(require("./controllers/Profile")),_Storage=_interopRequireDefault(require("./controllers/Storage")),_Client=_interopRequireDefault(require("./controllers/Client")),_Widget=_interopRequireDefault(require("./controllers/Widget")),_Cache=_interopRequireDefault(require("./controllers/Cache")),_User=_interopRequireDefault(require("./controllers/User")),_Espace=_interopRequireDefault(require("./controllers/Espace")),_Market=_interopRequireDefault(require("./controllers/Market")),_Math=_interopRequireDefault(require("./controllers/tools/Math")),_Smartobject=_interopRequireDefault(require("./managers/Smartobject")),_Modules=_interopRequireDefault(require("./managers/Modules")),_Routine2=_interopRequireDefault(require("./managers/Routine")),_fs=_interopRequireDefault(require("fs"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class Core{constructor(a,b,c){/* Controller */a.tracing==null?(c.verbose=()=>{},c.warning=()=>{},c.error=()=>{}):((a.tracing.verbose==null||!1==a.tracing.verbose)&&(c.verbose=()=>{}),(a.tracing.warning==null||!1==a.tracing.warning)&&(c.warning=()=>{}),(a.tracing.error==null||!1==a.tracing.error)&&(c.error=()=>{})),c.verbose(_package.default.name,"Start Core"),this.configuration=a,this.logger=c,this.connector=b,this.salt=_Math.default.random(16),this.prepare(),this.controller={},this.controller.routine=new _Routine.default(this),this.controller.smartobject=new _SmartObject.default(this),this.controller.authentification=new _Authentification.default(this),this.controller.profile=new _Profile.default(this),this.controller.process=new _Process.default(this),this.controller.storage=new _Storage.default(this),this.controller.client=new _Client.default(this),this.controller.widget=new _Widget.default(this),this.controller.user=new _User.default(this),this.controller.cache=new _Cache.default(this),this.controller.espace=new _Espace.default(this),this.controller.market=new _Market.default(this),setTimeout(()=>{/* Manager */this.manager={},this.manager.smartobject=new _Smartobject.default(this),this.manager.routine=new _Routine2.default(this),this.manager.module=new _Modules.default(this)},100)}prepare(){this.configuration.smartobjects=[],this.configuration.modules=[],!1==_fs.default.existsSync("./.intendant")&&_fs.default.mkdirSync("./.intendant/@intendant",{recursive:!0});let a=_fs.default.readdirSync("./.intendant/@intendant");for(let b,c=0;c<a.length;c++)b=JSON.parse(_fs.default.readFileSync("./.intendant/@intendant/"+a[c]+"/configuration.json").toString()),"smartobject"==b.type?this.configuration.smartobjects.push(b.id):"module"==b.type&&this.configuration.modules.push(b.id)}}var _default=Core;exports.default=_default,module.exports=exports.default;