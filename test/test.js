const should = require('chai').should();

const Interpreter = require('../interpreter.js');
const inter = new Interpreter();

describe('Operations', function () {
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
    inter.parse('2 * 3').evaluate().should.equal(6);
    inter.parse('9 / 3 / 3').evaluate().should.equal(1);
  });
});