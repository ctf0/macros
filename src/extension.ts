import * as vscode from 'vscode';

const disposables = [];
const PKG_NAME = 'macros';
export function activate(context: vscode.ExtensionContext) {
    loadMacros(context);

    context.subscriptions.push(
        vscode.commands.registerCommand(`${PKG_NAME}.execute`, async () => {
            vscode.window.showQuickPick(getQPList()).then((selection) => {
                if (selection) {
                    vscode.commands.executeCommand(`${PKG_NAME}.${selection}`);
                }
            });
        }),
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration(`${PKG_NAME}.list`)) {
                disposeMacros();
                loadMacros(context);
            }
        }),
    );

}

function getSettings(key) {
    return vscode.workspace.getConfiguration(PKG_NAME).get(key);
}

function getMacrosList() {
    const ignore = ['has', 'get', 'update', 'inspect'];

    return Object
        .keys(getSettings('list'))
        .filter((prop) => ignore.indexOf(prop) < 0);
}

function getQPList() {
    let list = getMacrosList();
    const allow = getSettings('qp-allow');
    const ignore = getSettings('qp-ignore');

    if (allow.length) {
        list = list.filter((item) => allow.some((ai) => ai === item));
    }

    if (ignore.length) {
        list = list.filter((item) => ignore.some((ai) => ai === item));
    }

    return list;
}

function executeDelayCommand(time) {
    return new Promise((resolve) => setTimeout(() => resolve(), time));
}

async function executeCommandTimesOther(command, otherCmnd) {
    const settings = getSettings('list');
    const range = settings[otherCmnd].length;

    Array(range).map(async () => await vscode.commands.executeCommand(command));
}

async function executeCommandRepeat(command, times) {
    Array(times).map(async () => await vscode.commands.executeCommand(`${PKG_NAME}.${command}`));
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

function loadMacros(context) {
    const settings = getSettings('list');

    getMacrosList().map((name) => {
        const disposable = vscode.commands.registerCommand(
            `${PKG_NAME}.${name}`,
            () => settings[name].reduce(
                async (promise, action) => {
                    await promise;
                    await executeCommand(action);
                },
                Promise.resolve(),
            ),
        );

        disposables.push(disposable);
    });

    context.subscriptions.push(...disposables);
}

function disposeMacros() {
    for (const disposable of disposables) {
        disposable.dispose();
    }
}

export function deactivate() { }
