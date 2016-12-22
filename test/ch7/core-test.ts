import * as test from "tape";
import * as core from "../../src/ch7/core";

let initialEnv: core.Env = core.mtenv;
initialEnv = core.extendEnv(
  core.bind("double", core.closV("x",
                                 core.plusC(core.idC("x"),
                                            core.idC("x")),
                                initialEnv)),
  initialEnv);
initialEnv = core.extendEnv(
  core.bind("quadruple", core.closV("x",
                                    core.appC(core.idC("double"),
                                              core.appC(core.idC("double"),
                                                        core.idC("x"))),
                                   initialEnv)),
  initialEnv
);
initialEnv = core.extendEnv(
  core.bind("const5", core.closV("_ignored", core.numC(5), initialEnv)),
  initialEnv
);

function interparse(str: string): core.Value {
  return core.interp(core.parse(str), initialEnv);
}

test("interp double", (t) => {
  t.deepEquals(interparse("(double 10)"), core.numV(20));
  t.deepEquals(interparse("(double 0)"), core.numV(0));
  t.deepEquals(interparse("(double (const5 0))"), core.numV(10));

  t.end();
});

test("interp quadruple", (t) => {
  t.deepEquals(interparse("(quadruple 10)"), core.numV(40));
  t.deepEquals(interparse("(quadruple 0)"), core.numV(0));
  t.deepEquals(interparse("(quadruple (const5 0))"), core.numV(20));

  t.end();
});

test("from the book", (t) => {
  t.deepEquals(interparse("(+ 10 (const5 10))"), core.numV(15));
  t.deepEquals(interparse("(+ 10 (double (+ 1 2)))"), core.numV(16));
  t.deepEquals(interparse("(+ 10 (quadruple (+ 1 2)))"), core.numV(22));

  t.throws(() => {
    let env = core.mtenv
    env = core.extendEnv(
      core.bind("f2", core.closV("x",
                                 core.plusC(core.idC("x"), core.idC("y")),
                                 env)),
      env
    );
    env = core.extendEnv(
      core.bind("f1", core.closV("x",
                                 core.appC(core.idC("f2"), core.numC(4)),
                                env)),
      env
    )
    core.interp(core.parse("(f1 3)"), env)
    },
    /lookup: name 'y' not found/
  );

  t.end();
});
