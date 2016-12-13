import * as test from "tape";
import * as core from "../../src/ch5/core";

const fds: core.IFunDefC[] = [
  core.funDefC("double", "x",
               core.plusC(core.idC("x"),
                          core.idC("x"))),
  core.funDefC("quadruple", "x",
               core.appC("double",
                         core.appC("double",
                                   core.idC("x")))),
  core.funDefC("const5", "_ignored",
               core.numC(5)),
];

function interparse(str: string): number {
  return core.interp(core.parse(str), fds);
}

test("interp double", (t) => {
  t.equals(interparse("(double 10)"), 20);
  t.equals(interparse("(double 0)"), 0);
  t.equals(interparse("(double (const5 0))"), 10);

  t.end();
});

test("interp quadruple", (t) => {
  t.equals(interparse("(quadruple 10)"), 40);
  t.equals(interparse("(quadruple 0)"), 0);
  t.equals(interparse("(quadruple (const5 0))"), 20);

  t.end();
});
