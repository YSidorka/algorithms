// console.log(Number.MAX_VALUE);
// console.log(Number.MAX_SAFE_INTEGER);

const test = require('./modules/simplex/tests/intuit 04.json');
const { solution } = require('./modules/simplex/simplex');
console.log(solution(test.input));
