---
title: Widget
---

It is possible to access the list of widget by the side button `Widget`.  

To create a new widget, go to the list and press the more icon.

## Information

You must fill in the fields reference, icon.  

- Reference is an unique identifier
- Icon that can be selected from the list propose ([eva icon](https://akveo.github.io/eva-icons)) 

## Source

You can configure data sources. This is an action of a smartobject, module or process. The reference of a source is used in the content field.


## Content

To display a line of the widget, you must define the type among the following list :
- Title : Title content, it goes bigger and bolder and first in the list
- Content : Simple content
- List : List content, it to display a list in the condition where the data source is an array  

To display a value from a source, you must add the reference between two backets.
If this source value is an object, you have to traverse it as a JSON javascript object.

### Exemple


Source :  
![Cycle state](/img/widget-source-action-dasboard.png "New smartobject")  

Data :  
![Cycle state](/img/widget-result-action-dasboard.png "New smartobject")  

Content :  
![Cycle state](/img/widget-content-action-dasboard.png "New smartobject")

To save, press the disk icon. You have created a new widget.

