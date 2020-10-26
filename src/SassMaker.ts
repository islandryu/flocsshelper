import { bemclasses } from "./htmlDiagnostic";
import prettier from "prettier";
export default class SassMaker {
  constructor() {}
  createSassText(classes: bemclasses) {
    let ret = "." + classes.block[0] + "{";
    for (let element of classes.element) {
      let seperatedElement: string[] | null = element.match(/^.+?__(.+)/);
      if (!seperatedElement) continue;
      let elementName: string = seperatedElement[1];
      ret += "&__" + elementName + "{}";
    }
    for (let modifier of classes.modifier) {
      let seperatedModifier: string[] | null = modifier.match(/^.+?--(.+)/);
      if (!seperatedModifier) continue;
      let modifierName: string = seperatedModifier[1];
      ret += "&--" + modifierName + "{}";
    }
    ret += "}";
    ret = prettier.format(ret, { semi: false, parser: "scss" });
    return ret;
  }
}
