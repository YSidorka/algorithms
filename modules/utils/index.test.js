const { getGCD, getLCM } = require('./');
const fn = (array) => ({ GCD: getGCD(array), LCM: getLCM(array) });
require('../../test')(fn, [__dirname, 'tests']);
