/**
 * Angular HTML Formatter Extension
 * Entry point for VS Code extension
 */

import * as vscode from 'vscode';
import { AngularHtmlFormatter } from './formatter';
import { IndentationDetector } from './indentation';
import { FormattingOptions } from './types';

function getFormattingOptions(document: vscode.TextDocument): FormattingOptions {
	const config = vscode.workspace.getConfiguration('angular-html-formatter');
	const indentationOptions = IndentationDetector.getIndentationOptions(document);

	return {
		...indentationOptions,
		inlineShortElements: config.get('inlineShortElements', true),
		shortElementThreshold: config.get('shortElementThreshold', 80),
		preserveUserMultiline: config.get('preserveUserMultiline', true)
	};
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Angular HTML Formatter is now active!');

	// Register document formatting provider
	const documentFormattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
		'html',
		{
			provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
				const fullRange = new vscode.Range(
					document.positionAt(0),
					document.positionAt(document.getText().length)
				);

				const options = getFormattingOptions(document);
				const formattedText = AngularHtmlFormatter.format(document.getText(), options);

				return [vscode.TextEdit.replace(fullRange, formattedText)];
			}
		}
	);

	// Register document range formatting provider
	const rangeFormattingProvider = vscode.languages.registerDocumentRangeFormattingEditProvider(
		'html',
		{
			provideDocumentRangeFormattingEdits(
				document: vscode.TextDocument,
				range: vscode.Range
			): vscode.TextEdit[] {
				const selectedText = document.getText(range);
				const options = getFormattingOptions(document);
				const formattedText = AngularHtmlFormatter.format(selectedText, options);

				return [vscode.TextEdit.replace(range, formattedText)];
			}
		}
	);

	// Register format document command
	const formatDocumentCommand = vscode.commands.registerCommand(
		'angular-html-formatter.formatDocument',
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showInformationMessage('No active editor found.');
				return;
			}

			const document = editor.document;
			const options = getFormattingOptions(document);
			const formattedText = AngularHtmlFormatter.format(document.getText(), options);

			const fullRange = new vscode.Range(
				document.positionAt(0),
				document.positionAt(document.getText().length)
			);

			const edit = new vscode.WorkspaceEdit();
			edit.replace(document.uri, fullRange, formattedText);
			vscode.workspace.applyEdit(edit);
		}
	);

	// Register format selection command
	const formatSelectionCommand = vscode.commands.registerCommand(
		'angular-html-formatter.formatSelection',
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showInformationMessage('No active editor found.');
				return;
			}

			const document = editor.document;
			const selection = editor.selection;

			if (selection.isEmpty) {
				vscode.window.showInformationMessage('No text selected.');
				return;
			}

			const selectedText = document.getText(selection);
			const options = getFormattingOptions(document);
			const formattedText = AngularHtmlFormatter.format(selectedText, options);

			const edit = new vscode.WorkspaceEdit();
			edit.replace(document.uri, selection, formattedText);
			vscode.workspace.applyEdit(edit);
		}
	);

	// Add disposables to context
	context.subscriptions.push(
		documentFormattingProvider,
		rangeFormattingProvider,
		formatDocumentCommand,
		formatSelectionCommand
	);
}

export function deactivate() {
	console.log('Angular HTML Formatter is now deactivated.');
}
