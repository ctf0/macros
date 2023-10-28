import * as vscode from 'vscode';
import * as util from '../util';

export default class Suggestions implements vscode.CompletionItemProvider {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const commitCharacterCompletion = new vscode.CompletionItem('macros');
        commitCharacterCompletion.commitCharacters = ['.'];
        commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `macros.`');

        return util.suggestionsList().concat(commitCharacterCompletion)
    }
}
