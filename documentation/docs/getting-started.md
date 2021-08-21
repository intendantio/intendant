---
title: Installation
---

## Requirement 

NodeJS is required, all versions are compatible but it is recommended at least version 10.

## Project structure


To install with command line.

```
curl -sL https://raw.githubusercontent.com/intendantio/intendant/main/scripts/install.sh | bash -
```

## Configuration

`intendant.json` is a configuration file.

You must edit fields :

- `port` : define port number of intendant is hosted.     
- `token` : define a random text to encrypt JSON Web Tokens.  
- `connector` : define MYSQL database connection.

## Database structure

A MySQL server is required to run intendant.  
You must import sql structure file to import to your database. **  [Download](https://raw.githubusercontent.com/intendantio/intendant/main/template/structure-intendant.sql) **
