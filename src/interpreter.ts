import { Num, Variable, NegationOp, FunctionOp, BinOp } from './ast';
import { Token, tokenize } from './tokenize';

/*
  Variables todo:
  want: addition, subtraction, multiplication, division, exponetiation
  we need "expressions" to be a set of adding terms
  this expression object should have a set of expression terms that it multiplies to
  should also have an exponent expression
  we need to handle adding like terms, multiplying different terms, canceling out like terms, subtracting like terms

  This expression object should have functions for the 5 operations

  maybe handle distribution? Multiply expression by expression to get another expression
  raising expression to an integer value can do distribution: for all values in A, multiply all values B, create expression, evaluate expression: (2+t)(3+v)de

*/

class Term {
  value: number;
  factor: number;

  constructor(value: number, factor: number = 1) {
    this.value = value;
    this.factor = factor || 1;
  }

  simplify() {

  }

  evaluate() {
    
  }
};

class Expression {
  terms: Term[];
  exponent: Term;

  constructor() {
    this.terms = [];
    this.exponent = new Term(1);
  }

  simplify() {

  }

  evaluate() {

  }
};


class Interpreter {
  tokens: Token[];
  variables: Map<string, number>;
  currentToken: number;

  constructor() {
    this.tokens = [];
    this.variables = new Map();
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
      return new NegationOp(this.factor());
    }

    if (token.type === 'Number') {
      let node = new Num(token.token);

      token = this.getCurrentToken();
      if (!!token && ['OpenParen', 'Function', 'Variable'].indexOf(token.type) > -1) {
        return new BinOp(node, new Token('Operator', '*'), this.factor());
      } else {
        return node;
      }
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
    } else if (token.type === 'Variable') {
      return new Variable(token.token);
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