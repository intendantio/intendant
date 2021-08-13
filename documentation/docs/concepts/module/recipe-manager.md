---
title: Recipe Manager
---
## Requierement
An internet connection is required to use the module
## Installation
```
npm install -s @intendant/external-recipe-modules
```
```
yarn add @intendant/external-recipe-modules
```
## Methods
### Get recipe (getRecipe)
Get a list of recipes.  
Recipe data is for personal use, **non-commercial use only**.
- `recipe:String`  
```js 
static getRecipe(settings: Object): Object 
```
### Return format
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```