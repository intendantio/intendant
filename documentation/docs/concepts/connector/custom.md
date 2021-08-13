---
title: Custom Connector
---

## Class
To create a custom module, you must extend the abstract class [@intendant/connector](https://www.npmjs.com/package/@intendant/connector)
```js
const connector = require("@intendant/connector") 

class MyConnector extends connector  {

}
```
## Constructor
Don't forget to use the `super()` statement to initialize the module properly.  
Attributes available :
- `_configuration` is configuration object
- `_core` is an instance of [@intendant/core](/docs/concepts/core)  
- `_name` is entity name  

```js
constructor(configuration, core, name) {
    super(configuration, core, name)
    /*
        Create the database connection
    */
    return this
}
```
`InstanceConnector` connection is established
## Methods


### GetOne

```js 
async getOne(id: String): Object
```
### GetOneByField

```js 
async getOneByField(wheres: Object): Object 
```
### GetAllByField

```js 
async getAllByField(id: String): Object
```
### GetAll

```js 
async getAll(): Object
```
### DeleteById

```js 
async deleteById(id: String): Object
```
### DeleteAllByField

```js 
async deleteAllByField(field: Object): Object
```
### UpdateAll

```js 
async updateAll(sets: Object, wheres: Object): Object
```
### Truncate

```js 
async truncate(): Object
```
### Insert

```js 
async insert(fields: Object): Object
```
### Execute (depreciating)

```js 
async execute(id: String): Object
```
### Return format
The return format is the same for all methods.
```js 
{ code: String, message: String, error: Boolean, data?: Object } 
```