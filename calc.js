const Interpreter = require('./interpreter.js');

const e = (code) => {
  let inter = new Interpreter();
  let parsed = inter.parse(code);
  console.log(inter.tokens);
  console.log(parsed);
  return parsed.toString();
  // return parsed.evaluate();
}

console.log(e(process.argv[2]));