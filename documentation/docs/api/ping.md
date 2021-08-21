---
title: Ping
---

### **GET** /ping

Description : Get intendant cycle state

Secure request : **false**

#### Headers 

```js 
{
    Authorization: "YourAuthToken"
}
```


#### Result 

```js 
{
    version: "intendantVersion",
    getStarted: true|false,
    error: true|false,
    message: "MessageResult",
    code: "CodeResult"
}
```

