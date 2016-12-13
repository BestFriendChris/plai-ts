export interface IParseInteger {
  type: "integer";
  value: number;
}

export interface IParseSymbol {
  type: "symbol";
  value: string;
}

export interface IParseString {
  type: "string";
  value: string;
}

export interface IParseBool {
  type: "bool";
  value: boolean;
}

export interface IParseApplication {
  type: "application";
  es: ParseTree[];
}

export type ParseTree = IParseInteger
                      | IParseSymbol
                      | IParseString
                      | IParseBool
                      | IParseApplication;

export function parse(input: string, options?: any): ParseTree;
