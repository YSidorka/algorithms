function createNDimArrayRecursion(arrayParams, defaultValue = null) {
  if (!Array.isArray(arrayParams) || arrayParams.length <= 0) return defaultValue;
  const size = arrayParams[0];
  const params = arrayParams.slice(1);
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push(createNDimArrayRecursion(params, defaultValue));
  }
  return result;
}

// Greatest Common Divisor (GCD)
function calculateGCD(array) {
  try {
    if (!Array.isArray(array) || array.length === 0 || Math.min(...array) <= 0) return null;

    let remainders = [...array];
    let gcd = Math.min(...remainders);

    while (remainders.length > 0) {
      const updatedRemainders = [];
      let gcdTmp = gcd;

      // Calculate remainders and update minimum
      remainders.forEach((value) => {
        const mod = value % gcd;

        if (mod > 0) {
          updatedRemainders.push(mod);
          gcdTmp = Math.min(gcdTmp, mod);
        }
      });

      // If there are remainders, update the array for the next iteration
      if (updatedRemainders.length > 0) {
        updatedRemainders.push(gcd);
        gcd = gcdTmp
      }

      remainders = updatedRemainders;
    }

    return gcd;
  } catch (err) {
    return null;
  }
}

function arraySum(array) {
  let result = 0;
  array.forEach((item) => (result += item));
  return result;
}

function cloneObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function swap(a, b) {
  let tmp = a;
  a = b;
  b = tmp;
}

module.exports = {
  createNDimArray: createNDimArrayRecursion,
  getNOD: calculateGCD,
  arraySum,
  cloneObj,
  swap
};
