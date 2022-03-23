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

function getNOD(array) {
  try {
    let _array = array;
    let min = Math.min(..._array);
    if (!_array.length || !min || (min <= 0)) return null;

    while (_array.length) {
      const tmpArr = [];
      let tmpMin = min;

      _array.forEach((value) => {
        const mod = value % min;
        if (mod > 0) {
          if (tmpMin > mod) tmpMin = mod;
          tmpArr.push(mod);
        }
      });

      // update minimum
      if (tmpArr.length) {
        tmpArr.push(min);
        min = tmpMin;
      }
      _array = tmpArr;
    }

    return min;
  } catch(err) {
    return null;
  }
}

module.exports = {
  createNDimArray: createNDimArrayRecursion,
  getNOD
}
