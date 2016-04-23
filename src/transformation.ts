abstract class Transformation {
    abstract getCommandName(): string;
    abstract transform(input: string, cb: (output: string) => void): string;
}

export default Transformation;