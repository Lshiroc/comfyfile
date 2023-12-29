import * as vscode from 'vscode';

export async function showQuickPick(context: vscode.ExtensionContext,  exceptionExt: string): Promise<string> {
    console.log(exceptionExt);
    let i = 0;
    let fileOptions: string[] = [".png", ".jpeg", ".bmp", ".tiff", ".gif"];
    fileOptions = fileOptions.filter((fileExt) => {
        if(fileExt !== exceptionExt) {
            return fileExt;
        }
    });
    console.log(fileOptions);
    const result = await vscode.window.showQuickPick(fileOptions, {
        placeHolder: "enter something",
        onDidSelectItem: item => vscode.window.showInformationMessage(`Focus: ${++i}: ${item}`)
    });
    vscode.window.showInformationMessage(`Got: ${result}`);

    return result!;
}