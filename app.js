// console.log(Number.MAX_VALUE);
// console.log(Number.MAX_SAFE_INTEGER);

const test = require('./modules/graph/tests/creation/01.json');
const { solution } = require('./modules/graph');
console.log(solution(test.input));
