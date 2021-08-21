---
title: Process
---

### **GET** /espaces

Description : Get all espaces

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

### **GET** /process

Description : Get all process

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

### **POST** /process

Description : Insert new process

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
    reference: "processReference",
    name: "processName",
    nameEnable: "nameWhenProcessIsEnable",
    nameDisable: "nameWhenProcessIsDisable",
    description: "processDescription",
    espace: "espaceId",
    icon: "processIcon",
    mode: "processMode", 
    sources: [ ... ], 
    inputs: [ ... ]
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

### **GET** /process/:idProcess

Description : Get one process

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

### **DELETE** /process/:idProcess

Description : Delete one process

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

### **POST** /process/:idProcess/actions

Description : Insert new action by id process

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
    source: "sourceName",
    action: "actionName",
    enable: 0|1,
    arguments: [ ... ]
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

### **DELETE** /process/:idProcess/actions/:idAction

Description : Delete action by id process

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

### **POST** /process/:idProcess/inputs

Description : Insert new input by id process

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
    name: "inputName",
    type: "inputType",
    enable: 0|1
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

### **DELETE** /process/:idProcess/inputs/:idInput

Description : Delete input by id process

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
    name: "inputName",
    type: "inputType",
    enable: 0|1
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

### **POST** /process/:id/execute

Description : Execute process action

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
    inputs: [ ... ]
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

### **POST** /process/:idProcess/profiles

Description : insert profile authorization on process 

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

### **DELETE** /process/:idProcess/profiles

Description : insert profile authorization on process 

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


