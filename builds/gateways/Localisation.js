"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _default=(a,b)=>{//Get all localisations
//Get one localisations
//Insert localisations
// Execute action by localisation
//Delete localisations
// Insert localisation profiles
// Delete localisation profiles
a.get("/api/localisations",async(a,c)=>{a.url="/localisations";let d=await b.controller.authentification.checkAuthorization(a);d.error?c.send(d):c.send(await b.controller.localisation.getAll())}),a.get("/api/localisations/:idLocalisation",async(a,c)=>{a.url="/localisations/:idLocalisation";let d=await b.controller.authentification.checkAuthorization(a);d.error?c.send(d):c.send(await b.controller.localisation.getOne(a.params.idLocalisation))}),a.post("/api/localisations",async(a,c)=>{a.url="/localisations";let d=await b.controller.authentification.checkAuthorization(a);d.error?c.send(d):c.send(await b.controller.localisation.insert(a.body.name))}),a.post("/api/localisations/:idLocalisation/actions/:idAction",async(a,c)=>{a.url="/localisations/:idLocalisation/actions/:idAction";let d=await b.controller.authentification.checkAuthorization(a);d.error?c.send(d):c.send(await b.controller.localisation.executeAction(a.params.idLocalisation,a.params.idAction,a.body.settings))}),a.delete("/api/localisations/:idLocalisation",async(a,c)=>{a.url="/localisations/:idLocalisation";let d=await b.controller.authentification.checkAuthorization(a);d.error?c.send(d):c.send(await b.controller.localisation.delete(a.params.idLocalisation))}),a.post("/api/localisations/:idLocalisation/profiles",async(a,c)=>{a.url="/localisations/:idLocalisation/profiles";let d=await b.controller.authentification.checkAuthorization(a);d.error?c.send(d):c.send(await b.controller.localisation.insertLocalisationProfile(a.params.idLocalisation,a.body.idProfile))}),a.delete("/api/localisations/:idLocalisation/profiles/:idProfile",async(a,c)=>{a.url="/localisations/:idLocalisation/profiles/:idProfile";let d=await b.controller.authentification.checkAuthorization(a);d.error?c.send(d):c.send(await b.controller.localisation.deleteLocalisationProfile(a.params.idLocalisation,a.params.idProfile))})};exports.default=_default,module.exports=exports.default;