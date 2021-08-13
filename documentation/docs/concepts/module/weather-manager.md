---
title: Weather prevision
---
## Requierement
An internet connection is required to use the module
## Installation
```
npm install -s @intendant/external-weather-modules
```
```
yarn add @intendant/external-weather-modules
```
## Methods
### Get Weather (getWeather)
Get weather forecast by location.
- `city:String`  
```js 
static getWeather(settings: Object): Object 
```
### Return format
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```