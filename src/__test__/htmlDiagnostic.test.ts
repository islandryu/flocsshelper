import HtmlDiagnostic from "../htmlDiagnostic";

const html = `
    <header class="l-header">
        <div class="p-logo">
            <img class="p-logo__image"></img>
            <div class="p-logo__text"></div>
        </div>
        <div class="c-card c-card--red">
            <h3 class="c-card__title"></h3>
            <div class="c-card__content"></div>
        </div>
    </header>
`;
const htmlDiagnostic = new HtmlDiagnostic();
htmlDiagnostic.setHtml(html);
describe("setHtml", () => {
  it("set htmlText in html ", () => {
    htmlDiagnostic.setHtml(html);
    expect(htmlDiagnostic.html).toBe(html);
  });
});
describe("getClasses", () => {
  it("return classes of html", () => {
    const expected = [
      "l-header",
      "p-logo",
      "p-logo__image",
      "p-logo__text",
      "c-card",
      "c-card--red",
      "c-card__title",
      "c-card__content",
    ];
    expect(htmlDiagnostic.classes).toEqual(expected);
  });
  it("removes duplicates",()=>{
    const htmlDiagnostic = new HtmlDiagnostic();
    htmlDiagnostic.setHtml(`<div class="l-header__test"></div><div class="l-header__test"></div>`);
    const expected = [
      "l-header__test"
    ]
    expect(htmlDiagnostic.classes).toEqual(expected);
  })
});
describe("classifyByBem", () => {
  it("classify classes into block,element and modifier", () => {
    const expected = {
      block: ["c-card"],
      element: ["c-card__title", "c-card__content"],
      modifier: ["c-card--red"],
    };
    const classes = [
      "c-card",
      "c-card__title",
      "c-card__content",
      "c-card--red",
    ];
    expect(htmlDiagnostic.classifyByBem(classes)).toEqual(expected);
  });
});

describe("isBlock", () => {
  it("return true if class is block", () => {
    expect(htmlDiagnostic.isBlock("c-card")).toBeTruthy();
  });
});
describe("isElement", () => {
  it("return true if class is element", () => {
    expect(htmlDiagnostic.isElement("c-card__title")).toBeTruthy();
  });
});
describe("isModifier", () => {
  it("return true if class is modifier", () => {
    expect(htmlDiagnostic.isModifier("c-card--red")).toBeTruthy();
  });
});
describe("getComponentClasses", () => {
  const componentClasses = htmlDiagnostic.getComponentClasses();
  it("return component classes and its children", () => {
    const expected = {
      block: ["c-card"],
      element: ["c-card__content", "c-card__title"],
      modifier: ["c-card--red"],
    };
    expect(componentClasses[0]).toEqual(expected);
  });
  it("return array with correct numer of component classes", () => {
    expect(componentClasses.length).toBe(1);
  });
});
