const { createNDimArray, getGCD, getLCM } = require('../utils');

function inputValidator(inputData) {
  try {
    const { max, items, resources } = inputData;
    if (!max) throw new Error('Invalid maximize param');

    // check items
    if (!Array.isArray(items) || items.length <= 0) throw new Error('Invalid items');
    items.forEach((item) => {
      if (!Object.prototype.hasOwnProperty.call(item, max))
        throw new Error(`Item id (${item.id}): cannot found maximize param`);
      if (item[max] <= 0) throw new Error(`Item id (${item.id}): invalid maximize param`);
    });

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
  items.forEach((item, index) => {
    resultRow[index] = -item[max];
  });
  resultRow[resultRow.length - 1] = 0;

  // solution MATRIX = [resource rule][ item0, ..., itemN, res0, ..., resN, 'FREE_EL' ]
  const matrix = createNDimArray([resTypesCount, items.length + resTypesCount + 1], 0);
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

    // set zero element
    matrix[i].unshift(0);
  });

  // set zero element
  resultRow.unshift(1);

  return { resultRow, matrix, resKeys };
}

function setOutput(matrix, items, resKeys) {
  let _result;
  const _items = {};
  const _resources = {};

  matrix[0].forEach((col, colIndex) => {
    if (colIndex === matrix[0].length - 1) return;

    const itemIndex = colIndex - 1;
    const resourceIndex = colIndex - 1 - items.length;

    if (isBasis(matrix, colIndex)) {

      let rowIndex = matrix.findIndex((row) => row[colIndex] !== 0);
      if (rowIndex < 0) return;

      // to get result in a basis row -> use the last basis item
      const basisItem = matrix[rowIndex][colIndex];
      const lastItem = matrix[rowIndex][matrix[0].length - 1];

      if (colIndex === 0) {
        // result
        _result = lastItem / basisItem;
      }

      if (itemIndex >= 0 && itemIndex < items.length) {
        // items
        _items[items[itemIndex].id] = lastItem / basisItem;
      }

      if (resourceIndex >= 0 && resourceIndex < resKeys.length) {
        // resources
        _resources[resKeys[resourceIndex]] = lastItem / basisItem;
      }
    } else {
      // result for non-basis row = 0

      // FYI: colIndex === 0 - is always in basis
      if (colIndex - 1 < items.length) _items[items[itemIndex].id] = 0;
      if (colIndex - 1 >= items.length) _resources[resKeys[resourceIndex]] = 0;
    }
  });
  return {
    result: _result,
    items: _items,
    resources: _resources
  };
}

function isBasis(matrix, col) {
  try {
    let result = true;
    let nonzeroCount = 0;

    matrix.forEach((row) => {
      if (row[col] !== 0) nonzeroCount += 1;
      if (nonzeroCount > 1) result = false;
    });

    return result;
  } catch (err) {
    return false;
  }
}

function getMinIndex(array) {
  // return array.indexOf(Math.min(...array));
  const min = Math.min(...array);
  const result = array.findIndex((item) => item === min);
  return result;
}

function getNewBasisRowIndex(matrix, basisColIndex) {

  const freeElArray = matrix.map((row) => {
    const value = row[row.length - 1] / row[basisColIndex];
    if (value < 0) {
      console.log('!!! VALUE < 0 !!!', value);
    }
    return (value <= 0) ? Infinity : value;
  });

  let min = freeElArray[0];
  let minIndex = 0;

  freeElArray.forEach((item, index) => {
    // if (item !== ) {}
    if (min === item) {
      if (matrix[minIndex][basisColIndex] > matrix[index][basisColIndex]) {
        minIndex = index;
      }
    }
    if (min > item) {
      min = item;
      minIndex = index;
    }
  });

  return minIndex;
}

function updateRowWithBasisRow(basisRow, row, basisIndex) {
  const k = (basisRow[basisIndex] * row[basisIndex] > 0) ? -1 : 1;
  const result = row.map((value, index) => value + basisRow[index] * k);
  return result;
}

function updateRowWithLCM(row, index, lcm) {
  const k = Math.abs(lcm / row[index]);
  return row.map((item) => item * k);
}

function getRowLCM(matrix, resultRow, basisColIndex) {
  const array = [resultRow[basisColIndex]];

  matrix.forEach((row) => {
    if (row[basisColIndex] !== 0) array.push(row[basisColIndex]);
  });

  const result = getLCM(array);
  return result;
}

function updateRowWithGDC(row) {
  const array = row.filter((item) => item !== 0);
  const gdc = getGCD(array);
  if (!gdc) return row;
  return row.map((item) => item / gdc);
}

function solution(inputData) {
  try {
    let { resultRow, matrix, resKeys } = setInput(inputData);

    let newBasisColIndex = getMinIndex(resultRow);
    let moveOnFlag = resultRow[newBasisColIndex] < 0;

    while (moveOnFlag) {
      moveOnFlag = false;

      const newBasisRowIndex = getNewBasisRowIndex(matrix, newBasisColIndex);
      const lcm = getRowLCM(matrix, resultRow, newBasisColIndex);

      // update matrix with LCM
      matrix.forEach((row, index) => {
        if (row[newBasisColIndex] !== 0) {
          matrix[index] = updateRowWithLCM(row, newBasisColIndex, lcm);
        }
      });

      // update tmp result array with LCM
      let resultRowTmp = updateRowWithLCM(resultRow, newBasisColIndex, lcm);

      // update matrix
      const basisRow = [...matrix[newBasisRowIndex]];

      matrix = matrix.map((row, index) => {
        if (index !== newBasisRowIndex && row[newBasisColIndex] !== 0) {
          return updateRowWithBasisRow(basisRow, row, newBasisColIndex);
        }
        return row;
      });
      resultRowTmp = updateRowWithBasisRow(basisRow, resultRowTmp, newBasisColIndex);

      // update with GDC
      matrix = matrix.map((row) => updateRowWithGDC(row));
      resultRowTmp = updateRowWithGDC(resultRowTmp);

      // move on criteria
      const lastIndex = resultRow.length - 1;
      if (resultRowTmp[lastIndex] / resultRowTmp[0] > resultRow[lastIndex] / resultRow[0]) {
        // update resultRow
        resultRow = resultRowTmp;
        newBasisColIndex = getMinIndex(resultRow);
        moveOnFlag = resultRow[newBasisColIndex] < 0;
      }
    }

    matrix.push(resultRow);

    const result = setOutput(matrix, inputData.items, resKeys);
    return result;
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

module.exports = solution;
