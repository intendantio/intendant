---
title: MySQL
---

## Installation

```
npm install -s @intendant/sql-connector 
```
```
yarn add @intendant/sql-connector
```

## Configuration
To initialise the module, you have to define the configuration SQL database connection :
- `host`
- `user`
- `password`
- `database`  

```javascript 
const connector = require('@intendant/sql-connector')
const configuration = {
    adapter: {
        host: "localhost",
        user: "root",
        password: "",
        database: "intendant"
    }
}
let core = new Core(configuration,connector,tracing)
```

## Usage

```javascript
/* Create an instance of a connector for an entity (table) */
const userConnector = new this.connector({},this.core,"user")

userConnector.getOne(1)
// ~ SELECT * FROM user WHERE id="1" LIMIT 1 
userConnector.getOneByField({firstname: "john", lastname: "doe"})
// ~ SELECT * FROM user WHERE firstname="john" AND lastname="doe" LIMIT 1
userConnector.getAll()
// ~ SELECT * FROM user
userConnector.getAllByField({firstname: "john", lastname: "doe"})
// ~ SELECT * FROM user WHERE firstname="john" AND lastname="doe"
userConnector.deleteOne(1)
// ~ DELETE FROM user WHERE id="1"
userConnector.deleteAllByField({firstname: "john", lastname: "doe"})
// ~ DELETE FROM user WHERE firstname="john" AND lastname="doe"
userConnector.updateAll({firstname: "john", lastname: "doe"},{reference: "doe"})
// ~ UPDATE user SET firstname="john", lastname="doe" WHERE reference="doe"
userConnector.truncate()
// ~ DELETE FROM user
userConnector.insert({firstname: "john", lastname: "doe"})
// ~ INSERT INTO user ("firstname","lastname") VALUES ("john","doe") 
```
