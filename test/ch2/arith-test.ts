import * as test from "tape";
import * as arith from "../../src/ch2/arith";

test("parse numbers", (t) => {
  t.deepEqual(arith.parse("0"), arith.numC(0));
  t.deepEqual(arith.parse("20"), arith.numC(20));

  t.end();
});

test("parse application", (t) => {
  t.deepEqual(arith.parse("(+ 10 2)"), arith.plusC(arith.numC(10), arith.numC(2)));
  t.deepEqual(arith.parse("(* 10 2)"), arith.multC(arith.numC(10), arith.numC(2)));

  t.end();
});
