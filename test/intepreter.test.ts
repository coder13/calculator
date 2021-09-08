require('chai').should();

import { Interpreter, BinOp, Num, Token, NegationOp } from '../src'
const inter = new Interpreter();

describe('Creates correct AST', () => {
  it('Numbers', function () {
    inter.parse('2').should.deep.equal(new Num('2'));
    inter.parse('5.5').should.deep.equal(new Num('5.5'));
    inter.parse('-100').should.deep.equal(new NegationOp(new Num('100')));
  });

  it('Operations', function () {
    ['+', '-', '*', '/', '^'].forEach((op) => {
      inter.parse(`1${op}1`).should.deep.equal(new BinOp(new Num('1'), new Token('Operator', op), new Num('1')));
    });
  });

  it('Multiple Operations', function () {
    inter.parse('8 + 9 * 2 - 3').should.deep.equal(
      new BinOp(
        new BinOp(
          new Num('8'),
          new Token('Operator', '+'),
          new BinOp(
            new Num('9'),
            new Token('Operator', '*'),
            new Num('2')
          )
        ),
        new Token('Operator', '-'),
        new Num('3')
      )
    );
  });

  it('Multiple Operations with parentheses', function () {
    inter.parse('(8 + 9) * (2 - 3)').should.deep.equal(
      new BinOp(
        new BinOp(
          new Num('8'),
          new Token('Operator', '+'),
          new Num('9')
        ),
        new Token('Operator', '*'),
        new BinOp(
          new Num('2'),
          new Token('Operator', '-'),
          new Num('3')
        )
      )
    );

    inter.parse('(8 + 9)(2 - 3)').should.deep.equal(
      new BinOp(
        new BinOp(
          new Num('8'),
          new Token('Operator', '+'),
          new Num('9')
        ),
        new Token('Operator', '*'),
        new BinOp(
          new Num('2'),
          new Token('Operator', '-'),
          new Num('3')
        )
      )
    );
    
    inter.parse('9(2 - 3)').should.deep.equal(
      new BinOp(
        new Num('9'),
        new Token('Operator', '*'),
        new BinOp(
          new Num('2'),
          new Token('Operator', '-'),
          new  Num('3'),
        )
      )
    );
  });

  it('Multiple Operations with mixed parentheses', function () {
    inter.parse('4(3)[5]').should.deep.equal(
      new BinOp(
        new Num('4'),
        new Token('Operator', '*'),
        new BinOp(
          new Num('3'),
          new Token('Operator', '*'),
          new Num('5')
        )
      )
    );
  });
});

describe('Evaluates expressions', function () {
  it('Evaluates addition', function () {
    inter.parse('2 + 3').evaluate().should.equal(5);
    inter.parse('2 + 1 + 3').evaluate().should.equal(6);
  });

  it('Evaluates subtraction', function () {
    inter.parse('2 - 2').evaluate().should.equal(0);
    inter.parse('6 - 2 - 1').evaluate().should.equal(3);
  });

  it('Evaluates multiplication', function () {
    inter.parse('2 * 3').evaluate().should.equal(6);
    inter.parse('2 * 3 * 2').evaluate().should.equal(12);
  });

  it('Evaluates division', function () {
    inter.parse('6 / 2').evaluate().should.equal(3);
    inter.parse('9 / 3 / 3').evaluate().should.equal(1);
  });

  it('Evaluates parantheses', function () {
    inter.parse('(2 + 3) * 5').evaluate().should.equal(25);
    inter.parse('(5 + 2)(8 + 9 * 2)').evaluate().should.equal(182);
    inter.parse('8 - (5 - 2)').evaluate().should.equal(5);
    inter.parse('(5 - 2)^2').evaluate().should.equal(9);
    inter.parse('(5 - 2)^(1 + 1)').evaluate().should.equal(9);
  });

  it('Evaluates variables');
});