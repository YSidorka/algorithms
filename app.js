// console.log(Number.MAX_VALUE);
// console.log(Number.MAX_SAFE_INTEGER);

const test = require('./modules/transport-problem/tests/11-intuit.json');
const solution = require('./modules/transport-problem');
console.log(solution(test.input));
