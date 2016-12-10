import * as test from "tape";
import { parse } from "../../src/parser/grammar";

test("parse numbers", (t) => {
  t.deepEqual(parse("0"), { type: "integer", value: 0 });
  t.deepEqual(parse("2"), { type: "integer", value: 2 });

  t.end();
});

test("parse symbol", (t) => {
  t.deepEqual(parse("foo"), { type: "symbol", value: "foo" });
  t.deepEqual(parse("+"),   { type: "symbol", value: "+" });

  t.end();
});

test("parse string", (t) => {
  t.deepEqual(parse('"0"'),   { type: "string", value: "0" });
  t.deepEqual(parse('"+"'),   { type: "string", value: "+" });
  t.deepEqual(parse('"foo"'), { type: "string", value: "foo" });

  t.end();
});

test("parse boolean", (t) => {
  t.deepEqual(parse("#t"), { type: "boolean", value: true });
  t.deepEqual(parse("#f"), { type: "boolean", value: false });

  t.end();
});
