import * as vscode from "vscode";
import SassMaker from "./SassMaker";
import HtmlDiagnostic, { bemclasses } from "./htmlDiagnostic";

export function activate(context: vscode.ExtensionContext) {
  const sassMaker: SassMaker = new SassMaker();
  const htmlDiagnostic: HtmlDiagnostic = new HtmlDiagnostic();
  vscode.commands.registerCommand("flocssHelper.createsass", () => {
    if (!vscode.window.activeTextEditor) return;
    const activeDocument: vscode.TextDocument =
      vscode.window.activeTextEditor.document;
    if (activeDocument.languageId != "html") return;
    htmlDiagnostic.setHtml(activeDocument.getText());
    let bemClassesArr: bemclasses[] = htmlDiagnostic.getComponentClasses();
    for (const bemClasses of bemClassesArr) {
      const text: string = sassMaker.createSassText(bemClasses);
      const uri: vscode.Uri = vscode.Uri.file(
        vscode.workspace.rootPath +
          "/scss/Object/component/" +
          bemClasses.block[0] +
          ".scss"
      );
      vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(text));
    }
    bemClassesArr = htmlDiagnostic.getProjectClasses();
    for (const bemClasses of bemClassesArr) {
      const text: string = sassMaker.createSassText(bemClasses);
      console.log(text);
      const uri: vscode.Uri = vscode.Uri.file(
        vscode.workspace.rootPath +
          "/scss/Object/project/" +
          bemClasses.block[0] +
          ".scss"
      );
      vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(text));
    }
    bemClassesArr = htmlDiagnostic.getLayoutClasses();
    for (const bemClasses of bemClassesArr) {
      const text: string = sassMaker.createSassText(bemClasses);
      const uri: vscode.Uri = vscode.Uri.file(
        vscode.workspace.rootPath +
          "/scss/Layout/" +
          bemClasses.block[0] +
          ".scss"
      );
      vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(text));
    }
    bemClassesArr = htmlDiagnostic.getUtilityClasses();
    for (const bemClasses of bemClassesArr) {
      const text: string = sassMaker.createSassText(bemClasses);
      const uri: vscode.Uri = vscode.Uri.file(
        vscode.workspace.rootPath +
          "/scss/Object/Utility/" +
          bemClasses.block[0] +
          ".scss"
      );
      vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(text));
    }
  });
}
