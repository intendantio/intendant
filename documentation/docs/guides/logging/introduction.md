---
title: Introduction
---

When instantiating a intendant server, you must define a logger module.  
There are two solutions for a intendant server :
- Use an existing module from the following [list](/docs/guides/logging/introduction#basic-logging)
- Create a custom module with [@intendant/tracing](https://www.npmjs.com/package/@intendant/tracing)

## Introduction
The logging module is a static class. 
Each usable method is static, it is not recommended to instantiate  `Logging` to use these methods. 
There are three different levels of logs.

## Implementation
```js 
let tracing = require('my-custom-module')
api.initialisation(
    new Core(configuration,connector,tracing)
)
```
## Usage
```js 
this.logger.verbose("@intendant/smartobject","Message ✔️ verbose ✔️")
this.logger.warning("@intendant/smartobject","Message ⚠️ warning ⚠️")
this.logger.error("@intendant/smartobject","Message ❌ error ❌")
```

## Basic Logging

### [Console](/docs/guides/logging/console)




