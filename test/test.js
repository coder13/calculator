const should = require('chai').should();

const Interpreter = require('../src/interpreter.ts');
const inter = new Interpreter();

describe('syntax', function () {
  it('Addition', function () {
    inter.parse('2 + 3').evaluate().should.equal(5);
    inter.parse('2 + 1 + 3').evaluate().should.equal(6);
  });

  it('Subtraction', function () {
    inter.parse('2 - 2').evaluate().should.equal(0);
    inter.parse('6 - 2 - 1').evaluate().should.equal(3);
  });

  it('Multiplication', function () {
    inter.parse('2 * 3').evaluate().should.equal(6);
    inter.parse('2 * 3 * 2').evaluate().should.equal(12);
  });

  it('Division', function () {
    inter.parse('6 / 2').evaluate().should.equal(3);
    inter.parse('9 / 3 / 3').evaluate().should.equal(1);
  });

  it('Parantheses', function () {
    inter.parse('(2 + 3) * 5').evaluate().should.equal(25);
    inter.parse('(5 + 2)(8 + 9 * 2)').evaluate().should.equal(182);
    inter.parse('8 - (5 - 2)').evaluate().should.equal(5);
    inter.parse('(5 - 2)^2').evaluate().should.equal(9);
    inter.parse('(5 - 2)^(1 + 1)').evaluate().should.equal(9);
  });
});