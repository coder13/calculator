const Interpreter = require('./interpreter.js');

const e = (code) => {
  let inter = new Interpreter();
  // console.log(inter.tokens);
  let parsed = inter.parse(code);
  // console.log(221, parsed);
  return parsed.evaluate();
}

console.log(e(process.argv[2]));