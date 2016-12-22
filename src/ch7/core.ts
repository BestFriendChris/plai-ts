import * as grammar from "../parser/grammar";

/********************************************************************************\
* Env
\********************************************************************************/

export type Symbol = string;

export interface IBinding {
  name: Symbol;
  val: Value;
}
export function bind(name: Symbol, val: Value): IBinding {
  return {name, val};
}

export type Env = IBinding[];
export const mtenv : IBinding[] = [];
export function extendEnv(binding: IBinding, env: Env): Env {
  return [binding].concat(env);
}

/********************************************************************************\
* Values
\********************************************************************************/

export type Value = INumV | IClosV;

export interface INumV {
  type: "numV";
  n: number;
}
export function numV(n: number): INumV {
  return {type: "numV", n};
}

export interface IClosV {
  type: "closV";
  arg: Symbol;
  body: ExprC;
  env: Env;
}
export function closV(arg: Symbol, body: ExprC, env: Env): IClosV {
  return {type: "closV", arg, body, env};
}

/********************************************************************************\
* ExprC
\********************************************************************************/

export type ExprC = INumC | IIdC | IPlusC | IMultC | IAppC | ILamC;

export interface INumC {
  type: "numC";
  n: number;
}
export function numC(n: number): INumC {
  return {type: "numC", n};
}

export interface IIdC {
  type: "idC";
  s: Symbol;
}
export function idC(s: Symbol): IIdC {
  return {type: "idC", s};
}

export interface IPlusC {
  type: "plusC";
  l: ExprC;
  r: ExprC;
}
export function plusC(l: ExprC, r: ExprC): IPlusC {
  return {type: "plusC", l, r};
}

export interface IMultC {
  type: "multC";
  l: ExprC;
  r: ExprC;
}
export function multC(l: ExprC, r: ExprC): IMultC {
  return {type: "multC", l, r};
}

export interface IAppC {
  type: "appC";
  fun: ExprC;
  arg: ExprC;
}
export function appC(fun: ExprC, arg: ExprC): IAppC {
  return {type: "appC", fun, arg};
}

export interface ILamC {
  type: "lamC";
  arg: Symbol;
  body: ExprC;
}
export function lamC(arg: Symbol, body: ExprC): ILamC {
  return {type: "lamC", arg, body};
}

/********************************************************************************\
* Parsing
\********************************************************************************/

export function parseExpr(pt: grammar.ParseTree): ExprC {
  switch (pt.type) {
    case "integer":
      return numC(pt.value);
    case "application":
      const fn = pt.es[0];
      if (fn.type === "symbol") {
        switch (fn.value) {
          case "+":
            return plusC(parseExpr(pt.es[1]), parseExpr(pt.es[2]));
          case "*":
            return multC(parseExpr(pt.es[1]), parseExpr(pt.es[2]));
          default:
            return appC(parseExpr(fn), parseExpr(pt.es[1]));
        }
      } else {
        throw "invalid application input";
      }
    case "symbol":
      return idC(pt.value);
    default:
      throw `invalid input: ${pt.type}`;
  }
}

export function parse(str: string): ExprC {
  const pt = grammar.parse(str);
  return parseExpr(pt);
}

/********************************************************************************\
* Interp
\********************************************************************************/

export function interp(a: ExprC, env: Env): Value {
  switch (a.type) {
    case "numC":
      return numV(a.n);
    case "idC":
      return lookup(a.s, env);
    case "appC":
      const fd = interp(a.fun, env);
      if (fd.type == "closV") {
        return interp(fd.body,
                      extendEnv(bind(fd.arg,
                                     interp(a.arg, env)),
                               fd.env));
      } else {
        throw "interp: Not a function";
      }
    case "lamC":
      return closV(a.arg, a.body, env);
    case "plusC":
      return numPlus(interp(a.l, env), interp(a.r, env));
    case "multC":
      return numMult(interp(a.l, env), interp(a.r, env));
  }
}

function numPlus(l: Value, r: Value): Value {
  if (l.type == "numV" && r.type == "numV") {
    return numV(l.n + r.n);
  }
  throw "numPlus: one argument was not a number";
}

function numMult(l: Value, r: Value): Value {
  if (l.type == "numV" && r.type == "numV") {
    return numV(l.n * r.n);
  }
  throw "numMult: one argument was not a number";
}

function lookup(s: Symbol, env: Env): Value {
  for(let binding of env) {
    if (binding.name === s) {
      return binding.val;
    }
  }
  throw `lookup: name '${s}' not found`;
}
