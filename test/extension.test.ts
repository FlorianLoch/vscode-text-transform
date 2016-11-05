"use strict";

import * as assert from "assert";

import * as vscode from "vscode";
import * as myExtension from "../src/extension";
import Transformation from "../src/transformation";

suite("integration test", () => {
    suiteSetup(setupTest);

    test("behaviour of text-transformer framework (async)", (done: MochaDone) => {
        vscode.workspace.onDidChangeTextDocument(singleFire((change: vscode.TextDocumentChangeEvent) => { //We need singleFire here, otherwise this handler gets procesed when editor content changed during second testcase
            const text = vscode.window.activeTextEditor.document.getText();

            try { //Usually one wouldn"t need this construct - but it seems like the "thenables" catch the error before getting up higher in the stack
                assert.equal(text, "HAllo, HIER bin ich!\n");
            }
            catch (err) {
                return done(err);
            }

            done();
        }));

        vscode.commands.executeCommand("Test-Transformer-Async");
    });

    test("behaviour of text-transformer framework (sync)", (done: MochaDone) => {
        vscode.workspace.onDidChangeTextDocument((change: vscode.TextDocumentChangeEvent) => {
            const text = vscode.window.activeTextEditor.document.getText();

            try { //Usually one wouldn"t need this construct - but it seems like the "thenables" catch the error before getting up higher in the stack
                assert.equal(text, "hallo, hier bin ich!\n");
            }
            catch (err) {
                return done(err);
            }

            done();
        });

        //Actually the next three lines are setup code...
        const selections = new Array<vscode.Selection>();
        selections.push(new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 2)));
        selections.push(new vscode.Selection(new vscode.Position(0, 5), new vscode.Position(0, 11)));

        vscode.window.activeTextEditor.selections = selections;

        vscode.commands.executeCommand("Test-Transformer-Sync");
    });
});




import {CapitalcaseTransformer} from "../src/simple-transformations";

suite("unit tests", () => {
    suite("capitalcase", () => {
        const SAMPLE_SENTENCE = "hallo\twelt,\nich frEUe   mich!"; // between "frEUu" and "mich" there a three whitespaces 
        let instance = new CapitalcaseTransformer();
        
        test("correct handling of multiword input", (done: MochaDone) => {
            instance.transform(SAMPLE_SENTENCE, (output: string) => {
                assert.equal(output, "Hallo\tWelt,\nIch Freue   Mich!");
                done();
            });
        });
    });
});

function singleFire(fn: Function) {
    let fired = false;
    return function () {
        if (fired) return;
        fired = true;
        
        fn.apply(null, arguments);
    };
}

class TestTransformerAsync extends Transformation {
    getCommandName(): string {
        return "Test-Transformer-Async";
    }

    transform(input: string, cb: (output: string) => void): void {
        process.nextTick(cb.bind(null, input.toUpperCase()));
    }
}

class TestTransformerSync extends Transformation {
    getCommandName(): string {
        return "Test-Transformer-Sync";
    }

    transform(input: string, cb: (output: string) => void): string {
        return input.toLowerCase();
    }
}

function setupTest(done: MochaDone) {
    myExtension.transformers.push(new TestTransformerAsync());
    myExtension.transformers.push(new TestTransformerSync());

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