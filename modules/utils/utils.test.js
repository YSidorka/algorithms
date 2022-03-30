const fs = require('fs');
const path = require('path');
const { getNOD } = require('./utils');

const tests = [];

fs.readdirSync(path.join(__dirname, 'tests')).forEach((file) => {
  if (!file.startsWith('_')) tests.push(file);
});

tests.forEach((item) => {
  const testCase = require(`./tests/${item}`);
  test(`${testCase.name}`, () => {
    expect(getNOD(testCase.input)).toStrictEqual(testCase.output);
  });
});
