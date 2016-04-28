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