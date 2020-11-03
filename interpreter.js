const { Num, NegationOp, FunctionOp, BinOp } = require('./ast');
const tokenize = require('./tokenize');

class Interpreter {
  constructor() {
    this.tokens = [];
    this.variables = {};
    this.currentToken = 0;
  }

  getCurrentToken() {
    return this.tokens[this.currentToken];
  }

  getNextToken() {
    if (!this.tokens[this.currentToken]) {
      throw new Error('Unexpected end of input at token: ' + this.currentToken);
    }

    return this.tokens[this.currentToken++];
  }

  eat(tokenType) {
    if (this.getCurrentToken().type === tokenType) {
      return this.getNextToken();
    } else {
      throw new Error(`Syntax error: expected ${tokenType} got: ${this.getCurrentToken().type}`);
    }
  }

  reachedEndOfInput () {
    return this.currentToken >= this.tokens.length;
  }

  item() {
    let token = this.getNextToken();

    if (token.token === '-') {
      return new NegationOp(this.term());
    }

    if (token.type === 'Number') {
      return new Num(token.token);
    } else if (token.type === 'OpenParen') {
      let node = this.expr();

      this.eat('CloseParen');

      if (!this.reachedEndOfInput() && this.getCurrentToken().type === 'OpenParen') {
        this.currentToken++;
        let expr = this.expr();
        this.eat('CloseParen');
        return new BinOp(node, new Token('Operator', '*'), expr);
      }

      return node;
    } else if (token.type === 'Function') {
      this.eat('OpenParen');
      let arg = this.expr();
      this.eat('CloseParen');
      return new FunctionOp(token, arg);
    }

    throw new Error(`Undefined token: ${token.type}`);
  }

  factor () {
    let item = this.item();

    if (this.reachedEndOfInput()) {
      return item;
    }

    if (this.getCurrentToken().token === '^') {
      this.currentToken++;
      return new BinOp(item, new Token('Operator', '^'), this.factor());
    }

    return item;
  }

  term () {
    let node = this.factor();

    while (!this.reachedEndOfInput()
        && this.getCurrentToken().type === 'Operator'
        && ['^', '*', '/'].indexOf(this.getCurrentToken().token) > -1) {
      node = new BinOp(node, this.getNextToken(), this.factor());
    }

    return node;
  }

  expr () {
    let node = this.term();

    while (!this.reachedEndOfInput()
        && this.getCurrentToken().type === 'Operator'
        && ['+', '-'].indexOf(this.getCurrentToken().token) > -1) {
      node = new BinOp(node, this.getNextToken(), this.term());
    }

    return node;
  }

  parse (code, state) {
    this.tokens = tokenize(code);
    this.variables = state || {};
    this.currentToken = 0;
    return this.expr();
  }
};

module.exports = Interpreter;