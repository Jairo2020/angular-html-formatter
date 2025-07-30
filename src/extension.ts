/**
 * Angular HTML Formatter Extension
 * Entry point for VS Code extension
 */

import * as vscode from 'vscode';
import { AngularHtmlFormatter } from './formatter';
import { IndentationDetector } from './indentation';

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

				const options = IndentationDetector.getIndentationOptions(document);
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
				const options = IndentationDetector.getIndentationOptions(document);
				const formattedText = AngularHtmlFormatter.format(selectedText, options);

				return [vscode.TextEdit.replace(range, formattedText)];
			}
		}
	);

	// Register manual formatting command
	const formatCommand = vscode.commands.registerCommand(
		'angular-html-formatter.format',
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showInformationMessage('No active editor found.');
				return;
			}

			const selection = editor.selection;

			if (selection.isEmpty) {
				// Format entire document
				vscode.commands.executeCommand('editor.action.formatDocument');
			} else {
				// Format selection
				vscode.commands.executeCommand('editor.action.formatSelection');
			}
		}
	);

	// Register format document command
	const formatDocumentCommand = vscode.commands.registerCommand(
		'angular-html-formatter.formatDocument',
		() => {
			vscode.commands.executeCommand('editor.action.formatDocument');
		}
	);

	// Register format selection command
	const formatSelectionCommand = vscode.commands.registerCommand(
		'angular-html-formatter.formatSelection',
		() => {
			vscode.commands.executeCommand('editor.action.formatSelection');
		}
	);

	// Add disposables to context
	context.subscriptions.push(
		documentFormattingProvider,
		rangeFormattingProvider,
		formatCommand,
		formatDocumentCommand,
		formatSelectionCommand
	);
}

export function deactivate() {
	console.log('Angular HTML Formatter is now deactivated.');
}
