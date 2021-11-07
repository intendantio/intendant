const configuration = require('./intendant.json')
const core = require('@intendant/core')
const api = require('@intendant/core/gateways')

api.initialisation(
    new core(configuration)
)
