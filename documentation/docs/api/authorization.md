---
title: Authorization
---

### **GET** /authorization 

Description : get all authorization

Secure request : **true**

#### Headers 

```js 
{
    Authorization: "YourAuthToken"
}
```


#### Result 

```js 
{
    error: true | false,
    code: "CodeResult",
    message: "MessageResult",
    data: [ ... ]
}
```
