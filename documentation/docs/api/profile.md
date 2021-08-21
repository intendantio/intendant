---
title: Profile
---

### **GET** /profiles

Description : get all profiles

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

### **GET** /profiles/:idProfile

Description : get one profile

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
    data: { ... }
}
```

### **GET** /profiles/:idProfile/authorizations

Description : get one profile authorizations

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
    data: { ... }
}
```

### **POST** /profiles/:idProfile/authorizations

Description : insert authorization by id

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
    authorization: "idAuthorization",
    secure: 0|1
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
