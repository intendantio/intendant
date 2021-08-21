---
title: Smartobject
---

### **GET** /smartobjects

Description : get all smartobjects

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

### **GET** /smartobjects/:idSmartobject

Description : get one smartobject

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

### **POST** /smartobjects

Description : insert new smartobject

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
    module: "NameModule",
    reference: "ReferenceModule",
    settings: [ ... ],
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

### **DELETE** /smartobjects/:idSmartobject

Description : delete smartobject

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
    message: "MessageResult"
}
```

### **POST** /smartobjects/:idSmartobject/settings

Description : insert new settings by smartobject

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
    reference: "settingsReference",
    value: "settingsValue"
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

### **DELETE** /smartobjects/:idSmartobject/settings/:idSetting

Description : delete settings by id

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
    message: "MessageResult"
}
```

### **POST** /smartobjects/:idSmartobject/actions/:idAction

Description : execute one smartobject action by id

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

### **POST** /smartobjects/:idSmartobject/profiles

Description : insert profile authorization on smartobject 

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
    idProfile: "anProfile"
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

### **DELETE** /smartobjects/:idSmartobject/profiles/:idProfile

Description : delete profile authorization on smartobject 

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
    message: "MessageResult"
}
```
