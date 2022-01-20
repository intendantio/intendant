import Package from '../package'
import Controller from './Controller'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'

class Localisation extends Controller {

    constructor(smartobjectController) {
        super()
        this.smartobjectController = smartobjectController
    }

    async getAll() {
        try {
            let localisationsRequest = await this.sqlLocalisation.getAll()
            if (localisationsRequest.error) {
                return localisationsRequest
            }
            return new Result(Package.name, false, "", localisationsRequest.data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all localisations")
            return new Result(Package.name, true, "Error occurred when get all localisations")
        }
    }

    async getOne(idLocalisation) {
        try {
            let localisationsRequest = await this.sqlLocalisation.getOne(idLocalisation)
            if (localisationsRequest.error) {
                return localisationsRequest
            }
            let smartobjectsRequest = await this.sqlSmartobject.getAllByField({localisation: idLocalisation})
            if(smartobjectsRequest.error) {
                return smartobjectsRequest
            }
            localisationsRequest.data.smartobjects = []

            for (let index = 0; index < smartobjectsRequest.data.length; index++) {
                let smartobject = smartobjectsRequest.data[index]
                let resultSmartobjectGetOne = await this.smartobjectController.getOne(smartobject.id)
                localisationsRequest.data.smartobjects.push(resultSmartobjectGetOne.data) 
            }
            let localisationProfileRequest = await this.sqlLocalisationProfile.getAllByField({ localisation: idLocalisation })
            if (localisationProfileRequest.error) {
                return localisationProfileRequest
            }
            localisationsRequest.data.profiles = localisationProfileRequest.data
            return new Result(Package.name, false, "", localisationsRequest.data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one localisations")
            return new Result(Package.name, true, "Error occurred when get one localisations")
        }
    }



    async insert(name) {
        name = name.toLowerCase()
        try {
            if (name) {
                let data = { id: null, name: name }

                let getAllRequest = await this.sqlLocalisation.getAllByField({name:name})

                if(getAllRequest.error) {
                    return getAllRequest
                }

                if(getAllRequest.data.length > 0) {
                    Tracing.warning(Package.name, "Localisation already exist")
                    return new Result(Package.name,true,"Localisation already exist") 
                }

                let insertRequest = await this.sqlLocalisation.insert(data)
                if (insertRequest.error) {
                    return insertRequest
                } else {
                    return new Result(Package.name, false, "")
                }
            } else {
                Tracing.warning(Package.name, "Missing name")
                return new Result(Package.name, true, "Missing name")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert localisation")
            return new Result(Package.name, true, "Error occurred when insert localisation")
        }
    }

    async delete(idLocalisation) {
        try {
            let smartobjectsRequest = await this.sqlSmartobject.getAllByField({localisation: idLocalisation})
            if(smartobjectsRequest.error) {
                return smartobjectsRequest
            }
            if(smartobjectsRequest.data.length > 0 ) {
                Tracing.warning(Package.name, "Cannot delete an room when it contain an smartobject")
                return new Result(Package.name, true, "Cannot delete an room when it contain an smartobject")
            }
            let localisationRequest = await this.sqlLocalisation.deleteOne(idLocalisation)
            if (localisationRequest.error) {
                return localisationRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete localisation")
            return new Result(Package.name, true, "Error occurred when delete localisation")
        }
    }

    async insertLocalisationProfile(idLocalisation, idProfile) {
        try {
            let localisationRequest = await this.sqlLocalisation.getOne(idLocalisation)
            if (localisationRequest.error) {
                return localisationRequest
            }
            let localisation = localisationRequest.data
            let profileRequest = await this.sqlLocalisationProfile.getOneByField({ localisation: idLocalisation, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile === false) {
                let insertProfile = await this.sqlLocalisationProfile.insert({ id: null, localisation: localisation.id, profile: idProfile })
                if (insertProfile.error) {
                    return insertProfile
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert localisation profile")
            return new Result(Package.name, true, "Error occurred when insert localisation profile")
        }

    }

    async deleteLocalisationProfile(idLocalisation, idProfile) {
        try {
            let localisationRequest = await this.sqlLocalisation.getOne(idLocalisation)
            if (localisationRequest.error) {
                return localisationRequest
            }
            let profileRequest = await this.sqlLocalisationProfile.getOneByField({ localisation: idLocalisation, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile) {
                let deleteProfileRequest = await this.sqlLocalisationProfile.deleteAllByField({ id: profile.id })
                if (deleteProfileRequest.error) {
                    return deleteProfileRequest
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete localisation profile")
            return new Result(Package.name, true, "Error occurred when delete localisation profile")
        }

    }

    async executeAction(idLocalisation,idAction,settings) {
        
        let localisationRequest = await this.sqlLocalisation.getOne(idLocalisation)
        if (localisationRequest.error) {
            return localisationRequest
        }
        if(localisationRequest.data == false) {
            Tracing.warning(Package.name, "Localisation not found")
            return new Result(Package.name, true, "Localisation not found")
        }

        let smartobjectLocalisation = await this.sqlSmartobject.getAllByField({localisation: idLocalisation})
        if(smartobjectLocalisation.error) {
            return smartobjectLocalisation
        }

        let actions = []


        smartobjectLocalisation.data.forEach(data => {
            let ppackage = require(data.module + "/package.json")
            ppackage.actions.forEach(action => {
                if(action.alias == idAction) {
                    actions.push({
                        id: data.id,
                        action: action
                    })
                }
            })
        })

        actions.forEach(async (action) => {
            await this.smartobjectController.executeAction(action.id,action.action.id,1,settings,false)
        })

        return new Result(Package.name,false,"")

    }

}

export default Localisation