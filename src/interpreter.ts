import { AST, Num, Variable, NegationOp, FunctionOp, BinOp } from './ast';
import { Token, TokenType, tokenize } from './tokenize';

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

export default class Interpreter {
  tokens: Token[];
  variables: Map<string, number>;
  currentTokenIndex: number;

  constructor() {
    this.tokens = [];
    this.variables = new Map();
    this.currentTokenIndex = 0;
  }

  getCurrentToken(): Token {
    return this.tokens[this.currentTokenIndex];
  }

  getNextToken(): Token {
    if (!this.tokens[this.currentTokenIndex]) {
      throw new Error('Unexpected end of input at token: ' + this.currentTokenIndex);
    }

    return this.tokens[this.currentTokenIndex++];
  }

  /**
   * Attempts to consume the next token provided it's the same type as specified in the param tokenType
   * @param tokenType the expected token type
   * @returns 
   */
  eat(tokenType: TokenType): Token {
    if (this.getCurrentToken().type === tokenType) {
      return this.getNextToken();
    } else {
      throw new Error(`Syntax error: expected ${tokenType} got: ${this.getCurrentToken().type}`);
    }
  }

  reachedEndOfInput (): boolean {
    return this.currentTokenIndex >= this.tokens.length;
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
        this.currentTokenIndex++;
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

  /**
   * factor: 
   * @returns {AST} either an item or an item raised to an exponent
   */
  factor (): AST {
    let item = this.item();

    if (this.reachedEndOfInput()) {
      return item;
    }

    if (this.getCurrentToken().token === '^') {
      this.currentTokenIndex++;
      return new BinOp(item, new Token('Operator', '^'), this.factor());
    }

    return item;
  }

  /**
   * Eats the next term
   * term: factor((Exp|Mul|Div)factor)*
   * 
   */
  term (): AST {
    let node = this.factor();

    while (!this.reachedEndOfInput()
        && this.getCurrentToken().type === 'Operator'
        && ['^', '*', '/'].indexOf(this.getCurrentToken().token) > -1) {
      node = new BinOp(node, this.getNextToken(), this.factor());
    }

    return node;
  }

  /**
   * Eats the next expression
   * expr: term((Plus|Minus)term)*
   */
  expr (): AST {
    let node = this.term();

    while (!this.reachedEndOfInput()
        && this.getCurrentToken().type === 'Operator'
        && ['+', '-'].indexOf(this.getCurrentToken().token) > -1) {
      
      node = new BinOp(node, this.getNextToken(), this.term());
    }

    return node;
  }

  /**
   * Parses code given as a string into a set of tokens and returns AST
   * @param code {string} a set of string instructions to parse
   * @param state {any}
   * @returns {AST} AST expression ready to be evaluated
   */
  parse(code: string, state?): AST {
    this.tokens = tokenize(code);
    this.variables = state || {};
    this.currentTokenIndex = 0;
    return this.expr();
  }
};
