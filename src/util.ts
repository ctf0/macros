import * as vscode from "vscode";

export function suggestionsList() {
    return macrosList.map((item) => {
        let comp = new vscode.CompletionItem(item, vscode.CompletionItemKind.Method)
        comp.detail = 'ctf0.macros'

        return comp
    }) || []
}
export function getMacrosList(list) {
    const ignore = ['has', 'get', 'update', 'inspect'];

    return Object
        .keys(list)
        .filter((prop) => ignore.indexOf(prop) < 0);
}

/* Config ------------------------------------------------------------------- */
export const PACKAGE_NAME = 'macros';

export let config: vscode.WorkspaceConfiguration;

export let list = [];
export let macrosList = [];
export let allow = [];
export let ignore = [];
export let langs = [];

export function readConfig() {
    config = vscode.workspace.getConfiguration(PACKAGE_NAME);

    list = config.list
    macrosList = getMacrosList(list)
    allow = config['qp-allow']
    ignore = config['qp-ignore']
    langs = config.langIds
}
