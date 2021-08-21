---
title: Concept
---

Intendant is divided into 5 main concepts: **smartobject**, **module**, **process**, **routine** and **widget**.

### Smartobject

Smartobject is the representation of a type of connected object, it can be instantiated multiple times and proposes a list of executable actions.  
![Cycle state](/img/smartobject.png "Intendant cycle state")  
Example : Light, Plug, Weather station... 


### Module

Module is a representation of a non-fungible interface. It cannot be instantiated but proposes a list of executable actions.  
![Cycle state](/img/module.png "Intendant cycle state")  
Example : Weather API, TV Program, List Manager, Reminder, Calendar  

### Process

Process is an composition of smartobject and module actions. It is a representation of an action that does multiple actions.  
![Cycle state](/img/process.png "Intendant cycle state")  
Example : 
- Turn on two lights off room in one action 
  - Action : Light1 (turnOn), Light2 (turnOn)
- Add a product to shopping list and send a notification 
  - Action : list module (addProduct), notification module (sendNotification)
- Turn on the light and send a notification. 
  - Action: Light3 (turnOn), notification module (sendNotification)
  
### Widget

Widget is a data display object. Widget defines a list of data sources, a source can be a smartobject, a module and/or process.  
![Cycle state](/img/widget.png "Intendant cycle state")  
Example :
- *It is 15°c in Paris.* 
  - Source : weather module
- *You have 3 events today and 1 reminder. Don't forget to water the plants. The alarm clock is set at 2pm*
  - Source : Calendar module, Remidner module, Plant module, Alarm smartobject

### Routine
Routine is the most complex concept of intendant. The routine performs actions at specific times or under specific conditions.  
Routine has two different lists :
 - List of conditions 
 - List of effects  

The power of a routine is to automate a series of actions (smartobject, module and process).

![Cycle state](/img/routine.png "Intendant cycle state")

Example : 
- If button is pressed then turn on the light
  - Condition : Button (getState)
  - Effect : Light14 (turnOn)
- If presence is detected then send a notification and activate alarm
  - Condition : Presence5 (getState), 
  - Effect : notification module (sendNotification), alarm module (activate)
- If button is pressed and if the light is red then turn the light green
  - Condition: Button5 (getState) , Light3 (getState)
  - Effect : Light3 (turnOn)
  
### Global integration

![Cycle state](/img/cycle.png "Intendant cycle state")



