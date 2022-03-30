console.log(Number.MAX_VALUE);
console.log(Number.MAX_SAFE_INTEGER);

const test = require('./modules/transport-problem/tests/01-max.json');
const { solution } = require('./modules/transport-problem/transport');
console.log(solution(test.input));
