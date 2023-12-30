import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as jimp from 'jimp';
import { showQuickPick } from './quickOpen';
import * as svgToImg from '@nodepit/svg-to-img';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('convertor.convertTo', async (cont) => {
		try {
			let myPath: string;
			if(!Object.hasOwn(cont || {}, "path")) {
				let selectedFile: vscode.Uri[] | undefined = await vscode.window.showOpenDialog({
					canSelectFiles: true,
				});
				
				if(selectedFile === undefined) return;
				myPath = selectedFile[0].fsPath;
			} else {
				myPath = path.normalize(cont.path);
			}

			const options: { [key: string]: (context: vscode.ExtensionContext, exceptionExt: string) => Promise<string>} = {
				"Convert the Image": showQuickPick
			};
			const quickPick = vscode.window.createQuickPick();
			quickPick.items = Object.keys(options).map(label => ({ label }));
			quickPick.onDidChangeSelection(async selection => {
				console.log(`selection: ${JSON.stringify(selection)}`);
				if(selection[0]) {
					// Prettifiying path of file
					myPath = myPath.replace('\\c', "c");
					myPath = myPath.replace(/\\/g, "\\\\");
					console.log("myPath", myPath);

					let myPathArr: string[] = myPath.split('\\\\');
					let filename: string[] | string = myPathArr!.pop()!.split(".");
					
					let fileExtension: string = "";
					await options[selection[0].label](context, `.${filename[1]}`)
					.then(res => {if(res !== undefined) {fileExtension = res}})
					.catch(console.error);
					
					// configuring the path of destination
					let sourceFileExt: string = filename[1];
					filename = filename[0] + fileExtension;
					let destination: string = myPathArr.join("\\\\") + "\\\\" + filename;
					if(sourceFileExt === "svg") {
						const svgBuffer = fs.readFileSync(myPath);
						if(fileExtension === ".png") {
							(async () => {
								await svgToImg.from(svgBuffer).toPng({
									path: destination
								});
							})();
						} else if(fileExtension === ".jpeg") {
							(async () => {
								await svgToImg.from(svgBuffer).toJpeg({
									path: destination
								});
							})();
						} else if(fileExtension === ".webp") {
							(async () => {
								await svgToImg.from(svgBuffer).toWebp({
									path: destination
								});
							})();
						}
					} else {
						jimp.default.read(myPath, (err, image) => {
							if(err) {
								console.log("Err: ", err);
								return;
							} else {
								image.write(destination)
							}
						})
					}
				}
			});

			quickPick.onDidHide(() => quickPick.dispose());
			quickPick.show();

		} catch(err) {
			console.log("Err: ", err);
		}

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
