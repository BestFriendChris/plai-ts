import * as test from "tape";
import * as core from "../../src/ch6/core";

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
  return core.interp(core.parse(str), core.mtenv, fds);
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

test("from the book", (t) => {
  t.equals(interparse("(+ 10 (const5 10))"), 15);
  t.equals(interparse("(+ 10 (double (+ 1 2)))"), 16);
  t.equals(interparse("(+ 10 (quadruple (+ 1 2)))"), 22);

  t.throws(() => {
    core.interp(core.parse("(f1 3)"),
                core.mtenv,
                [
                  core.funDefC("f1", "x",
                               core.appC("f2", core.numC(4))),
                  core.funDefC("f2", "y",
                               core.plusC(core.idC("x"), core.idC("y"))),
                ])
    },
    /lookup: name not found/
  );

  t.end();
});
