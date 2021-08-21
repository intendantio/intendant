---
title: Introduction
---

When instantiating a intendant server, you must define a connector module.  
There are two solutions for a intendant server :
- Use a basic connector from the available [list](/docs/guides/connector/introduction#basic-connector)
- Create a custom module with [@intendant/connector](https://www.npmjs.com/package/@intendant/connector)

`Connector` is an interface to a database system.  

`Connector` is instantiated when the intendant server is launched. If a connection is needed to the database, it must be established in the `constructor`.


## Example

### Installation

```js 
let connector = require('my-custom-module')
api.initialisation(
    new Core(configuration,connector,tracing)
)
```


### Usage
```js 
/* Creating an instance of a connector */
const userConnector = new this.connector({},this.core,"user")
/* Execute query */
let result = await userConnector.getOneByField({firstname: "john", lastname: "doe"})
/* Check error */
if(result.error) {
    throw result.code + " " + result.message
}
/* Get data */
let data = result.data
```


## Basic Connector

### [MySQL](/docs/guides/connector/mysql)


