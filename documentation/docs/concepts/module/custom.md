---
title: Custom Module
---
The strength of a intendant server is that it can interface any smartobject to worlds. Some smartobject modules are missing in the [list](/docs/concepts/smartobject#basic-smartobject), it is necessary to create a custom module. 

## File Structure
`index.js` is the entry point of the module.  
`package.json` is a [package npm](https://docs.npmjs.com/cli/v7/configuring-npm/package-json) type file.  
`configuration.json` is the smartobject definition file.
```txt
 /my-custom-module
    |-index.js
    |-package.json
    |-configuration.json
```

## File Configuration (configuration.json)
The configuration file must define :
- The identifier 
- The name
- The icon ([eva icon](https://akveo.github.io/eva-icons))
- The settings
- The actions

### Identifier
The identifier is the reference of the smartobject which represents the package name in the `package.json` file. 
### Name
The name used in the administrator panel. 
### Icon
Icon will be displayed on the mobile application. You have to refer to the [eva icon](https://akveo.github.io/eva-icons) list.
### Settings
The settings are fields to fill in when instantiating the smartobject.  
The `type` of settings available :
- `string`
- `number`
- `colorpicker` (ex #000000)
### Actions
Each action of the smartobject must be defined.  
An action is composed of an `id`, `name`, `description` and a list of `settings`.  
`id` is the name of the method.  
`settings` has the same structure as the constructor settings.  

### Example

```json title="configuration.json"
{
    "id":"@organization/my-custom-module",
    "name":"my-custom-module",
    "type": "module",
    "icon":"eva-icon",
    "settings": [
        {
            "id": "id",
            "type": "string",
            "name": "name-id"
        }
    ],
    "actions": [
        {
            "id": "getExample",
            "name": "Get example",
            "description": "Get example data",
            "settings": [
                {
                    "id": "color",
                    "type": "colorpicker",
                    "name": "select an color"
                }
            ]
        }
    ]
}
```
## Class
To create a custom smartobject, you must extend the abstract class [@intendant/smartobject](https://www.npmjs.com/package/@intendant/smartobject).
```js title="index.js"
const smartobject = require("@intendant/smartobject") 

class MyCustomModule extends smartobject  {

}
```

## Constructor
Don't forget to use the `super()` statement to initialize the module properly.  
Constructor :
- `settings` is the constructor [settings](/docs/concepts/smartobject#settings)
- `logger` is an instance of [tracing](/docs/concepts/logging)  
- `core` is an instance of [core](/docs/concepts/core)  

```js
constructor(settings, logger, core) {
    let configuration = require('./configuration.json')
    super(settings, logger, core, configuration)
}
```
## Methods

You must define the method with a `__{id}` prefix.
```javascript
async __getExample(settings = {}) {
    /* ... */
    return {
        code: "ok",
        message: "",
        error: false
    }
}
```

The format of return must be :
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```
