"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _default=(a,b)=>{a.post("/api/markets/install",async(a,c)=>{a.url="/markets/install";let d=await b.controller.authentification.checkAuthorization(a);d.error?c.send(d):c.send(await b.controller.market.install(a.body.package))}),a.post("/api/markets/uninstall",async(a,c)=>{a.url="/markets/uninstall";let d=await b.controller.authentification.checkAuthorization(a);d.error?c.send(d):c.send(await b.controller.market.uninstall(a.body.package))})};exports.default=_default,module.exports=exports.default;