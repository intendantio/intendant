---
title: Custom Smartobject
---

The strength of a intendant server is that it can interface any smartobject.  
Some smartobject are missing in the market, it is necessary to create a custom smartobject.  

## File Structure
`index.js` is the entry point of the smartobject.  
`configuration.json` is the smartobject definition file.  
`package.json` is a file to define dependencies.
```txt
 /my-custom-smartobject
    |-index.js
    |-package.json
    |-configuration.json
```


## File Configuration (configuration.json)
The configuration file must define :
- Reference 
- Name
- Icon ([eva icon](https://akveo.github.io/eva-icons))
- Actions
- Type must be `smartobject`

### Identifier
The identifier is the reference of the module which represents the package name in the `package.json` file. 
### Name
The usual name of the module 
### Icon
Icon will be displayed on the mobile application and dashboard admin. You have to refer to the [eva icon list](https://akveo.github.io/eva-icons).

### Settings

Settings are information sent when creating an instance of a smartobject.  

Constructor setting is composed of :  
- `id` is an reference (String)
- `name` to describe this setting (String)
- `type` is one of the [following list](/docs/guides/smartobject/custom#settings-type) (String)


### Actions
Each action of the module must be defined.  

Action is composed of : 
- `id` is an reference (String)
- `name` is an name (String)
- `description` is an description (String)
- `settings` is an array of settings (Array)
 
#### Action settings

Action setting is composed of :  
- `id` is an reference (String)
- `default` is an default value (Any)
- `type` is one of the [following list](/docs/guides/smartobject/custom#settings-type) (String)

#### Type
The different types : 
- `string` : simple textinput
- `number` : custom textinput with only numbers
- `slider` : custom slider to define `min`, `max` and `step` value
- `colorpicker` : field is a list of 16 selectable colors and a text field to define the hexadecimal color
- `select` : picker field that is included in a list of `values`


### Example

```json title="configuration.json"
{
    "id":"@organization/my-custom-smartobject",
    "name":"my-custom-smartobject",
    "type": "smartobject",
    "icon":"eva-icon",
    "settings": [
        {
            "id": "id",
            "type": "string",
            "name": "name"
        }
    ],
    "actions": [
        {
            "id": "turnOn",
            "name": "Turn on light",
            "description": "Turn on personal light",
            "settings": [
                {
                    "id": "color",
                    "type": "colorpicker",
                    "default":"#000000"
                },
                {
                    "id": "brigthness",
                    "type": "slider",
                    "min": 0,
                    "max": 100,
                    "step": 1,
                    "default": 0
                },
                {
                    "id": "type",
                    "type": "select",
                    "default": "circle",
                    "values": [
                        "circle",
                        "square",
                        "hexadecimal"
                    ]
                }
            ]
        },
        {
            "id": "turnOff",
            "name": "Turn off",
            "description": "Turn off light",
            "settings": []
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

```js
constructor(settings, logger, core) {
    let configuration = require('./configuration.json')
    super(settings, logger, core, configuration)
}
```
## Methods

Define the method with a `__{id}` prefix.
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

Return format must be :
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```



