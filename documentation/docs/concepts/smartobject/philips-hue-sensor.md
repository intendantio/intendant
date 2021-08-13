---
title: Philips Hue sensor
---

## Requierement
Hue bridge : you must have a [Hue bridge](https://www.philips-hue.com/fr-fr/p/hue-hue-bridge/8718696511800) to be setup.
## Installation
```
npm install -s @intendant/hue-sensor-smartobject
```
```
yarn add @intendant/hue-sensor-smartobject
```
## Configuration

- Sensor identifiant : `id:Number` 
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


### Check presence (checkPresence)
Get the status of the sensor module (presence or not presence).
```js 
static checkPresence(settings: Object): Object 
```
### Return format
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```