---
title: Console
---
## Installation

```
npm install -s @intendant/console-tracing
```
```
yarn add @intendant/console-tracing
```

## Implementation

```js 
let console = require('@intendant/console-tracing')
api.initialisation(
    new Core(configuration,connector,console)
)
```

## Usage
```javascript
this.logger.verbose("@intendant/smartobject","Message ✔️ verbose ✔️")
this.logger.warning("@intendant/smartobject","Message ⚠️ warning ⚠️")
this.logger.error("@intendant/smartobject","Message ❌ error ❌")
```
