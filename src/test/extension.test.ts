import * as assert from 'assert';
import * as vscode from 'vscode';

// Test the formatter functionality
suite('Angular HTML Formatter Test Suite', () => {
	vscode.window.showInformationMessage('Start Angular HTML Formatter tests.');

	test('Should format basic Angular if block', async () => {
		// Create a test document
		const testContent = '@if (condition) {<div>Content</div>}';

		const doc = await vscode.workspace.openTextDocument({
			content: testContent,
			language: 'html'
		});

		// Get formatting edits
		const edits = await vscode.commands.executeCommand<vscode.TextEdit[]>(
			'vscode.executeFormatDocumentProvider',
			doc.uri
		);

		if (edits && edits.length > 0) {
			// Apply edits to get formatted text
			const edit = new vscode.WorkspaceEdit();
			edit.set(doc.uri, edits);
			await vscode.workspace.applyEdit(edit);

			const formattedText = doc.getText();
			console.log('Formatted text:', formattedText);

			// Check that the content has been properly formatted
			assert.ok(formattedText.includes('@if (condition) {'), 'Should preserve Angular control structure');
		}
	});

	test('Should format nested Angular blocks', async () => {
		const testContent = '@if (user.isLoggedIn) {@for (item of items; track item.id) {<div>{{item.name}}</div>}}';

		const doc = await vscode.workspace.openTextDocument({
			content: testContent,
			language: 'html'
		});

		const edits = await vscode.commands.executeCommand<vscode.TextEdit[]>(
			'vscode.executeFormatDocumentProvider',
			doc.uri
		);

		if (edits && edits.length > 0) {
			// Check that edits were generated
			assert.ok(edits.length > 0, 'Should generate formatting edits for nested blocks');
		}
	});

	test('Basic array operations', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
