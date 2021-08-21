---
title: Client
---

### **POST** /client

Description : Insert new client

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
    name: "ExamplePassword"
    imei: "ExampleImei"
    token: "ExampleToken"
}
```

#### Result 

```js 
{
    error: true | false,
    code: "CodeResult",
    message: "MessageResult"
}
```

