const regex = /\d+(\.\d+)?|\+|\-|\*|\/|\^|\(|\)/g;

class Token {
  constructor(type, token) {
    this.type = type;
    this.token = token;
  }
}

class AST {
  constructor (type) {
    this.type = type;
  }
}

class BinOp extends AST {
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
}

class NegationOp extends AST {
  constructor(term) {
    super('Negate');
    this.term = term;
  }

  evaluate() {
    return -this.term.evaluate();
  }
}

class Num extends AST {
  constructor(token) {
    super('Number');
    this.token = token;
  }

  evaluate() {
    return +this.token;
  }
}

class Interpreter {
  constructor(code) {
    this.code = code;
    this.tokens = this.tokenize(code);
    this.currentToken = 0;
  }

  tokenize(expression) {
    let re = expression.match(regex);
    
    return re.map((token) => {
      if (['+', '-', '*', '/', '^'].indexOf(token) > -1) {
        return new Token('Operator', token);
      } else if (token == '(') {
        return new Token('OpenParen', token);
      } else if (token == ')') {
        return new Token('CloseParen', token);
      } {
        return new Token('Number', token);
      }
    });
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

  item() {
    let token = this.getNextToken();

    if (token.token === '-') {
      return new NegationOp(this.term());
    }

    if (token.type == 'Number') {
      return new Num(token.token);
    } else if (token.type == 'OpenParen') {
      let node = this.expr();

      if (this.getCurrentToken().type !== 'CloseParen') {
        throw new Error('Syntax error: expected close paren');
      } else {
        this.currentToken++;
      }

      if (this.getCurrentToken() && this.getCurrentToken().type === 'OpenParen') {
        this.currentToken++;
        return new BinOp(node, new Token('Operator', '*'), this.expr())
      }

      return node;
    }

    return token;
  }

  factor () {
    let item = this.item();

    if (this.getCurrentToken() && this.getCurrentToken().token === '^') {
      this.currentToken++;
      return new BinOp(item, new Token('Operator', '^'), this.factor());
    }

    return item;
  }

  term () {
    let node = this.factor();

    while (this.getCurrentToken()
        && this.getCurrentToken().type === 'Operator'
        && ['^', '*', '/'].indexOf(this.getCurrentToken().token) > -1) {
      node = new BinOp(node, this.getNextToken(), this.factor());
    }

    return node;
  }

  expr () {
    let node = this.term();

    while (this.getCurrentToken()
        && this.getCurrentToken().type === 'Operator'
        && ['+', '-'].indexOf(this.getCurrentToken().token) > -1) {
      node = new BinOp(node, this.getNextToken(), this.term());
    }

    return node;
  }

  parse () {
    return this.expr();
  }
}

let inter = new Interpreter(process.argv[2]);
console.log(inter.tokens);

let parsed = inter.parse();
console.log(parsed);
console.log(parsed.evaluate())