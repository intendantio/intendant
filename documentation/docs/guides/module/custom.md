---
title: Custom Module
---
The strength of a intendant server is that it can interface any module.  
Some module are missing in the market, it is necessary to create a custom module. 

## File Structure
`index.js` is the entry point of the module.  
`configuration.json` is the module definition file.  
`package.json` is a file to define dependencies.
```txt
 /my-custom-module
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
- Type must be `module`

### Identifier
The identifier is the reference of the module which represents the package name in the `package.json` file. 
### Name
The usual name of the module 
### Icon
Icon will be displayed on the mobile application and dashboard admin. You have to refer to the [eva icon list](https://akveo.github.io/eva-icons).
### Actions
Each action of the module must be defined.  

An action is composed of an : 
- `id` is an reference (String)
- `name` is an name (String)
- `description` is an description (String)
- `settings` is an array of settings (Array)
 
#### Settings 

An setting is composed of an :  
- `id` is an reference (String)
- `default` is an default value (Any)
- `type` is one of the following list (String)

#### Type
The different types : 
- `string` : simple textinput
- `number` : custom textinput with only numbers
- `slider` : custom slider to define `min`, `max` and `step` value
- `colorpicker` : field is a list of 16 selectable colors and a text field to define the hexadecimal color
- `select` : picker field that is included in a list of `values`


### Example

```json
{
    "id":"john-doe-module",
    "name":"my-custom-module",
    "type": "module",
    "icon":"eva-icon",
    "actions": [
        {
            "id": "getExample",
            "name": "Get example",
            "description": "Get example data",
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
        }
    ]
}
```

## Package dependency (Package.json)

Define the list of the module dependencies.

You can generate `package.json` file with command `npm init`.

### Example

```json
{
    "name": "@intendant/hue-light-smartobject",
    "version": "0.0.1",
    "author": "Intendant",
    "license": "apache-2.0",
    "dependencies": {
        "node-fetch": "^2.6.1"
    }
}
```

## File executable (index.js)

### Class

Create a simple class

```js
class MyCustomModule {
    
}
```

### Methods

Define the method with a `__{id}` prefix

```javascript
async __getExample(settings = {}) {
    
    /* 
        Your code to execute
    */
    
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

