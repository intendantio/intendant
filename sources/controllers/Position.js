import Package from '../package'
import Controller from './Controller'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'

class Position extends Controller {

    async getAll() {
        try {
            let positionsRequest = await this.sqlPosition.getAll()
            if (positionsRequest.error) {
                return positionsRequest
            }
            return new Result(Package.name, false, "", positionsRequest.data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all positions")
            return new Result(Package.name, true, "Error occurred when get all positions")
        }
    }

    async getOne(idPosition) {
        try {
            let positionsRequest = await this.sqlPosition.getOne(idPosition)
            if (positionsRequest.error) {
                return positionsRequest
            }
            if (positionsRequest.data == false) {
                Tracing.warning(Package.name, "Position not found")
                return new Result(Package.name, true, "Position not found")
            }
            let smartobjectsRequest = await this.sqlSmartobject.getAllByField({ position: idPosition })
            if (smartobjectsRequest.error) {
                return smartobjectsRequest
            }
            positionsRequest.data.smartobjects = []

            for (let index = 0; index < smartobjectsRequest.data.length; index++) {
                let smartobject = smartobjectsRequest.data[index]
                let resultSmartobjectGetOne = await this.smartobjectController.getOne(smartobject.id)
                positionsRequest.data.smartobjects.push(resultSmartobjectGetOne.data)
            }
            let positionProfileRequest = await this.sqlPositionProfile.getAllByField({ position: idPosition })
            if (positionProfileRequest.error) {
                return positionProfileRequest
            }
            positionsRequest.data.profiles = positionProfileRequest.data
            return new Result(Package.name, false, "", positionsRequest.data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one positions")
            return new Result(Package.name, true, "Error occurred when get one positions")
        }
    }



    async insert(pPosition) {
        pPosition.name = pPosition.name.toLowerCase()
        try {
            let data = { id: null, name: pPosition.name }
            let getAllRequest = await this.sqlPosition.getAllByField({ name: pPosition.name })
            if (getAllRequest.error) {
                return getAllRequest
            }
            if (getAllRequest.data.length > 0) {
                Tracing.warning(Package.name, "Position already exist")
                return new Result(Package.name, true, "Position already exist")
            }
            let insertRequest = await this.sqlPosition.insert(data)
            if (insertRequest.error) {
                return insertRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert position")
            return new Result(Package.name, true, "Error occurred when insert position")
        }
    }

    async delete(idPosition) {
        try {
            let smartobjectsRequest = await this.sqlSmartobject.getAllByField({ position: idPosition })
            if (smartobjectsRequest.error) {
                return smartobjectsRequest
            }
            if (smartobjectsRequest.data.length > 0) {
                Tracing.warning(Package.name, "Cannot delete an position when it contain an smartobject")
                return new Result(Package.name, true, "Cannot delete an position when it contain an smartobject")
            }
            let positionRequest = await this.sqlPosition.deleteOne(idPosition)
            if (positionRequest.error) {
                return positionRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete position")
            return new Result(Package.name, true, "Error occurred when delete position")
        }
    }

    async insertPositionProfile(idPosition, idProfile) {
        try {
            let positionRequest = await this.sqlPosition.getOne(idPosition)
            if (positionRequest.error) {
                return positionRequest
            }
            let position = positionRequest.data
            let profileRequest = await this.sqlPositionProfile.getOneByField({ position: idPosition, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile === false) {
                let insertProfile = await this.sqlPositionProfile.insert({ id: null, position: position.id, profile: idProfile })
                if (insertProfile.error) {
                    return insertProfile
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert position profile")
            return new Result(Package.name, true, "Error occurred when insert position profile")
        }

    }

    async deletePositionProfile(idPosition, idProfile) {
        try {
            let positionRequest = await this.sqlPosition.getOne(idPosition)
            if (positionRequest.error) {
                return positionRequest
            }
            let profileRequest = await this.sqlPositionProfile.getOneByField({ position: idPosition, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile) {
                let deleteProfileRequest = await this.sqlPositionProfile.deleteAllByField({ id: profile.id })
                if (deleteProfileRequest.error) {
                    return deleteProfileRequest
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete position profile")
            return new Result(Package.name, true, "Error occurred when delete position profile")
        }

    }

}

export default Position