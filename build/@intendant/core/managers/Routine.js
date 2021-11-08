"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _Routine=_interopRequireDefault(require("../instances/Routine")),_package=_interopRequireDefault(require("../package"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}class RoutineCore{constructor(a){this.core=a,this.logger=a.logger,this.configuration=this.core.configuration,this.routines=new Map,this.logger.verbose(_package.default.name,"Start Routine Manager"),this.initialisation()}async initialisation(){this.logger.verbose(_package.default.name,"Update routine");let a=new this.core.connector(this.configuration,this.core,"routine"),b=await a.getAll();if(b.error)return void this.logger.warning(_package.default.name,b.message);let c=b.data;c.forEach(async a=>{let b=this.routines.has(a.id);if(0===a.status&&b)this.logger.verbose(_package.default.name,"Disable routine n\xB0"+a.id),this.routines.get(a.id).close(),this.routines.delete(a.id);else if(1===a.status&&!1===b){this.logger.verbose(_package.default.name,"Enable routine n\xB0"+a.id);let b=await this.core.controller.routine.getOne(a.id);a=b.data,this.routines.set(a.id,new _Routine.default(a,this.core))}})}}var _default=RoutineCore;exports.default=_default,module.exports=exports.default;