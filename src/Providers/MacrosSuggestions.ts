import * as vscode from 'vscode';
import * as util from '../util';

export default class MacrosSuggestions implements vscode.CompletionItemProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const linePrefix = document.lineAt(position).text.slice(0, position.character);
        if (!linePrefix.endsWith('macros.')) {
            return undefined;
        }

        return util.suggestionsList()
    }
}
