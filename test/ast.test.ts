const chai = require('chai');
const { expect } = chai;
chai.should();

import { BinOp, FunctionOp, NegationOp, Num } from '../src/ast';
import { Token } from '../src/tokenize';

describe('Evaluates AST correctly', function () {
  it('Evaluates number correctly', function () {
    const num = new Num('5');
    num.evaluate().should.equal(5);
    num.toString().should.equal('5');
  });

  it('Evaluates binary operations correctly', function () {
    const binOp = new BinOp(new Num('4'), new Token('Operator', '+'), new Num('4'));
    binOp.evaluate().should.equal(8);
    binOp.toString().should.equal('(4 + 4)');

    const nestedBinOp = new BinOp(binOp, new Token('Operator', '*'), binOp);
    nestedBinOp.evaluate().should.equal(64);
    nestedBinOp.toString().should.equal('((4 + 4) * (4 + 4))');
  });

  it('Evaluates function operations correctly', function () {
    const funcOp = new FunctionOp(new Token('Function', 'floor'), new Num('2.2'));
    funcOp.evaluate().should.equal(2);
    funcOp.toString().should.equal('floor(2.2)');
  });
  it('Evaluates negate operations correctly', function () {
    const negateOp = new NegationOp(new Num('2.2'));
    negateOp.evaluate().should.equal(-2.2);
    negateOp.toString().should.equal('-2.2');
  });

  it('Throws errors on division by zero', function () {
    const divisionByZero = new BinOp(new Num('1'), new Token('Operator', '/'), new Num('0'));
    expect(() => divisionByZero.evaluate()).to.throw('Division by zero');
  });

  it('Throws errors on undefined input for functions', function () {
    const negativeLogInput = new FunctionOp(new Token('Function', 'log'), new Num('-2'));
    expect(() => negativeLogInput.evaluate()).to.throw('Output of log undefined on input -2');
    const zeroLogInput = new FunctionOp(new Token('Function', 'log'), new Num('0'));
    expect(() => zeroLogInput.evaluate()).to.throw('Output of log undefined on input 0');
  });
});
