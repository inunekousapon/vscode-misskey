import * as vscode from 'vscode';
import * as https from 'http'
import { entities } from 'misskey-js';

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;
    private deps: Dependency[] = [];
    static readonly maxLength = 50;

	constructor(private workspaceRoot: string | undefined) {
	}

    addNote(note: entities.Note) {
        this.deps.push(new Dependency(
            note,
            vscode.TreeItemCollapsibleState.None
        ));
        while(this.deps.length > DepNodeProvider.maxLength) {
            this.deps.shift();
        }
    }

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

    clear(): void {
        this.deps = [];
    }

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No dependency in empty workspace');
			return Promise.resolve([]);
		}
        if(!element) {
            return Promise.resolve(this.deps.map(d=>d).reverse());
        } else {
            return Promise.resolve([]);
        }
	}
}

export class Dependency extends vscode.TreeItem {

	constructor(
        public readonly note: entities.Note,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
	) {
		super(note.user.name, collapsibleState);
        this.label = this.note.user.name;
		this.description = note.text || note.renote?.text || "???";
        this.tooltip = new vscode.MarkdownString(
            `
            ${this.description}
            ${this.note.createdAt}
            `
        );
        this.command = {
            title: note.user.name,
            command: "noteDependencies.showDetail",
            arguments: [this]
        };
	}

    iconPath = vscode.ThemeIcon.Folder;

	contextValue = 'dependency';
}