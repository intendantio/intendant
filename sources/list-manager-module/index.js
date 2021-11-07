import Package from './package.json'

class InternalListManager {

    constructor(core) {
        this.storageKey = Package.name
        this.core = core
        this.lists = {}
        this.initialisation()
    }

    async initialisation() {
        let storageList = await this.core.controller.storage.getItem(Package.name)
        if (storageList && storageList.data.lists) {
            this.lists = storageList.data.lists
        } else {
            await this.core.controller.storage.setItem(Package.name, { lists: {}})
        }
    }

    async synchronize() {
        await this.core.controller.storage.setItem(Package.name, { lists: this.lists })
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

    async __getSize(settings = {}) {
        if (settings.reference) {
            if (this.lists[settings.reference]) {
                return {
                    error: false,
                    package: Package.name,
                    message: '',
                    data: {
                        size: this.lists[settings.reference].length
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
                message: 'Reference is missing'
            }
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
                await this.synchronize()
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
                    await this.synchronize()
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
                        await this.synchronize()
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
                await this.synchronize()
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
                await this.synchronize()
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