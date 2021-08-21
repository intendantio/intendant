---
title: Process
---

It is possible to access the list of process by the side button `process`.  

## Setup

To create a new process, go to the list and press the more icon.

### Information

You must fill in the fields reference, icon, description and espace.  

- Reference is an unique identifier
- Icon that can be selected from the list propose ([eva icon](https://akveo.github.io/eva-icons)) 
- Description describes how the process works 
- Espace is the sector of the process

### Mode

A process can be in two modes : 
- Mode simple : one click one execution  
- Mode switch : two states on/off (2 states)

### Argument

If your process needs arguments, you can define them.  
The reference field is important, it is used to inject the value of the argument in the action settings.

### Action

Each action can be defined by a source which can be a smartobject or a module. 

If the settings of the action are **variable**, you must specify the **reference** of the argument surrounded by %.

For example, the reference color is injected in the turnOn action of the smartobject BUREAU-1
![Cycle state](/img/process-action-dasboard.png "New smartobject")  

Example result  
![Cycle state](/img/process-action-result--dasboard.png "New smartobject")  

In a switch mode, you should also define if it is an action to be executed in on or off state.

To save, press the disk icon. You have created a new process.
