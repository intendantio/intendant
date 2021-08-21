---
title: Authentification
---

### **POST** /authentification 

Description : get authentification token

Secure request : **false**

#### Body 

```js 
{
    login: "YourLogin",
    password: "YourPassword"
}
```

#### Result 

```js 
{
    error: true | false,
    code: "CodeResult",
    message: "MessageResult",
    token: "yourToken" | null
}
```