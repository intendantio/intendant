---
title: Routine
---

It is possible to access the list of routine by the side button `Routine`.  

To create a new routine, go to the list and press the more icon.

## Setup

To create a new routine, go to the list and press the more icon.

### Information

You must fill in the fields reference, icon, description and espace.  

- Reference is an unique identifier
- Icon that can be selected from the list propose ([eva icon](https://akveo.github.io/eva-icons)) 

### Watcher

You must specify the test frequency of the condition stack.  
For example : you select ten value, the routine will test every ten seconds if the condition is valid. 

![Cycle state](/img/routine-watcher-dasboard.png "New smartobject")  

### Trigger

You must specify the trigger stack, these are conditions that must be resolved in full to execute the effect stack.  
A trigger can be a smartobject, module and process.  
For each trigger, you have to choose the result, condition and expected fields: 
- result : result of the data which can be an object, it must be traversed as a JSON object
- condition : list of condition types (larger, smaller, equal, different)
- expected : expected value of the condition  
![Cycle state](/img/routine-trigger-dasboard.png "New smartobject")  

### Effect

You can specify multiple effect to be executed when the condition is valid. An effect can be a smartobject, module and process.  

![Cycle state](/img/routine-effect-dasboard.png "New smartobject")  

### Save
To save, press the disk icon. You have created a new routine.

## Status

By default a routine is disabled, it is possible to enable with the play icon. 
To disable a routine, press the green pause icon.

## Duplicate
You can duplicate a routine with the copy icon.
The routine will be duplicated with a `_duplicate` suffix in disabled status.

## Edit

You can edit a routine with the pencil icon. 

## Delete
You can delete a routine with the trash icon.