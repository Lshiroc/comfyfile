import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as jimp from 'jimp';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('convertor.convertTo', (cont) => {

		try {
			let myPath: string = path.normalize(cont.path);
			myPath = myPath.replace('\\', "");
			myPath = myPath.replace(/\\/g, "\\\\");

			let myPathArr: string[] = myPath.split('\\\\');
			let filename: string[] | string = myPathArr!.pop()!.split(".");
			filename = filename + ".png";
			let destination: string = myPathArr.join("\\\\") + "\\\\" + filename;

			jimp.read(myPath, (err, image) => {
				if(err) {
					console.log("Err: ", err);
					return;
				} else {
					image.write(destination)
				}
			})
		} catch(err) {
			console.log("Err: ", err);
		}

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
