// Borrowed from https://raw.githubusercontent.com/squaremo/scheme-in-js/master/grammar.pegjs
{
  function makeApplication(es) {
    return {
      type: "application",
      es: es
    };
  }

  function makeBool(b) {
    return {
      type: "boolean",
      value: b
    };
  }

  function makeString(str) {
    return {
      type: "string",
      value: str
    };
  }

  function makeSymbol(str) {
    return {
      type: "symbol",
      value: str
    };
  }

  function makeInt(str) {
    return {
      type: "integer",
      value: parseInt(str)
    };
  }
}

start
    = expr:expr { return expr; }

ws = [ \t\n]*

expr = ws "(" ws es:expr* ws ")" { return makeApplication(es); }
     / ws t:term { return t; }

term = bool
     / symbol
     / string
     / number

bool = "#t" { return makeBool(true); }
     / "#f" { return makeBool(false); }

string
  = '"' '"'             { return makeString("");    }
  / '"' chars:char+ '"' { return makeString(chars.join('')); }

/* From JSON example
https://github.com/dmajda/pegjs/blob/master/examples/json.pegjs */

char
  = [^"\\\0-\x1F\x7f]
  / '\\"'  { return '"';  }
  / "\\\\" { return "\\"; }
  / "\\/"  { return "/";  }
  / "\\b"  { return "\b"; }
  / "\\f"  { return "\f"; }
  / "\\n"  { return "\n"; }
  / "\\r"  { return "\r"; }
  / "\\t"  { return "\t"; }
  / "\\u" h1:hexDigit h2:hexDigit h3:hexDigit h4:hexDigit {
      return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
    }

hexDigit
  = [0-9a-fA-F]

symbol
    = head:[^0-9()\[\]\"] tail:[^ \"()\[\]]* { return makeSymbol(head + tail.join('')); } 

number
    = '0'                    { return makeInt(0); }
    / head:[1-9] tail:[0-9]* { return makeInt(head + tail.join('')); }
