abstract class Transformation {
    abstract getCommandName(): string;
    abstract transform(input: string, cb: (output: string) => void): void;
}

export default Transformation;