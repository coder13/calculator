// import 'chai/register-should';
require('chai').should();

import { Token, tokenize } from '../src/tokenize';

describe('Basic Tokens', function () {
  it('Parses numbers', function () {
    const tokens = tokenize('2');
    tokens.should.be.a('array').with.lengthOf(1);
    tokens[0].should.deep.equal(new Token('Number', '2'));
  });

  it('Parses operators', function () {
    const tokens = tokenize('+ - * / ^');
    tokens.should.be.a('array').with.lengthOf(5);
    tokens[0].should.deep.equal(new Token('Operator', '+'));
    tokens[1].should.deep.equal(new Token('Operator', '-'));
    tokens[2].should.deep.equal(new Token('Operator', '*'));
    tokens[3].should.deep.equal(new Token('Operator', '/'));
    tokens[4].should.deep.equal(new Token('Operator', '^'));
  });
  
  it('Parses functions', function () {
    const tokens = tokenize('sin()foo');
    tokens.should.be.a('array').with.lengthOf(4);
    tokens[0].should.deep.equal(new Token('Function', 'sin'));
    tokens[1].should.deep.equal(new Token('OpenParen', '('));
    tokens[2].should.deep.equal(new Token('CloseParen', ')'));
    tokens[3].should.deep.equal(new Token('Variable', 'foo'));
  });
  
  it('Parses variable tokens', function() {
    const tokens = tokenize('foo = 2');
    tokens.should.be.a('array').with.lengthOf(3);
    tokens[0].should.deep.equal(new Token('Variable', 'foo'));
    tokens[1].should.deep.equal(new Token('Equals', '='));
    tokens[2].should.deep.equal(new Token('Number', '2'));
  })
});