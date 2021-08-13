---
title: List Manager
---
## Installation
```
npm install -s @intendant/internal-list-manager-modules
```
```
yarn add @intendant/internal-list-manager-modules
```
## Methods

### Get all (getAll)
Get all lists in the storage
```js 
static getAll(settings: Object): Object 
```
### Get one (getOne)
Get one list in the storage by a reference.
- `reference:String`  
```js 
static getOne(settings: Object): Object 
```
### Create (create)
Creation of a new list by reference.
- `reference:String`  
```js 
static create(settings: Object): Object 
```
### Add (add)
Add an item to a list.
- `reference:String`  
- `item:Object`  
```js 
static add(settings: Object): Object 
```
### Remove (remove)
Remove an item from the list.
- `reference:String`  
- `index:Number`  
```js 
static remove(settings: Object): Object 
```
### Clear (clear)
Clear all lists 
```js 
static clear(settings: Object): Object 
```
### Return format
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```
