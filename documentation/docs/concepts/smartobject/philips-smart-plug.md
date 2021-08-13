---
title: Philips Hue smart plug
---

## Requierement
Hue bridge : you must have a [Hue bridge](https://www.philips-hue.com/fr-fr/p/hue-hue-bridge/8718696511800) to be setup.
## Installation
```
npm install -s @intendant/hue-plug-smartobject
```
```
yarn add @intendant/hue-plug-smartobject
```
## Configuration

- Plug identifiant : `id:Number` 
- Hue hub path : `path:Number`  
- Hue secret key : `apikey:Number` 

```json
{
  "id": "5",
  "path": "http://0.0.0.0/api/",
  "apikey": "aaaappppiiiikkkkeeeeyyyy"
}
```
  
## Methods

### Turn on plug (turnOn)
Turn on the plug by choosing the brightness and color  .
```js 
static turnOn(settings: Object): Object 
```
### Turn off plug (turnOff)
Turns off the plug.
```js 
static turnOff(settings: Object): Object 
```
### Get status (status)
Get of the state of plug.
```js 
static status(settings: Object): Object 
```

### Return format
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```