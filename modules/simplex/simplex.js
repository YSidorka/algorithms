const { createNDimArray } = require('../utils/utils');

function inputValidator(inputData) {
  try {
    const { max, items, resources } = inputData;
    if (!max) throw new Error('Invalid maximize param');

    // check items
    if (!Array.isArray(items) || items.length <= 0) throw new Error('Invalid items');
    items.forEach((item) => {
      if (!Object.prototype.hasOwnProperty.call(item, max)) throw new Error(`Item id (${item.id}): cannot found maximize param`);
      if (item[max] <= 0) throw new Error(`Item id (${item.id}): invalid maximize param`);
    })

    // check resources
    if (Object.keys(resources).length <= 0) throw new Error('Invalid resources');

    return { isValid: true };
  } catch (err) {
    return { isValid: false, message: err.message };
  }
}

function setInput(inputData) {
  const result = inputValidator(inputData);
  if (!result.isValid) {
    console.log(result.message);
    return null;
  }

  // --- data preparation ---
  const { max, items, resources } = inputData;

  // resource types
  const resKeys = Object.keys(resources);
  const resTypesCount = resKeys.length;

  /*
    P1*X1 + P2*X2 = P -> max
    P - P1*X1 - P2*X2 = 0
   */
  // result row
  const resultRow = createNDimArray([items.length + resTypesCount + 1], 0);
  items.forEach((item, index) => { resultRow[index] = -item[max] });
  resultRow[resultRow.length - 1] = 0;

  // solution MATRIX = [resource rule][ item0, ..., itemN, res0, ..., resN, 'FREE_EL' ]
  const matrix = createNDimArray([resTypesCount, (items.length + resTypesCount + 1)], 0);
  matrix.forEach((row, i) => {

    // resKeys[i] -> name of resource

    // set resources matrix values
    for (let j = 0; j < items.length; j += 1) {
      if (Object.prototype.hasOwnProperty.call(items[j], resKeys[i])) {
        matrix[i][j] = items[j][resKeys[i]];
      }
    }

    // set rest matrix values
    matrix[i][i + items.length] = 1;

    // set free element
    matrix[i][row.length - 1] = resources[resKeys[i]];

  });

  return { resultRow, matrix, resKeys };
}

function setOutput(resultRow, matrix, items, resKeys) {
  const _result = resultRow[resultRow.length - 1];
  const _items = {};
  const _resources = {};

  matrix[0].forEach((col, colIndex) => {
    if (colIndex === matrix[0].length - 1) return;
    if (isBasis(matrix, colIndex)) {
      let rowIndex = matrix.findIndex((row) => row[colIndex] === 1);
      if (rowIndex < 0) return;
      // to get result in a basis row -> use the last basis item
      if (colIndex < items.length) {
        // items
        _items[items[colIndex].id] = matrix[rowIndex][matrix[0].length - 1];
      }
      if (colIndex >= items.length) {
        // resources
        _resources[resKeys[colIndex - items.length]] = matrix[rowIndex][matrix[0].length - 1];
      }
    } else {
      // result for non-basis row = 0
      if (colIndex < items.length) _items[items[colIndex].id] = 0;
      if (colIndex >= items.length) _resources[resKeys[colIndex - items.length]] = 0;
    }
  })
  return {
    result: _result,
    items: _items,
    resources: _resources
  }
}

function isBasis(matrix, col) {
  try {
    let result = true;
    let i = 0;
    let nonzeroCount = 0;
    while (result && i < matrix.length) {
      if (matrix[i][col] !== 0) nonzeroCount += 1;
      if (nonzeroCount > 1) result = false;
      i += 1;
    }
    return result;
  } catch(err) {
    return false;
  }
}

function getMinIndex(array){
  let min = array[0];
  let minIndex = 0

  array.forEach((item, index) => {
    if (min > item) {
      min = item;
      minIndex = index;
    }
  });
  return minIndex;
}

function getFreeElArray(matrix, basisIndex){
  const result = matrix.map((row) => {
    let value = row[row.length - 1] / row[basisIndex];
    if (value < 0) value = Infinity;
    return value;
  });
  return result;
}

function rowFactorSimplify(row, k) {
  const result = row.map((value) => value / k );
  return result;
}

function updateRowWithBasisRow(basisRow, row, basisIndex) {
  const K = -row[basisIndex];
  const result = row.map((value, index) => (value + basisRow[index] * K));
  return result;
}

function solution(inputData) {
  try {
    let result;
    let { resultRow, matrix, resKeys } = setInput(inputData);

    let newBasisColIndex = getMinIndex(resultRow);
    let moveOnFlag = (resultRow[newBasisColIndex] < 0);

    while (moveOnFlag) {
      moveOnFlag = false;

      const freeElArray = getFreeElArray(matrix, newBasisColIndex);
      const newBasisRowIndex = getMinIndex(freeElArray);

      // simplify new basis row
      matrix[newBasisRowIndex] = rowFactorSimplify(matrix[newBasisRowIndex], matrix[newBasisRowIndex][newBasisColIndex]);

      // update matrix
      matrix.forEach((row, index) => {
        if (index !== newBasisRowIndex) {
          matrix[index] = updateRowWithBasisRow(matrix[newBasisRowIndex], row, newBasisColIndex);
        }
      });

      // move on criteria
      const tmpResultRow = updateRowWithBasisRow(matrix[newBasisRowIndex], resultRow, newBasisColIndex);
      const lastIndex = resultRow.length - 1;

      if (tmpResultRow[lastIndex] > resultRow[lastIndex]) {
        // update resultRow
        resultRow = tmpResultRow;
        newBasisColIndex = getMinIndex(resultRow);
        moveOnFlag = (resultRow[newBasisColIndex] < 0);
      }
    }

    result = setOutput(resultRow, matrix, inputData.items, resKeys);
    return result;
  } catch (err) {
    console.log(err.message)
    return null;
  }
}

module.exports = {
  solution
}
