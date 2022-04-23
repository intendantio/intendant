import Package from '../package'
import Controller from './Controller'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'

class Link extends Controller {

    async getAll() {
        try {
            let linksRequest = await this.sqlLink.getAll()
            if (linksRequest.error) {
                return linksRequest
            }
            return new Result(Package.name, false, "", linksRequest.data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all links")
            return new Result(Package.name, true, "Error occurred when get all links")
        }
    }

    async getOne(idLink) {
        try {
            let linksRequest = await this.sqlLink.getOne(idLink)
            if (linksRequest.error) {
                return linksRequest
            }
            if (linksRequest.data == false) {
                Tracing.warning(Package.name, "Link not found")
                return new Result(Package.name, true, "Link not found")
            }
            let smartobjectsRequest = await this.sqlSmartobject.getAllByField({ link: idLink })
            if (smartobjectsRequest.error) {
                return smartobjectsRequest
            }
            linksRequest.data.smartobjects = []

            for (let index = 0; index < smartobjectsRequest.data.length; index++) {
                let smartobject = smartobjectsRequest.data[index]
                let resultSmartobjectGetOne = await this.smartobjectController.getOne(smartobject.id)
                linksRequest.data.smartobjects.push(resultSmartobjectGetOne.data)
            }
            let linkProfileRequest = await this.sqlLinkProfile.getAllByField({ link: idLink })
            if (linkProfileRequest.error) {
                return linkProfileRequest
            }
            linksRequest.data.profiles = linkProfileRequest.data
            return new Result(Package.name, false, "", linksRequest.data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one links")
            return new Result(Package.name, true, "Error occurred when get one links")
        }
    }



    async insert(pLink) {
        pLink.name = pLink.name.toLowerCase()
        try {
            let data = { id: null, name: pLink.name, room: pLink.room }
            let getAllRequest = await this.sqlLink.getAllByField({ name: pLink.name })
            if (getAllRequest.error) {
                return getAllRequest
            }
            if (getAllRequest.data.length > 0) {
                Tracing.warning(Package.name, "Link already exist")
                return new Result(Package.name, true, "Link already exist")
            }
            let insertRequest = await this.sqlLink.insert(data)
            if (insertRequest.error) {
                return insertRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert link")
            return new Result(Package.name, true, "Error occurred when insert link")
        }
    }

    async delete(idLink) {
        try {
            let smartobjectsRequest = await this.sqlSmartobject.getAllByField({ link: idLink })
            if (smartobjectsRequest.error) {
                return smartobjectsRequest
            }
            if (smartobjectsRequest.data.length > 0) {
                Tracing.warning(Package.name, "Cannot delete an link when it contain an smartobject")
                return new Result(Package.name, true, "Cannot delete an link when it contain an smartobject")
            }
            let linkRequest = await this.sqlLink.deleteOne(idLink)
            if (linkRequest.error) {
                return linkRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete link")
            return new Result(Package.name, true, "Error occurred when delete link")
        }
    }

    async insertLinkProfile(idLink, idProfile) {
        try {
            let linkRequest = await this.sqlLink.getOne(idLink)
            if (linkRequest.error) {
                return linkRequest
            }
            let link = linkRequest.data
            let profileRequest = await this.sqlLinkProfile.getOneByField({ link: idLink, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile === false) {
                let insertProfile = await this.sqlLinkProfile.insert({ id: null, link: link.id, profile: idProfile })
                if (insertProfile.error) {
                    return insertProfile
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert link profile")
            return new Result(Package.name, true, "Error occurred when insert link profile")
        }

    }

    async deleteLinkProfile(idLink, idProfile) {
        try {
            let linkRequest = await this.sqlLink.getOne(idLink)
            if (linkRequest.error) {
                return linkRequest
            }
            let profileRequest = await this.sqlLinkProfile.getOneByField({ link: idLink, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile) {
                let deleteProfileRequest = await this.sqlLinkProfile.deleteAllByField({ id: profile.id })
                if (deleteProfileRequest.error) {
                    return deleteProfileRequest
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete link profile")
            return new Result(Package.name, true, "Error occurred when delete link profile")
        }

    }

}

export default Link