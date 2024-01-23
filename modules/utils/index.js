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
function calculateGCD(a, b) {
  if (!a || !b) return null;
  while (b !== 0) {
    const tmp = b;
    b = a % b;
    a = tmp;
  }
  return Math.abs(a);
}

function isValidNumberArray(array) {
  if (!Array.isArray(array) || array.length < 1) return false;
  if (!array.every((item) => typeof item === 'number')) return false;
  if (array.includes(0)) return false;
  if (array.some((item) => !isFinite(item))) return false;
  if (array.some((item) => isNaN(item))) return false;

  //
  return true;
}
// Greatest Common Divisor (GCD) for array
function calculateGCDArray(arr) {
  try {
    const array = arr.map(Math.abs);
    if (!isValidNumberArray(array)) return null;

    let result = array[0];
    let i = 1;
    while (result !== 1 && i < array.length) {
      result = calculateGCD(result, array[i]);
      i += 1;
    }

    return result;
  } catch (err) {
    return null;
  }
}

// Least Common Multiple (LCM)
function calculateLCM(arr) {
  try {
    const array = arr.map(Math.abs);
    if (!isValidNumberArray(array)) return null;
    return array.reduce((lcm, item) => (lcm * item) / calculateGCD(lcm, item), array[0]);
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
  getGCD: calculateGCDArray,
  getLCM: calculateLCM,
  arraySum,
  cloneObj,
  swap
};
