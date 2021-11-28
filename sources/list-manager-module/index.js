import Package from './package.json'

class InternalListManager {

    constructor(core) {
        this.core = core
        this.lists = {}
        this.initialisation()
    }

    async initialisation() {
        let resultStorage = await this.core.controller.storage.getItem(Package.name)
        if(resultStorage.error) {
            return resultStorage
        }
        if (resultStorage.data) {
            this.lists = resultStorage.data
        } else {
            await this.core.controller.storage.setItem(Package.name,{})
        }
    }


    async __getAll(settings = {}) {
        let _lists = []
        for (let keyList in this.lists) {
            _lists.push(keyList)
        }
        return {
            error: false,
            package: Package.name,
            message: '',
            data: _lists
        }
    }

    async __getOne(settings = {}) {
        if (settings.reference) {
            if (this.lists[settings.reference]) {
                return {
                    error: false,
                    package: Package.name,
                    message: '',
                    data: this.lists[settings.reference]
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: 'List is missing'
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: 'Reference is missing'
            }
        }
    }

    async __create(settings = {}) {
        if (settings.reference) {
            if (this.lists[settings.reference]) {
                return {
                    error: true,
                    package: Package.name,
                    message: 'List already exist'
                }
            } else {
                this.lists[settings.reference] = []
                await this.core.controller.storage.setItem(Package.name, this.lists)
                return {
                    error: false,
                    package: Package.name,
                    message: ''
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: 'Reference is missing'
            }
        }
    }

    async __add(settings = {}) {
        if (settings.reference) {
            if (settings.item) {
                if (this.lists[settings.reference]) {
                    this.lists[settings.reference].push(settings.item)
                    await this.core.controller.storage.setItem(Package.name, this.lists)
                    return {
                        error: false,
                        package: Package.name,
                        message: ''
                    }
                } else {
                    return {
                        error: true,
                        package: Package.name,
                        message: 'List is missing'
                    }
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: 'Item is missing'
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: 'Reference is missing'
            }
        }
    }

    async __remove(settings = {}) {
        if (settings.reference) {
            if (settings.index) {
                if (this.lists[settings.reference]) {
                    if (this.lists[settings.reference][settings.index]) {
                        this.lists[settings.reference].splice(settings.index, 1)
                        await this.core.controller.storage.setItem(Package.name, this.lists )
                        return {
                            error: false,
                            package: Package.name,
                            message: ''
                        }
                    } else {
                        return {
                            error: true,
                            package: Package.name,
                            message: 'Index invalid'
                        }
                    }
                } else {
                    return {
                        error: true,
                        package: Package.name,
                        message: 'List is missing'
                    }
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: 'Index is missing'
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: 'Reference is missing'
            }
        }
    }

    async __clear(settings = {}) {
        if (settings.reference) {
            if (this.lists[settings.reference]) {
                this.lists[settings.reference] = []
                await this.core.controller.storage.setItem(Package.name, this.lists )
                return {
                    error: false,
                    package: Package.name,
                    message: ''
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: 'List is missing'
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: 'Reference is missing'
            }
        }
    }

    async __delete(settings = {}) {
        if (settings.reference) {
            if (this.lists[settings.reference]) {
                delete this.lists[settings.reference]
                await this.core.controller.storage.setItem(Package.name, this.lists)
                return {
                    error: false,
                    package: Package.name,
                    message: ''
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: 'List is missing'
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: 'Reference is missing'
            }
        }
    }


}

export default InternalListManager