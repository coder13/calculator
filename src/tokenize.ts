const { functions } = require('./constants.ts');
const funcNames = Object.keys(functions);

const regex = /\d+(\.\d+)?|\+|\-|\*|\/|\^|\(|\)|([a-zA-Z]+)/g;

class Token {
  constructor(type, token) {
    this.type = type;
    this.token = token;
  }
}

module.exports.tokenize = function tokenize (expression) {
  let re = expression.match(regex);
  return re.map((token) => {
    if (['+', '-', '*', '/', '^'].indexOf(token) > -1) {
      return new Token('Operator', token);
    } else if (token == '(') {
      return new Token('OpenParen', token);
    } else if (token == ')') {
      return new Token('CloseParen', token);
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

module.exports.Token = Token;
