//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import Transformation from "../src/transformation";

// Defines a Mocha test suite to group tests of similar kind together
suite("integration test", () => {
    setup(setupTest);

    test("behaviour of text-transformer framework", (done: MochaDone) => {
        vscode.workspace.onDidChangeTextDocument((change: vscode.TextDocumentChangeEvent) => {
            const text = vscode.window.activeTextEditor.document.getText();
            
            assert.equal(text, "HAllo, HIER bin ich!");
            done();
        });
        
        vscode.commands.executeCommand("Sample-Transformer");
    });
});

class SampleTransformer extends Transformation {
    getCommandName(): string {
        return "Sample-Transformer";
    }
    
    transform(input: string, cb: (output: string) => void): void {
        cb(input.toUpperCase());
    }
}

function setupTest(done: MochaDone) {
    myExtension.transformers.push(new SampleTransformer());
    //myExtension.activateAgain();
    
    const selections = new Array<vscode.Selection>();
    selections.push(new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 2)));
    selections.push(new vscode.Selection(new vscode.Position(0, 5), new vscode.Position(0, 11)));
    
    vscode.workspace.openTextDocument(__dirname + "/../../test/sample_text").then(() => {
        vscode.window.activeTextEditor.selections = selections;
        
        done();     
    }, (err) => {
        console.error(err);
        done(new Error("Could not load sample text into editor!"));
    });
}