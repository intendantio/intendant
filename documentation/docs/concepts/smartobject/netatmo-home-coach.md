---
title: Netatmo Home Coach
---

## Installation
```
npm install -s @intendant/netatmo-home-coach-smartobject
```
```
yarn add @intendant/netatmo-home-coach-smartobject
```

## Configuration

- Netatmo client : `clientId:String` 
- Netatmo secret : `clientSecret:String`  
- Refresh token : `token:String` 
- Device identifiant: `device:String` 

```json
{
  "clientId": "cccclllliiiieeeennnnttttIIIIdddd",
  "clientSecret": "cccclllliiiieeeennnnttttsssseeeeccccrrrreeeetttt",
  "token": "ttttooookkkkeeeennnn",
  "device": "dd:ee:vv:ii:cc:ee"
}
```
## Methods
### Get weather data (getData)
This method uses the [cache](/docs/core#core) to avoid blacklisting the Netatmo webservice, the data expire and refresh in 3600 seconds.
```js 
static getData(settings: Object): Object 
```
### Return format
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```