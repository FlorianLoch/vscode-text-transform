# TextTransform
This shall be a simple extension to provide basic text transformations (like to uppercase, to lowercase) - which are still not included in vscode itself.
Because providing just this would be to simple the extension is extensible itself so further, also asynchronous and more complex transformations can easily be added. 

Therefore text transformation handlers can be registered at the core of the extension. The core then takes care of the registration at the vscode extension system on the one hand and the handling of the selections on the other hand.

---

Currently there are three transformations included:
- to uppercase
- to lowercase 
- to capitalcase

---

## How to contribute a new transformation
Writing a new transformation is easy as pie - you just have to implement the abstract class ´´Transformation´´ and register it afterwards. Handling of (multiple) selections and async processing comes for free!

Step 1: Inherit from ``Transformation```
```javascript
export class UppercaseTransformer extends Transformation {
    getCommandName(): string {
        return "uppercase"; //This will be needed for registering the command in package.json
    }
    
    transform(input: string, cb: (output: string) => void): void {        
        cb(input.toUpperCase()); //we could also return a string here instead, the callback is just needed in case of asynchronity
    }
}
```

Step 2:
In ``extension.ts`` add a line like:
```javascript
transformers.push(new UppercaseTransformer());
```

Step 3:
In ``package.json`` add your command and its title to the ``contributes`` hash:
```
    ...
    "contributes": {
        "commands": [{
            "command": "uppercase",
            "title": "To uppercase"
        },
        ...
    },
    ...
```

Step 4: Test your code and open a pull request!
