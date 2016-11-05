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
        let capitalizeNextChar = true;
        let newString = "";
        for (let i = 0; i < input.length; i++) {
            let char = input.charAt(i);

            if (capitalizeNextChar) {
                char = char.toUpperCase();
            }
            else {
                char = char.toLowerCase();
            }

            newString += char;

            capitalizeNextChar = (char == "\n" || char == "\t" || char == " ");
        }

        cb(newString);
    }
}