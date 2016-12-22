import * as grammar from "../parser/grammar";

export type Symbol = string;

export interface IBinding {
  name: Symbol;
  val: number;
}
export function bind(name: Symbol, val: number): IBinding {
  return {name, val};
}

export type Env = IBinding[];
export const mtenv : IBinding[] = [];
export function extendEnv(binding: IBinding, env: Env): Env {
  return [binding].concat(env);
}

export interface IFunDefC {
  type: "funDefC";
  name: Symbol;
  arg: Symbol;
  body: ExprC;
}
export function funDefC(name: Symbol, arg: Symbol, body: ExprC): IFunDefC {
  return {type: "funDefC", name, arg, body};
}

export type ExprC = INumC | IIdC | IPlusC | IMultC | IAppC;

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
  fun: Symbol;
  arg: ExprC;
}
export function appC(fun: Symbol, arg: ExprC): IAppC {
  return {type: "appC", fun, arg};
}

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
            return appC(fn.value, parseExpr(pt.es[1]));
        }
      } else {
        throw "invalid application input";
      }
    default:
      throw "invalid input";
  }
}

export function parse(str: string): ExprC {
  const pt = grammar.parse(str);
  return parseExpr(pt);
}

function getFundef(n: Symbol, fds: IFunDefC[]): IFunDefC {
  for (const fd of fds) {
    if (fd.name === n) {
      return fd;
    }
  }
  throw "reference to undefined function";
}

function lookup(s: Symbol, env: Env): number {
  for(let binding of env) {
    if (binding.name === s) {
      return binding.val;
    }
  }
  throw "lookup: name not found";
}

export function interp(a: ExprC, env: Env, fds: IFunDefC[]): number {
  switch (a.type) {
    case "numC":
      return a.n;
    case "idC":
      return lookup(a.s, env);
    case "appC":
      const fd = getFundef(a.fun, fds);
      return interp(fd.body,
                    extendEnv(bind(fd.arg,
                                   interp(a.arg, env, fds)),
                             mtenv),
                    fds);
    case "plusC":
      return (interp(a.l, env, fds) + interp(a.r, env, fds));
    case "multC":
      return (interp(a.l, env, fds) * interp(a.r, env, fds));
  }
}
