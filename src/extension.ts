import {ExtensionContext, window, commands, Selection, Range, TextEditorEdit} from "vscode";
import Transformation from "./transformation";
import {UppercaseTransformer, LowercaseTransformer} from "./simple-transformations";

export const transformers = new Array<Transformation>();
transformers.push(new UppercaseTransformer());
transformers.push(new LowercaseTransformer());

//This is needed to be able to inject a spy transformer during testing
let context: ExtensionContext;
export function activateAgain() {
    context.subscriptions.forEach((subscription: {dispose(): any}) => {
       subscription.dispose(); 
    });
    activate(context);
}

export function activate(cntxt: ExtensionContext) {
    context = cntxt;
    
    transformers.forEach((transformer: Transformation) => {
        let disposable = commands.registerCommand(transformer.getCommandName(), handleCommand);

        context.subscriptions.push(disposable);

        function handleCommand() {
            const editor = window.activeTextEditor;
            const selections = editor.selections;
            const selectedStrings = new Array<string>();
            const transformedStrings = new Array<string>();

            if (!editor) {
                console.error("No active editor to get selections from!");
                return;
            }

            getSelectedStrings();
            transformString(0, replaceStringsInEditor);

            function getSelectedStrings() {
                selections.forEach((selection: Selection) => {
                    const range = new Range(selection.start, selection.end);
                    selectedStrings.push(editor.document.getText(range));
                });
            }

            function transformString(idx: number, onDone: () => void) {
                if (idx >= selectedStrings.length) {
                    return onDone();
                }
                
                transformer.transform(selectedStrings[idx], (output: string) => {
                    transformedStrings.push(output);
                    transformString(++idx, onDone);
                });
            }

            function replaceStringsInEditor() {
                editor.edit((editBuilder: TextEditorEdit) => {
                    selections.forEach((selection: Selection, idx: number) => {
                       editBuilder.replace(selection, transformedStrings[idx]); 
                    });
                }).then(function success(result: boolean) {
                    console.log("Successfully applied transformations on " + selections.length + " selections.");
                }, function fail() {
                    console.error("Failed to apply transformations!");
                    window.showInformationMessage("Could not apply transformation(s)!");
                });
            }
        }
    });
}

export function deactivate() {
}