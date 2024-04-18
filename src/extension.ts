import * as vscode from 'vscode';
import MacrosSuggestions from './Providers/MacrosSuggestions';
import Suggestions from './Providers/Suggestions';
import * as util from './util';

let disposables = [];

export function activate(context: vscode.ExtensionContext) {

    util.readConfig();

    loadMacros(context);

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration(`${util.PACKAGE_NAME}.list`)) {
                util.readConfig();

                disposeMacros();
                loadMacros(context);
            }
        }),
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration(`${util.PACKAGE_NAME}.qp-allow`)) {
                util.readConfig();
            }
        }),
        vscode.commands.registerCommand(`${util.PACKAGE_NAME}.execute`, async () => {
            vscode.window.showQuickPick(getQPList()).then((selection) => {
                if (selection) {
                    vscode.commands.executeCommand(`${util.PACKAGE_NAME}.${selection}`);
                }
            });
        }),
        vscode.languages.registerCompletionItemProvider(
            util.langs,
            new Suggestions()
        ),
        vscode.languages.registerCompletionItemProvider(
            util.langs,
            new MacrosSuggestions(),
            '.'
        )
    );

}

/* -------------------------------------------------------------------------- */

function executeDelayCommand(time) {
    return new Promise((resolve) => setTimeout(() => resolve(), time));
}

async function executeCommandTimesOther(command, otherCmnd) {
    const macrosList = util.macrosList;
    const range = macrosList[otherCmnd].length;

    Array(range).map(async () => await vscode.commands.executeCommand(command));
}

async function executeCommandRepeat(command, times) {
    Array(times).map(async () => await vscode.commands.executeCommand(`${util.PACKAGE_NAME}.${command}`));
}

function executeCommand(action) {
    if (typeof action === 'object') {
        const command = action.command;
        const args = action.args;

        if (command === '$delay') {
            return executeDelayCommand(args.delay);
        }

        if (args.hasOwnProperty('command')) {
            return executeCommandTimesOther(command, args.command);
        } else if (args.hasOwnProperty('times')) {
            return executeCommandRepeat(command, args.times);
        }

        return vscode.commands.executeCommand(command, args);
    }

    return vscode.commands.executeCommand(action);
}

/* -------------------------------------------------------------------------- */

function loadMacros(context) {
    const list = util.list

    util.macrosList.map((name) => {
        disposables.push(
            vscode.commands.registerCommand(
                `${util.PACKAGE_NAME}.${name}`,
                () => list[name].reduce(
                    async (promise, action) => {
                        await promise;
                        await executeCommand(action);
                    },
                    Promise.resolve(),
                ),
            )
        );
    })

    context.subscriptions.push(...disposables);
}

function getQPList() {
    let macrosList = util.macrosList;

    const allow = util.allow;
    const ignore = util.ignore

    if (allow.length) {
        macrosList = macrosList.filter((item) => allow.some((ai) => ai === item));
        macrosList = macrosList.sort((a, b) => allow.indexOf(a) - allow.indexOf(b));
    }

    if (ignore.length) {
        macrosList = macrosList.filter((item) => ignore.some((ai) => ai === item));
    }

    return macrosList;
}

function disposeMacros() {
    for (const disposable of disposables) {
        disposable.dispose();
    }
}

export function deactivate() { }
