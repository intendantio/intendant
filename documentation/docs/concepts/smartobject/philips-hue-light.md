---
title: Philips Hue light
---

## Requierement
Hue bridge : you must have a [Hue bridge](https://www.philips-hue.com/fr-fr/p/hue-hue-bridge/8718696511800) to be setup.
## Installation
```
npm install -s @intendant/hue-light-smartobject
```
```
yarn add @intendant/hue-light-smartobject
```
## Configuration

- Light identifiant : `id:Number` 
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

### Turn on light (turnOn)
Turn on the light by choosing the brightness and color  
- `brightness:Number`  
- `color:Number`  
```js 
static turnOn(settings: Object): Object 
```
### Turn off light (turnOff)
Turns off the light.
```js 
static turnOff(settings: Object): Object 
```
### Get status (status)
Get of the state of light.
```js 
static status(settings: Object): Object 
```
### Return format
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```