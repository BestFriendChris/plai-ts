export interface IParseInteger {
  type: "integer";
  value: number;
}

export interface IParseSymbol {
  type: "symbol";
  value: string;
}

export type ParseTree = IParseInteger | IParseSymbol;

export function parse(input: string, options?: any): ParseTree;
