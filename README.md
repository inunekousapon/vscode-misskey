# 使い方

```
git clone https://github.com/inunekousapon/vscode-misskey.git
cd vscode-misskey
npm install
```

extensions.tsの下記にmisskeyのURLとトークンを設定。
URLは `https://misskey.io` とか入れる。

```typescript
	const stream = new Stream(
		'<< input misskey server host >>',
		{
			token: '<< input your token >>'
		},
		{
			WebSocket: WebSocket
		}
	);
```

VSCodeで開いてRun Extensionでデバッグ。
