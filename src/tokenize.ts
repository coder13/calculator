const { functions } = require('./constants');
const funcNames = Object.keys(functions);

const regex = /\d+(\.\d+)?|\+|\-|\*|\/|\^|\(|\)|\[|\]|=|([a-zA-Z]+)/g;

export type TokenType = 
    'Operator'
  | 'OpenParen'
  | 'CloseParen'
  | 'OpenSquareBracket'
  | 'CloseSquareBracket'
  | 'OpenCurlyBrace'
  | 'CloseCurlyBrace'
  | 'Equals'
  | 'Function'
  | 'Variable'
  | 'Number';

export class Token {
  type: TokenType;
  token: string;

  constructor(type: TokenType, token: string) {
    this.type = type;
    this.token = token;
  };
};

export function tokenize (expression: string): Token[] {
  let re = expression.match(regex);
  return re.map((token) => {
    if (['+', '-', '*', '/', '^'].indexOf(token) > -1) {
      return new Token('Operator', token);
    } else if (token == '(') {
      return new Token('OpenParen', token);
    } else if (token == ')') {
      return new Token('CloseParen', token);
    } else if (token == '[') {
      return new Token('OpenSquareBracket', token);
    } else if (token == ']') {
      return new Token('CloseSquareBracket', token);
    } else if (token == '{') {
      return new Token('OpenCurlyBrace', token);
    } else if (token == '}') {
      return new Token('CloseCurlyBrace', token);
    } else if (token == '=') {
      return new Token('Equals', token);
    } else if (/[a-z]+/i.test(token)) {
      if (funcNames.indexOf(token) > -1) {
        return new Token('Function', token);
      } else {
        return new Token('Variable', token);
      }
    } else {
      return new Token('Number', token);
    }
  });
};
