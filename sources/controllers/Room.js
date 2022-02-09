import Package from '../package'
import Controller from './Controller'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'

class Room extends Controller {

    constructor(smartobjectController) {
        super()
        this.smartobjectController = smartobjectController
    }

    async getAll() {
        try {
            let roomsRequest = await this.sqlRoom.getAll()
            if (roomsRequest.error) {
                return roomsRequest
            }
            return new Result(Package.name, false, "", roomsRequest.data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all rooms")
            return new Result(Package.name, true, "Error occurred when get all rooms")
        }
    }

    async getOne(idRoom) {
        try {
            let roomsRequest = await this.sqlRoom.getOne(idRoom)
            if (roomsRequest.error) {
                return roomsRequest
            }
            if (roomsRequest.data == false) {
                Tracing.warning(Package.name, "Room not found")
                return new Result(Package.name, true, "Room not found")
            }
            let smartobjectsRequest = await this.sqlSmartobject.getAllByField({ room: idRoom })
            if (smartobjectsRequest.error) {
                return smartobjectsRequest
            }
            roomsRequest.data.smartobjects = []

            for (let index = 0; index < smartobjectsRequest.data.length; index++) {
                let smartobject = smartobjectsRequest.data[index]
                let resultSmartobjectGetOne = await this.smartobjectController.getOne(smartobject.id)
                roomsRequest.data.smartobjects.push(resultSmartobjectGetOne.data)
            }
            let roomProfileRequest = await this.sqlRoomProfile.getAllByField({ room: idRoom })
            if (roomProfileRequest.error) {
                return roomProfileRequest
            }
            roomsRequest.data.profiles = roomProfileRequest.data
            return new Result(Package.name, false, "", roomsRequest.data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one rooms")
            return new Result(Package.name, true, "Error occurred when get one rooms")
        }
    }



    async insert(pRoom) {
        pRoom.name = pRoom.name.toLowerCase()
        try {
            let data = { id: null, name: pRoom.name, description: pRoom.description, icon: pRoom.icon }
            let getAllRequest = await this.sqlRoom.getAllByField({ name: pRoom.icon })
            if (getAllRequest.error) {
                return getAllRequest
            }
            if (getAllRequest.data.length > 0) {
                Tracing.warning(Package.name, "Room already exist")
                return new Result(Package.name, true, "Room already exist")
            }
            let insertRequest = await this.sqlRoom.insert(data)
            if (insertRequest.error) {
                return insertRequest
            } else {
                return new Result(Package.name, false, "")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert room")
            return new Result(Package.name, true, "Error occurred when insert room")
        }
    }

    async delete(idRoom) {
        try {
            let smartobjectsRequest = await this.sqlSmartobject.getAllByField({ room: idRoom })
            if (smartobjectsRequest.error) {
                return smartobjectsRequest
            }
            if (smartobjectsRequest.data.length > 0) {
                Tracing.warning(Package.name, "Cannot delete an room when it contain an smartobject")
                return new Result(Package.name, true, "Cannot delete an room when it contain an smartobject")
            }
            let roomRequest = await this.sqlRoom.deleteOne(idRoom)
            if (roomRequest.error) {
                return roomRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete room")
            return new Result(Package.name, true, "Error occurred when delete room")
        }
    }

    async insertRoomProfile(idRoom, idProfile) {
        try {
            let roomRequest = await this.sqlRoom.getOne(idRoom)
            if (roomRequest.error) {
                return roomRequest
            }
            let room = roomRequest.data
            let profileRequest = await this.sqlRoomProfile.getOneByField({ room: idRoom, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile === false) {
                let insertProfile = await this.sqlRoomProfile.insert({ id: null, room: room.id, profile: idProfile })
                if (insertProfile.error) {
                    return insertProfile
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert room profile")
            return new Result(Package.name, true, "Error occurred when insert room profile")
        }

    }

    async deleteRoomProfile(idRoom, idProfile) {
        try {
            let roomRequest = await this.sqlRoom.getOne(idRoom)
            if (roomRequest.error) {
                return roomRequest
            }
            let profileRequest = await this.sqlRoomProfile.getOneByField({ room: idRoom, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile) {
                let deleteProfileRequest = await this.sqlRoomProfile.deleteAllByField({ id: profile.id })
                if (deleteProfileRequest.error) {
                    return deleteProfileRequest
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete room profile")
            return new Result(Package.name, true, "Error occurred when delete room profile")
        }

    }


    /* Déprécié */
    async executeAction(idRoom, idAction, settings) {

        let roomRequest = await this.sqlRoom.getOne(idRoom)
        if (roomRequest.error) {
            return roomRequest
        }
        if (roomRequest.data == false) {
            Tracing.warning(Package.name, "Room not found")
            return new Result(Package.name, true, "Room not found")
        }

        let smartobjectRoom = await this.sqlSmartobject.getAllByField({ room: idRoom })
        if (smartobjectRoom.error) {
            return smartobjectRoom
        }

        let actions = []


        smartobjectRoom.data.forEach(data => {
            let ppackage = require(data.module + "/package.json")
            ppackage.actions.forEach(action => {
                if (action.alias == idAction) {
                    actions.push({
                        id: data.id,
                        action: action
                    })
                }
            })
        })

        actions.forEach(async (action) => {
            await this.smartobjectController.executeAction(action.id, action.action.id, 1, settings, false)
        })

        return new Result(Package.name, false, "")

    }

}

export default Room