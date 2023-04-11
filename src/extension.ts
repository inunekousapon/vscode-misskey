// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DepNodeProvider, Dependency } from './noteDependencies';
import { Stream } from 'misskey-js';
import { WebSocket } from 'ws';

function detailhtml(dep: Dependency): string {
	return `
	<html>
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<style type="text/css">
			.avatar {
				float: left;
				width: 128px;
				height: 128px;
				margin-right: 10px;
			  }
			  
			  .message-body {
				float: right;
				width: calc(100% - 138px);
			  }			  
			</style>
		</head>
		<body>
			<div class="message">
				<img src="${dep.note.user.avatarUrl}" alt="Avatar" class="avatar">
				<div class="message-body">
					<h3 class="username">${dep.note.user.username}</h3>
					<p class="content"><code>${dep.description}</code></p>
					<p class="timestamp">${dep.note.createdAt}</p>
				</div>
			</div>
		</body>
	</html>
	`;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const rootPath =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: undefined;
	const noteDependenciesProvider = new DepNodeProvider(rootPath);
	vscode.window.registerTreeDataProvider(
		'noteDependencies', noteDependenciesProvider
	);

	vscode.commands.registerCommand('noteDependencies.refreshEntry', () => {
		noteDependenciesProvider.clear();
		noteDependenciesProvider.refresh();
	});
	vscode.commands.registerCommand('noteDependencies.showDetail', (node: Dependency) => {
		const panel = vscode.window.createWebviewPanel(
			`${node.note.user.username}さん`,
			`${node.note.user.username}さん`,
			vscode.ViewColumn.Beside,
			{
				enableScripts: true,
				enableFindWidget: true,
			}
		);
		const onDiskPath = context.extensionUri;
		panel.webview.asWebviewUri(onDiskPath);
		panel.webview.html = detailhtml(node);
	});

	const stream = new Stream(
		'<< input misskey server host >>',
		{
			token: '<< input your token >>'
		},
		{
			WebSocket: WebSocket
		}
	);
	const localChannel = stream.useChannel('localTimeline');
	localChannel.on('note', note => {
		noteDependenciesProvider.addNote(note);
		noteDependenciesProvider.refresh();
	});

}

// This method is called when your extension is deactivated
export function deactivate() { }
