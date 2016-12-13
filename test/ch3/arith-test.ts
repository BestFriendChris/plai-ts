import * as test from "tape";
import * as arith from "../../src/ch3/arith";

function interparse(str: string): number {
  return arith.interp(arith.parse(str));
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

test("interp mult", (t) => {
  t.equals(interparse("(* 1 2)"), 2);
  t.equals(interparse("(* 10 0)"), 0);

  t.end();
});
