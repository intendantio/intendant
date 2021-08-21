---
title: Routine
---

### **GET** /routines

Description : get all routines

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

### **GET** /routines/:idRoutine

Description : get one routine

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

### **POST** /routines/:idRoutine

Description : insert new routine

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
    name: "routineName", 
    icon: "routineIcon", 
    watch: "routineWatch", 
    triggers: [ ... ] , 
    effect: [ ... ]
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

### **PUT** /routines/:idRoutine

Description : update routine

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

### **PUT** /routines/:idRoutine/status

Description : update routine status

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
    status: "RoutineStatus"
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

### **PUT** /routines/:idRoutine/duplicate

Description : duplicate routine

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