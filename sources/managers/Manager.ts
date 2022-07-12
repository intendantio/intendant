class Manager {

    addController(entity) {
        let className = entity.constructor.name
        let lowerClassName = className.toLowerCase()
        this[lowerClassName + "Controller"] = entity
    }

    addManager(entity) {
        let className = entity.constructor.name
        let lowerClassName = className.toLowerCase()
        this[lowerClassName + "Manager"] = entity
    }

}

export default Manager