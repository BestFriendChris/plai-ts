import * as grammar from "../parser/grammar";

export type Symbol = string;

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

function subst(what: ExprC, forS: Symbol, inE: ExprC): ExprC {
  switch (inE.type) {
    case "numC":
      return inE;
    case "idC":
      return (inE.s === forS) ? what : inE;
    case "appC":
      return appC(inE.fun, subst(what, forS, inE.arg));
    case "plusC":
      return plusC(subst(what, forS, inE.l),
                   subst(what, forS, inE.r));
    case "multC":
      return multC(subst(what, forS, inE.l),
                   subst(what, forS, inE.r));
  }
}

function getFundef(n: Symbol, fds: IFunDefC[]): IFunDefC {
  for (const fd of fds) {
    if (fd.name === n) {
      return fd;
    }
  }
  throw "reference to undefined function";
}

export function interp(a: ExprC, fds: IFunDefC[]): number {
  switch (a.type) {
    case "numC":
      return a.n;
    case "idC":
      throw "interp shouldn't get here";
    case "appC":
      const fd = getFundef(a.fun, fds);
      return interp(subst(a.arg,
                          fd.arg,
                          fd.body),
                    fds);
    case "plusC":
      return (interp(a.l, fds) + interp(a.r, fds));
    case "multC":
      return (interp(a.l, fds) * interp(a.r, fds));
  }
}
