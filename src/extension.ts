import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as jimp from 'jimp';
import { showQuickPick } from './quickOpen';
import * as imageConversion from 'image-conversion';
import { createCanvas, loadImage } from 'canvas';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('convertor.convertTo', async (cont) => {
		try {
			const options: { [key: string]: (context: vscode.ExtensionContext, exceptionExt: string) => Promise<string>} = {
				"Convert the Image": showQuickPick
			};
			const quickPick = vscode.window.createQuickPick();
			quickPick.items = Object.keys(options).map(label => ({ label }));
			quickPick.onDidChangeSelection(async selection => {
				console.log(`selection: ${JSON.stringify(selection)}`);
				if(selection[0]) {
					
					// Prettifiying path of file
					let myPath: string = path.normalize(cont.path);
					myPath = myPath.replace('\\', "");
					myPath = myPath.replace(/\\/g, "\\\\");
					
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
						// console.log('c:/Users/Zeynal/Desktop/projects/STEAM SAF Hackathon 2023/questify/src/assets/images/featuresIcon2.svg')
						// const canvas = createCanvas(1, 1);
						// const image = loadImage("c:/Users/Zeynal/Desktop/projects/STEAM SAF Hackathon 2023/questify/src/assets/images/map3.png");
						// (await image).onload = async () => {
							// canvas.width = (await image).width;
							// canvas.height = (await image).height;
						// 
							// const ctx = canvas.getContext('2d');
							// ctx.drawImage(await image, 0, 0);
						// 
							// const width = (await image).width;
							// const height = (await image).height;
							// console.log(width, height);
						// }

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
