---
title: Widget
---

### **GET** /widgets 

Description : get all widgets

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

### **GET** /widgets/:idWidget

Description : get one widget

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

### **POST** /widgets

Description : insert widget

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
    reference: "WidgetReference",
    icon: "WidgetIcon",
    sources: [ ... ],
    contents: [ ... ]
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

### **PUT** /widgets/:idWidget

Description : update content widget

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
    contents: {
        id: "idContent",
        native: "nativeToDisplay"
    }
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

### **DELETE** /widgets/:idWidget

Description : delete widget

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

### **POST** /widgets/:idWidget/contents

Description : insert content by idWidget

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
    type: "contentType",
    content: "contentContent"
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

### **DELETE** /widgets/:idWidget/contents/:idContent

Description : Delete content by idWidget

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

### **POST** /widgets/:idWidget/sources

Description : insert source by idWidget

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
    reference: "widgetReference",
    source: { ... }
    action: "sourceAction"
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

### **DELETE** /widgets/:idWidget/contents/:idSource

Description : Delete source by idWidget

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