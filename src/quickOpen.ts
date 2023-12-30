import * as vscode from 'vscode';

export async function showQuickPick(context: vscode.ExtensionContext,  exceptionExt: string): Promise<string> {
    console.log(exceptionExt);
    let i = 0;
    let fileOptions: string[] = [".png", ".jpeg", ".bmp", ".tiff", ".gif"];
    let fileOptionsSvg: string[] = [".png", ".jpeg", ".webp"];

    fileOptions = fileOptions.filter((fileExt) => {
        if(fileExt !== exceptionExt) {
            return fileExt;
        }
    });
    
    const result = await vscode.window.showQuickPick(exceptionExt === ".svg" ? fileOptionsSvg : fileOptions, {
        placeHolder: "enter something",
        // onDidSelectItem: item => vscode.window.showInformationMessage(`Focus: ${++i}: ${item}`)
    });

    return result!;
}