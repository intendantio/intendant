const configuration = require('./intendant.json') 
const console = require('@intendant/console-tracing')
const core = require('@intendant/core')
const connector = require('@intendant/sqlite-connector')
const api = require('@intendant/core/gateways')

api.initialisation(
    new core(configuration,connector,console)
)
