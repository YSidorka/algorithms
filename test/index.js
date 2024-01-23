const fs = require('fs');
const { join } = require('path');

function run(fn, arrayPath) {
  const tests = [];
  const path = join(...arrayPath);

  fs.readdirSync(path).forEach((file) => {
    if (!file.startsWith('_')) tests.push(join(path, file));
  });

  tests.forEach((item) => {
    const testCase = require(item);
    const result = fn(testCase.input);
    test(`${testCase.name}`, () => {
      expect(result).toStrictEqual(testCase.output);
    });
  });
}

module.exports = run;
