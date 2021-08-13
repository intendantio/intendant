---
title: Introduction
---

A module is a **non-fungible** object.

## Introduction

The module library allows to interface a system with a intendant server, each system type must have a dedicated library.

## Configuration

You have to define in the configuration the list of modules to use. 

```json title="intendant.json"
{
    "modules": [
        "@intendant/light-doe-modules",
        "@intendant/light-john-modules"
    ]
}
```

```js title="index.js"
const configuration = require('./intendant.json') 
api.initialisation(
    new core(configuration,adapter,console)
)
```
When the intendant server is launched, the modules are pre-loaded to be available for instantiation.

## Instantiation
The modules are instantiated automatically.
## Basic Module
### [List manager](/docs/concepts/module/list-manager)
### [Recipe manager](/docs/concepts/module/recipe-manager)
### [Weather manager](/docs/concepts/module/weather-manager)