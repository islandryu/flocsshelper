export type bemclasses = {
  block: string[];
  element: string[];
  modifier: string[];
};
export default class HtmlDiagnostic {
  html: string;
  elementRegExp: RegExp;
  modifierRegExp: RegExp;
  layoutRegExp: RegExp;
  componentRegExp: RegExp;
  projectRegExp: RegExp;
  utilityRegExp: RegExp;
  classes: string[];
  constructor() {
    this.html = ``;
    this.elementRegExp = /^.+__.+$/;
    this.modifierRegExp = /^.+--.+$/;
    this.layoutRegExp = /^l-.+$/;
    this.componentRegExp = /^c-.+$/;
    this.projectRegExp = /^p-.+$/;
    this.utilityRegExp = /^u-.+$/;
    this.classes = [];
  }
  setHtml(html: string): void {
    this.html = html;
    this.classes = this.getClasses();
  }
  getClasses(): string[] {
    const elements: string[] | null = this.html.match(/<.+?class=".+?".*?>/g);
    const classes: string[] = [];
    if (!elements) {
      return classes;
    }
    for (let element of elements) {
      let _class: string[] | null = element.match(/class="(.+?)"/);
      if (!_class) {
        continue;
      }
      let seperatedClasses: string[] = _class[1].split(" ");
      for (let seperatedClass of seperatedClasses) {
        classes.push(seperatedClass);
      }
    }
    const ret: string[] = classes.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });
    return ret;
  }
  classifyByBem(classes: string[]): bemclasses {
    const block: string[] = [];
    const element: string[] = [];
    const modifier: string[] = [];
    for (let _class of classes) {
      if (this.elementRegExp.test(_class)) {
        element.push(_class);
      } else if (this.modifierRegExp.test(_class)) {
        modifier.push(_class);
      } else {
        block.push(_class);
      }
    }
    return { block, element, modifier };
  }

  isBlock(className: string): boolean {
    return !this.isElement(className) && !this.isModifier(className);
  }

  isElement(className: string): boolean {
    return this.elementRegExp.test(className);
  }

  isModifier(className: string): boolean {
    return this.modifierRegExp.test(className);
  }

  getClassesByRegExp(regExp: RegExp) {
    const componentClasses: string[] = [];
    for (let _class of this.getClasses()) {
      if (!regExp.test(_class)) continue;
      componentClasses.push(_class);
    }
    componentClasses.sort();
    const ret: bemclasses[] = [];
    for (let i = 0; i < componentClasses.length; i++) {
      if (!this.isBlock(componentClasses[i])) continue;
      let bemClasses: string[] = [];
      bemClasses.push(componentClasses[i]);
      while (!this.isBlock(componentClasses[+i + 1])) {
        i++;
        bemClasses.push(componentClasses[i]);
      }
      ret.push(this.classifyByBem(bemClasses));
    }
    return ret;
  }

  getComponentClasses(): bemclasses[] {
    return this.getClassesByRegExp(this.componentRegExp);
  }
  getProjectClasses(): bemclasses[] {
    return this.getClassesByRegExp(this.projectRegExp);
  }
  getLayoutClasses(): bemclasses[] {
    return this.getClassesByRegExp(this.layoutRegExp);
  }
  getUtilityClasses(): bemclasses[] {
    return this.getClassesByRegExp(this.utilityRegExp);
  }
}
