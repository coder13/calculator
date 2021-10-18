# Calculator

This was done for my CS 480 class.

This does simple lexical analysis and building an Abstract Syntax Tree to evaluate simple mathematical expresssions

It currently handles PEMDAS, functions, and understanding parentheses back to back as multiplication

## Requirements

This requires [NodeJS](https://nodejs.org/en/) and npm.

## Installing

Clone the repository.

```bash
npm install
```

## Building

```bash
npm run build
```

This will build the typescript code into executable NodeJS.

## Usage

Once built, you can run it with:

```bash
./bin/calc <expression>
```

The entire expression must be the first argument so if you want to add spaces, you must use quotes.

Parantheses and other special characters confuse the shell so you will need to escape them with `\` or use quotes.

## Tests

Test can be ran with:

```bash
npm run test
```
