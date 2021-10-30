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

type OpenParen = 'OpenParen' | 'OpenSquareBracket' | 'OpenCurlyBrace';
type CloseParen = 'CloseParen' | 'CloseCurlyBrace';
type Parens = OpenParen | CloseParen;

const ExpectedClosingBracket = {
  OpenParen: 'CloseParen',
  OpenSquareBracket: 'CloseSquareBracket',
  OpenCurlyBRace: 'CloseCurlyBrace',
};

export default class Interpreter {
  tokens: Token[];
  parens: Parens[];
  variables: Map<string, number>;
  currentTokenIndex: number;

  constructor() {
    this.tokens = [];
    this.parens = [];
    this.variables = new Map();
    this.currentTokenIndex = 0;
  }

  /**
   * Gets the token specified by the current token index pointer
   * @returns {Token} the next token
   */
  getCurrentToken(): Token {
    return this.tokens[this.currentTokenIndex];
  }

  /**
   * Gets the next token provided we're not at our end of input and increments the current token index pointer
   * @returns {Token} the next token
   */
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
    if (this.reachedEndOfInput()) {
      throw new Error(`Syntax error: unexpected end of input`);
    }

    if (this.getCurrentToken().type === tokenType) {
      return this.getNextToken();
    } else {
      throw new Error(`Syntax error: expected ${tokenType} got: ${this.getCurrentToken().type}`);
    }
  }

  reachedEndOfInput (): boolean {
    return this.currentTokenIndex >= this.tokens.length;
  }

  /**
   * Eats the next item. This item is either a number, a function, or an expression beginning with an open parentheses or negation.
   * @returns {AST} AST representation of the next item
   */
  item(): AST {
    let token = this.getNextToken();

    if (token.token === '-') {
      return new NegationOp(this.factor());
    }

    if (token.type === 'Number') {
      let node = new Num(token.token);

      if (this.reachedEndOfInput()) {
        return node;
      }

      token = this.getCurrentToken();

      if (['OpenParen', 'OpenSquareBracket', 'OpenCurlyBrace', 'Function', 'Variable'].includes(token.type)) {  
        return new BinOp(node, new Token('Operator', '*'), this.factor());
      } else {
        return node;
      }
    } else if (token.type === 'OpenParen' || token.type === 'OpenSquareBracket' || token.type === 'OpenCurlyBrace') {
      this.parens.push(token.type);

      let node = this.expr();

      this.eat(ExpectedClosingBracket[this.parens.pop()]);

      if (!this.reachedEndOfInput()
        && (['OpenParen', 'OpenSquareBracket', 'OpenCurlyBrace'].includes(this.getCurrentToken().type))) {
        this.parens.push(this.getCurrentToken().type as OpenParen);

        this.currentTokenIndex++;
        let expr = this.expr();
        this.eat(ExpectedClosingBracket[this.parens.pop()]);
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

    throw new Error(`Syntax Error: Unexpected token ${token.type}`);
  }

  /**
   * consumes the next factor represented by a number or an number raised to an exponent
   * factor: 
   * @returns {AST} AST representation of the next factor
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
   * Eats the next term represented by a combination of numbers and additions / subtractions
   * term: factor((Exp|Mul|Div)factor)*
   * @returns {AST} AST representation of the next term
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
    this.parens = [];
    this.variables = state || {};
    this.currentTokenIndex = 0;
    return this.expr();
  }
};
