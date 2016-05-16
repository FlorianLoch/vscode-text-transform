# TextTransform
This shall be a simple extension to provide basic text transformations (like to uppercase, to lowercase) - which are still not included in vscode itself.
Because providing just this would be to simple the extension is extensible itself so further, also asynchronous and more complex transformations can easily be added. 

Therefore text transformation handlers can be registered at the core of the extension. The core then takes care of the registration at the 
vscode extension system on the one hand and the handling of the selections on the other hand.

---

Currently there are two transformations included:
- to uppercase
- to lowercase 


