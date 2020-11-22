const { functions } = require('./constants');

class AST {
  constructor (type) {
    this.type = type;
  }

  evaluate () {
    throw new Error('function: evaluate, not implemented');
  }

  toString() {}
}

module.exports.BinOp = class extends AST {
  constructor(left, op, right) {
    super('Operator');
    this.left = left;
    this.op = op;
    this.right = right;
  }

  evaluate () {
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
        return left / right;
      case '^':
        return Math.pow(left, right);
      default:
        throw new Error('Undefined operator: ' + this.op);
    }
  }

  toString() {
    return `(${this.left.toString()} ${this.op.token} ${this.right.toString()})`;
  }
}

module.exports.FunctionOp = class extends AST {
  constructor(name, arg) {
    super('Function');
    this.name = name;
    this.argument = arg;
  }

  evaluate() {
    if (!functions[this.name.token.toLowerCase()]) {
        throw new Error('Undefined function');
    }
    return functions[this.name.token.toLowerCase()](this.argument.evaluate());
  }

  toString() {
    return `${this.name.token.toLowerCase()}(${this.argument})`;
  }
}

module.exports.NegationOp = class extends AST {
  constructor(term) {
    super('Negate');
    this.term = term;
  }

  evaluate() {
    return -this.term.evaluate();
  }

  toString() {
    return `-${this.term.toString()}`;
  }
}

module.exports.Num = class extends AST {
  constructor(token) {
    super('Number');
    this.token = token;
  }

  evaluate() {
    return +this.token;
  }

  toString() {
    return this.token.toString();
  }
}

module.exports.Variable = class extends AST {
  constructor(token) {
    super('Variable');
    this.token = token;
  }

  evaluate() {
    throw new Error('undefined behavior for evaluating variables');
  }

  toString() {
    return this.token.toString();
  }
}