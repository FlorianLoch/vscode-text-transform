"use strict";

import * as assert from "assert";

import * as vscode from "vscode";
import * as myExtension from "../src/extension";
import Transformation from "../src/transformation";

suite("integration test", () => {
    setup(setupTest);

    test("behaviour of text-transformer framework", (done: MochaDone) => {
        vscode.workspace.onDidChangeTextDocument((change: vscode.TextDocumentChangeEvent) => {
            const text = vscode.window.activeTextEditor.document.getText();

            try { //Usually one wouldn"t need this construct - but it seems like the "thenables" catch the error before getting up higher in the stack
                assert.equal(text, "HAllo, HIER bin ich!\n");
            } 
            catch (err) {
                return done(err);
            }
            
            done();
        });

        vscode.commands.executeCommand("Sample-Test-Transformer");
    });
});

class SampleTestTransformer extends Transformation {
    getCommandName(): string {
        return "Sample-Test-Transformer";
    }

    transform(input: string, cb: (output: string) => void): void {
        process.nextTick(cb.bind(null, input.toUpperCase()));
    }
}

function setupTest(done: MochaDone) {
    myExtension.transformers.push(new SampleTestTransformer());
    //myExtension.activateAgain(); //Actually extension should be initiliazed at startup, so before coming to this line?!

    const selections = new Array<vscode.Selection>();
    selections.push(new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 2)));
    selections.push(new vscode.Selection(new vscode.Position(0, 5), new vscode.Position(0, 11)));

    vscode.workspace.openTextDocument(__dirname + "/../../test/sample_text").then((doc: vscode.TextDocument) => {
        vscode.window.activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(new vscode.Position(0, 0), doc.getText());
        }).then(() => {
            vscode.window.activeTextEditor.selections = selections;

            done();
        });
    }, (err) => {
        console.error(err);
        done(new Error("Could not load sample text file!"));
    });
}