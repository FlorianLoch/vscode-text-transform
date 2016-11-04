import Transformation from "./transformation";

export class UppercaseTransformer extends Transformation {
    getCommandName(): string {
        return "uppercase";
    }
    
    transform(input: string, cb: (output: string) => void): void {        
        cb(input.toUpperCase());
    }
}

export class LowercaseTransformer extends Transformation {
    getCommandName(): string {
        return "lowercase";
    }
    
    transform(input: string, cb: (output: string) => void): void {        
        cb(input.toLowerCase());
    }
}

export class CapitalcaseTransformer extends Transformation {
    getCommandName(): string {
        return "capitalcase";
    }
    
    transform(input: string, cb: (output: string) => void): void {        
        cb(input.charAt(0).toUpperCase() + input.slice(1).toLowerCase());
    }
}