// console.log(Number.MAX_VALUE);
// console.log(Number.MAX_SAFE_INTEGER);

const test = require('./modules/simplex/tests/_knapsack-by-simplex-06.json');
const solution = require('./modules/simplex');
console.log(solution(test.input));
