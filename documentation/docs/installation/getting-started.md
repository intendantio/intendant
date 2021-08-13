---
title: Getting Started
---

## Template 

You can download different template with the strcuture files already completed.   

| Label               | Connector                    | Tracing                    | Download                                          |
| ------------------- | ---------------------------- | -------------------------- | ------------------------------------------------- |
| Simple with SQL     | @intendant/sql-connector     | @intendant/console-tracing | [**Template**]("") |
| Simple with MongoDB | @intendant/mongodb-connector | @intendant/console-tracing | [**Template**]("") |

You must complete the  [```intendant.json```](/docs/installation/getting-started#file-configuration)  file

## Custom installation

### Core library 

To custom start, you need to install the core package. It is the heart of the system. 

You can install from npm or yarn

```
npm install -s @intendant/core
```
```
yarn add @intendant/core
```

### File configuration

A structure file in json format is needed to define the different configurations.  
The configuration file must be in the following format : 

```json
{
    "port": "8000",
    "token": "Random token",
    "connector": {},
    "tracing": {},
    "smartobjects": [],
    "modules": []
}
```

`port` is the port number of intendant is hosted.     
`token` is a random text field to encrypt JSON Web Tokens.  
`connector` is a configuration object for the connector module.  
`tracing` is a configuration object for the tracing module.  
`smartobjects` is the list of pre-configured smartobject packages.  
`modules` is the list of pre-configured modules packages.

The configuration file must be put in the root of intendant.

### Entry file

You must create a javascript file to initialise the core by adding the different libraries.

```javascript
const configuration = require('./intendant.json') 

const core = require('@intendant/core')
const api = require('@intendant/core/gateways')

const console = require('@intendant/xxxx-tracing')
const connector = require('@intendant/xxx-connector')

api.initialisation(
    new core(configuration,connector,console)
)
```
## Database installation

You must follow the installation steps of your chosen connector library.  

By default [**```@intendant/sql-connector```**]("") library is used. 


## Starting server 

To start the server you need to start a node instance on your input file.  
By default the file is index.js
```json
node index.js
```