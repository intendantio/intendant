---
title: Custom tracing
---

## Class
To create a custom tracing module, you must extend the abstract class [@intendant/tracing](https://www.npmjs.com/package/@intendant/tracing)

```js
const tracing = require("@intendant/tracing") 
class CustomTracing extends tracing {
}
```
## Methods
### Verbose
Verbose is the log that traces a normal use.  

```js 
static verbose(object: String, message: String): Boolean 
```
  
`true` the method has been executed  
`false` an error has occurred  


### Warning
Warning is used to issue a warning about a non-blocking anomaly that has occurred.

```js 
static warning(object: String, message: String): Boolean
``` 
  
`true` the method has been executed  
`false` an error has occurred  

### Error
Error is the highest log level, it is a critical log, may cause an unexpected server shutdown. Error log are rare and should be avoided to have a safe server life cycle. 

```js 
static error(object: String, message: String): Boolean
```
  
`true` the method has been executed  
`false` an error has occurred  

## Guideline
Use the current package name in `package.json` as object parameter 



