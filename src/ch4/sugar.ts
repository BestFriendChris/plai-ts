import * as grammar from "../parser/grammar";
import * as core from "./core";

export type ArithS = INumS | IPlusS | IUMinusS | IBMinusS | IMultS;

export interface INumS {
  type: "numS";
  n: number;
}
export function numS(n: number): INumS {
  return {type: "numS", n};
}

export interface IPlusS {
  type: "plusS";
  l: ArithS;
  r: ArithS;
}
export function plusS(l: ArithS, r: ArithS): IPlusS {
  return {type: "plusS", l, r};
}

export interface IUMinusS {
  type: "uminusS";
  e: ArithS;
}
export function uminusS(e: ArithS): IUMinusS {
  return {type: "uminusS", e};
}

export interface IBMinusS {
  type: "bminusS";
  l: ArithS;
  r: ArithS;
}
export function bminusS(l: ArithS, r: ArithS): IBMinusS {
  return {type: "bminusS", l, r};
}

export interface IMultS {
  type: "multS";
  l: ArithS;
  r: ArithS;
}
export function multS(l: ArithS, r: ArithS): IMultS {
  return {type: "multS", l, r};
}

export function desugar(a: ArithS): core.ArithC {
  switch (a.type) {
    case "numS":
      return core.numC(a.n);
    case "plusS":
      return core.plusC(desugar(a.l), desugar(a.r));
    case "uminusS":
      return core.multC(core.numC(-1), desugar(a.e));
    case "bminusS":
      return core.plusC(desugar(a.l),
                        core.multC(core.numC(-1),
                                   desugar(a.r)));
    case "multS":
      return core.multC(desugar(a.l), desugar(a.r));
  }
}

export function parseArithS(pt: grammar.ParseTree): ArithS {
  switch (pt.type) {
    case "integer":
      return numS(pt.value);
    case "application":
      const fn = pt.es[0];
      if (fn.type === "symbol") {
        switch (fn.value) {
          case "+":
            return plusS(parseArithS(pt.es[1]), parseArithS(pt.es[2]));
          case "-":
            if (pt.es.length === 3) {
              return bminusS(parseArithS(pt.es[1]), parseArithS(pt.es[2]));
            } else if (pt.es.length === 2) {
              return uminusS(parseArithS(pt.es[1]));
            } else {
              throw "invalid number of arguments for negation";
            }
          case "*":
            return multS(parseArithS(pt.es[1]), parseArithS(pt.es[2]));
          default:
            throw "invalid application input";
        }
      } else {
        throw "invalid application input";
      }
    default:
      throw "invalid input";
  }
}

export function parse(str: string): core.ArithC {
  const pt = grammar.parse(str);
  const surface = parseArithS(pt);
  return desugar(surface);
}
