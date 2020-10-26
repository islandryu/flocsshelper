import SassMaker from "../SassMaker";
import { bemclasses } from "../htmlDiagnostic";
import fs from "fs";

const sassMakaer = new SassMaker();
describe("createSassText", () => {
  it("return text of sass", () => {
    const classes: bemclasses = {
      block: ["c-card"],
      element: ["c-card__content", "c-card__title"],
      modifier: ["c-card--red"],
    };
    const expected = ".c-card {\n  &__content {\n  }\n  &__title {\n  }\n  &--red {\n  }\n}\n";
    expect(sassMakaer.createSassText(classes)).toEqual(expected);
  });
});
