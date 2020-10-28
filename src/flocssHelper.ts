import * as vscode from "vscode";
import SassMaker from "./SassMaker";
import HtmlDiagnostic, { bemclasses } from "./htmlDiagnostic";
import {getConfigValue} from "./vscodeHelper";

export function activate(context: vscode.ExtensionContext) {
  const outputPoint = getConfigValue("flocssHelper.outputPoint","/sass");
  const sassMaker: SassMaker = new SassMaker();
  const htmlDiagnostic: HtmlDiagnostic = new HtmlDiagnostic();
  vscode.commands.registerCommand("flocssHelper.createsass", () => {
    if (!vscode.window.activeTextEditor) return;
    const activeDocument: vscode.TextDocument =
      vscode.window.activeTextEditor.document;
    if (activeDocument.languageId != "html") return;
    htmlDiagnostic.setHtml(activeDocument.getText());
    createsassfiles(
      htmlDiagnostic.getComponentClasses(),
      sassMaker,
      outputPoint+"/Object/Component/"
    );
    createsassfiles(
      htmlDiagnostic.getProjectClasses(),
      sassMaker,
      outputPoint+"/Object/Project/"
    );
    createsassfiles(htmlDiagnostic.getLayoutClasses(), sassMaker, outputPoint+"/Layout/");
    createsassfiles(
      htmlDiagnostic.getUtilityClasses(),
      sassMaker,
      outputPoint+"/Object/Utility/"
    );
  });
}

function createsassfiles(
  bemClassesArr: bemclasses[],
  sassMaker: SassMaker,
  path: string
) {
  for (const bemClasses of bemClassesArr) {
    const text: string = sassMaker.createSassText(bemClasses);
    const uri: vscode.Uri = vscode.Uri.file(
      vscode.workspace.rootPath +
        path +
        "_" +
        bemClasses.block[0] +
        ".scss"
    );
    vscode.workspace.fs.readFile(uri).then(
      (text: Uint8Array) => {
        console.log("flie exists");
      },
      () => {
        vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(text));
      }
    );
  }
}
