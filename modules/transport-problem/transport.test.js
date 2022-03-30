const fs = require('fs');
const path = require('path');
const { solution } = require('./transport');

/*
 client (needs) -> columns
 store (has) -> rows
 */

const tests = [];

fs.readdirSync(path.join(__dirname, 'tests')).forEach((file) => {
  if (!file.startsWith('_')) tests.push(file);
});

tests.forEach((item) => {
  const testCase = require(`./tests/${item}`);
  test(`${testCase.name}`, () => {
    expect(solution(testCase.input)).toStrictEqual(testCase.output);
  });
});
