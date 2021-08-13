---
title: Introduction
---

Smartobject is a fungible object.

## Introduction

The smartobject library allows to interface a connected object with a intendant server, each object model must have a dedicated library.

## Configuration

You have to define in the configuration the list of smartobjects to use. 

```json title="intendant.json"
{
    "smartobjects": [
        "@intendant/light-doe-smartobject",
        "@intendant/light-john-smartobject"
    ]
}
```

```js title="index.js"
const configuration = require('./intendant.json') 
api.initialisation(
    new core(configuration,adapter,console)
)
```
When the intendant server is launched, the smartobjects are pre-loaded to be available for instantiation.

## Instantiation

The smartobjects already configured are instantiated at the launch of the server-pegasus.  
To generate a new instance of a smartobject, you must use the [web api](/docs/concepts/api#smartobject).

## Basic Smartobject

### [Philips Hue light](/docs/concepts/smartobject/philips-hue-light)
Control the [Hue bulb](https://www.philips-hue.com/fr-fr/products/smart-lightbulbs) in your home to adjust brightness and color.
### [Philips Hue sensor](/docs/concepts/smartobject/philips-hue-sensor)
Control the [Hue motion sensor](https://www.philips-hue.com/fr-fr/p/hue-detecteur-de-mouvement/8718696743171) in your home.
### [Philips Hue smart plug](/docs/concepts/smartobject/philips-smart-plug)
Control the [Hue plug](https://www.philips-hue.com/fr-fr/p/hue-prise-intelligente/8718699689322) in your home. 
### [Netatmo Home Coach](/docs/concepts/smartobject/netatmo-home-coach)
Control and get information from the [Netatmo Home Coach](https://www.netatmo.com/fr-fr/aircare/homecoach).