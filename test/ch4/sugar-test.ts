import * as test from "tape";
import * as core from "../../src/ch4/core";
import * as sugar from "../../src/ch4/sugar";

function interparse(str: string): number {
  return core.interp(sugar.parse(str));
}

test("interp numbers", (t) => {
  t.equals(interparse("2"), 2);
  t.equals(interparse("0"), 0);

  t.end();
});

test("interp addition", (t) => {
  t.equals(interparse("(+ 1 2)"), 3);
  t.equals(interparse("(+ 10 20)"), 30);

  t.end();
});

test("interp subtraction", (t) => {
  t.equals(interparse("(- 10 2)"), 8);
  t.equals(interparse("(- 20 10)"), 10);
  t.equals(interparse("(- 20 20)"), 0);

  t.end();
});

test("interp mult", (t) => {
  t.equals(interparse("(* 1 2)"), 2);
  t.equals(interparse("(* 10 0)"), 0);

  t.end();
});
