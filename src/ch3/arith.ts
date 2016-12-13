import * as grammar from "../parser/grammar";

export interface INumC {
  type: "numC";
  n: number;
}
export function numC(n: number): INumC {
  return {type: "numC", n};
}

export interface IPlusC {
  type: "plusC";
  l: ArithC;
  r: ArithC;
}
export function plusC(l: ArithC, r: ArithC): IPlusC {
  return {type: "plusC", l, r};
}

export interface IMultC {
  type: "multC";
  l: ArithC;
  r: ArithC;
}
export function multC(l: ArithC, r: ArithC): IMultC {
  return {type: "multC", l, r};
}

export type ArithC = INumC | IPlusC | IMultC;

function parseArith(pt: grammar.ParseTree): ArithC {
  switch (pt.type) {
    case "integer":
      return numC(pt.value);
    case "application":
      const fn = pt.es[0];
      if (fn.type === "symbol") {
        switch (fn.value) {
          case "+":
            return plusC(parseArith(pt.es[1]), parseArith(pt.es[2]));
          case "*":
            return multC(parseArith(pt.es[1]), parseArith(pt.es[2]));
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

export function parse(str: string): ArithC {
  const pt = grammar.parse(str);
  return parseArith(pt);
}

export function interp(a: ArithC): number {
  switch (a.type) {
    case "numC":
      return a.n;
    case "plusC":
      return (interp(a.l) + interp(a.r));
    case "multC":
      return (interp(a.l) * interp(a.r));
  }
}
