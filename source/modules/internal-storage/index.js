import Package from './package.json'

class InternalListManager {

    constructor(core) {
        this.core = core
    }

    async __setItem(settings = {}) {
        return await this.core.controller.storage.setItem(Package.name + "/" + settings.reference,settings.value)
    }

    async __getItem(settings = {}) {
        return await this.core.controller.storage.getItem(Package.name + "/" + settings.reference)
    }

}

export default InternalListManager