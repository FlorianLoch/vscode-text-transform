abstract class Transformation {
    abstract getCommandName(): string;
    abstract transform(input: string, cb: (output: string) => void): void | string;
}

export default Transformation;