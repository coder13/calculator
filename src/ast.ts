import { functions } from './constants';
import { Token } from './tokenize';

export abstract class AST {
  type: string;

  constructor(type) {
    this.type = type;
  }

  abstract evaluate(): number;
  abstract toString(): string;
}

export class BinOp extends AST {
  left: BinOp;
  op: Token;
  right: BinOp;

  constructor(left, op, right) {
    super('Operator');
    this.left = left;
    this.op = op;
    this.right = right;
  }

  evaluate(): number {
    let left = this.left.evaluate();
    let right = this.right.evaluate();

    switch (this.op.token) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        if (right === 0) {
          throw new Error('Division by zero');
        }
        return left / right;
      case '^':
        return Math.pow(left, right);
      default:
        throw new Error('Undefined operator: ' + this.op);
    }
  }

  toString(): string {
    return `(${this.left.toString()} ${this.op.token} ${this.right.toString()})`;
  }
}

export class FunctionOp extends AST {
  name: Token;
  argument: AST;

  constructor(name, arg) {
    super('Function');
    this.name = name;
    this.argument = arg;
  }

  evaluate(): number {
    if (!functions[this.name.token.toLowerCase()]) {
      throw new Error('Undefined function');
    }
    let arg = this.argument.evaluate();
    const result = functions[this.name.token.toLowerCase()](arg);
    if (!Number.isFinite(result)) {
      throw new Error(`Output of ${this.name.token.toLowerCase()} undefined on input ${arg}`);
    }

    return result;
  }

  toString(): string {
    return `${this.name.token.toLowerCase()}(${this.argument})`;
  }
}

export class NegationOp extends AST {
  term: AST;

  constructor(term) {
    super('Negate');
    this.term = term;
  }

  evaluate(): number {
    return -this.term.evaluate();
  }

  toString(): string {
    return `-${this.term.toString()}`;
  }
}

export class Num extends AST {
  token: Token;

  constructor(token) {
    super('Number');
    this.token = token;
  }

  evaluate(): number {
    return +this.token;
  }

  toString(): string {
    return this.token.toString();
  }
}

export class Variable extends AST {
  token: Token;

  constructor(token) {
    super('Variable');
    this.token = token;
  }

  evaluate(): number {
    throw new Error('undefined behavior for evaluating variables');
  }

  toString(): string {
    return this.token.toString();
  }
}