function createNDimArrayRecursion(arrayParams) {
  if (!Array.isArray(arrayParams) || arrayParams.length <= 0) return null;
  const size = arrayParams[0];
  const params = arrayParams.slice(1);
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push(createNDimArrayRecursion(params));
  }
  return result;
}

module.exports = {
  createNDimArrayRecursion
}
