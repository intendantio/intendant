---
title: Module
---

### **POST** /modules/:idModule/actions/:idAction

Description : Executes an action of a module

Secure request : **true**

#### Headers 

```js 
{
    Authorization: "YourAuthToken"
}
```

#### Body 

```js 
{
    settings: [ ... ]
}
```

#### Result 

```js 
{
    error: true | false,
    code: "CodeResult",
    message: "MessageResult",
    data: { ... }
}
```

