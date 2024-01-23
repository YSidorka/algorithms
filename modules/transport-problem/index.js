const { createNDimArray, arraySum, cloneObj, swap } = require('../utils');

function inputValidator(data) {
  try {
    return { isValid: true };
  } catch (err) {
    return { isValid: false, message: err.message };
  }
}

function setInput(data) {
  const result = inputValidator(data);
  if (!result.isValid) {
    console.log(result.message);
    return null;
  }

  const { hasRes: inputArr, needRes: outputArr, costMatrix, type } = cloneObj(data);

  // reverse matrix
  let matrix = createNDimArray([costMatrix[0].length, costMatrix.length]);
  costMatrix.forEach((row, i) => {
    row.forEach((item, j) => {
      matrix[j][i] = item;
    });
  });

  let inputSum = arraySum(inputArr);
  let outputSum = arraySum(outputArr);

  if (inputSum > outputSum) {
    matrix.push(createNDimArray([matrix[0].length], 0));
    outputArr.push(inputSum - outputSum);
    outputSum = inputSum;
  }

  if (inputSum < outputSum) {
    matrix.forEach((row) => row.push(Number.MAX_SAFE_INTEGER));
    inputArr.push(outputSum - inputSum);
    inputSum = outputSum;
  }

  return {
    inputArr,
    inputSum,
    outputArr,
    outputSum,
    costMatrix: matrix,
    type: type === 'max' ? type : 'min'
  };
}

function setOutput(resultArr, costMatrix) {
  const result = sumMatrix(resultArr, costMatrix);
  // reverse matrix
  let matrix = createNDimArray([costMatrix[0].length, costMatrix.length], 0);
  resultArr.forEach((item) => (matrix[item.col][item.row] = item.value));

  return { result, resMatrix: matrix };
}

function northWestCorner(input, output) {
  const matrix = [];
  let rowIndex = 0;
  let colIndex = 0;
  while (rowIndex < output.length && colIndex < input.length) {
    if (output[rowIndex] <= input[colIndex]) {
      matrix.push({
        value: output[rowIndex],
        row: rowIndex,
        col: colIndex
      });
      input[colIndex] = input[colIndex] - output[rowIndex];
      output[rowIndex] = 0;
      rowIndex += 1;
    } else {
      matrix.push({
        value: input[colIndex],
        row: rowIndex,
        col: colIndex
      });
      output[rowIndex] = output[rowIndex] - input[colIndex];
      input[colIndex] = 0;
      colIndex += 1;
    }
  }
  if (matrix.length !== output.length + input.length - 1)
    throw new Error('Invalid North-West corner process');
  return matrix;
}

function sumMatrix(resultArr, costMatrix) {
  let result = 0;
  resultArr.forEach((item) => {
    result = result + item.value * costMatrix[item.row][item.col];
  });
  return result;
}

function getNextOptimum(type, resultArr, costMatrix) {
  if (type === 'max') {
    return getNextOptimum_MAX(resultArr, costMatrix);
  } else {
    return getNextOptimum_MIN(resultArr, costMatrix);
  }
}

function getNextOptimum_MAX(resultArr, costMatrix) {
  const kInputArr = createNDimArray([costMatrix[0].length]); // row of K  (each col)
  const kOutputArr = createNDimArray([costMatrix.length]); // column of K (each row)

  // set K for input & output
  let list = [...resultArr];
  let listPos = 0;
  const firstItem = list[0];
  const maxPotencial = costMatrix[firstItem.row][firstItem.col];
  kInputArr[list[0].col] = maxPotencial;

  while (listPos < list.length) {
    const item = list[listPos];
    // if col & row unknown - put item to the end of queue
    if (kInputArr[item.col] === null && kOutputArr[item.row] === null) list.push(item);

    // if row known - K could be calculated
    if (kInputArr[item.col] === null && kOutputArr[item.row] !== null) {
      kInputArr[item.col] = maxPotencial - costMatrix[item.row][item.col] - kOutputArr[item.row];
    }

    // if col known - K could be calculated
    if (kInputArr[item.col] !== null && kOutputArr[item.row] === null) {
      kOutputArr[item.row] = maxPotencial - costMatrix[item.row][item.col] - kInputArr[item.col];
    }
    listPos += 1;
  }

  // K matrix
  const kMatrix = createNDimArray([costMatrix.length, costMatrix[0].length]);
  resultArr.forEach((item) => (kMatrix[item.row][item.col] = item.value));

  let optimumObj = null; // maxDelta = kMatrix[i][j] vs costMatrix[i][j];

  kMatrix.forEach((row, i) => {
    row.forEach((item, j) => {
      if (item === null) {
        kMatrix[i][j] = kOutputArr[i] + kInputArr[j];
        const delta = kMatrix[i][j] - (maxPotencial - costMatrix[i][j]);
        if (delta > 0) {
          if (!optimumObj) optimumObj = { value: delta, row: i, col: j };
          if (delta > optimumObj.value) {
            optimumObj.value = delta;
            optimumObj.row = i;
            optimumObj.col = j;
          }
        }
      }
    });
  });
  return optimumObj;
}

function getNextOptimum_MIN(resultArr, costMatrix) {
  const kInputArr = createNDimArray([costMatrix[0].length]); // row of K  (each col)
  const kOutputArr = createNDimArray([costMatrix.length]); // column of K (each row)

  // set K for input & output
  let list = [...resultArr];
  let listPos = 0;
  kInputArr[list[0].col] = 0;

  while (listPos < list.length) {
    const item = list[listPos];
    // if col & row unknown - put item to the end of queue
    if (kInputArr[item.col] === null && kOutputArr[item.row] === null) list.push(item);

    // if row known - K could be calculated
    if (kInputArr[item.col] === null && kOutputArr[item.row] !== null) {
      kInputArr[item.col] = costMatrix[item.row][item.col] - kOutputArr[item.row];
    }

    // if col known - K could be calculated
    if (kInputArr[item.col] !== null && kOutputArr[item.row] === null) {
      kOutputArr[item.row] = costMatrix[item.row][item.col] - kInputArr[item.col];
    }
    listPos += 1;
  }

  // K matrix
  const kMatrix = createNDimArray([costMatrix.length, costMatrix[0].length]);
  resultArr.forEach((item) => (kMatrix[item.row][item.col] = item.value));

  let optimumObj = null; // maxDelta = kMatrix[i][j] vs costMatrix[i][j];

  kMatrix.forEach((row, i) => {
    row.forEach((item, j) => {
      if (item === null) {
        kMatrix[i][j] = kOutputArr[i] + kInputArr[j];
        const delta = kMatrix[i][j] - costMatrix[i][j];
        if (delta > 0) {
          if (!optimumObj) optimumObj = { value: delta, row: i, col: j };
          if (delta > optimumObj.value) {
            optimumObj.value = delta;
            optimumObj.row = i;
            optimumObj.col = j;
          }
        }
      }
    });
  });
  return optimumObj;
}

function isEqualPoints(a, b) {
  if (a.value !== b.value) return false;
  if (a.row !== b.row) return false;
  if (a.col !== b.col) return false;
  //
  return true;
}

function isLoopFound(array, startIndex) {
  if (array[array.length - 1] !== startIndex) return false;
  if (array.length <= 1) return false; // FALSE only if one element at array
  return true;
}

function removeSingleItemCases(array) {
  let result = [...array];
  let updatedFlag = true;

  while (updatedFlag) {
    updatedFlag = false;
    let rowMap = {};
    let colMap = {};
    result.forEach((item, i) => {
      if (!rowMap[item.row]) rowMap[item.row] = [];
      rowMap[item.row].push(i);

      if (!colMap[item.col]) colMap[item.col] = [];
      colMap[item.col].push(i);
    });

    Object.keys(rowMap).forEach((key) => {
      if (rowMap[key].length === 1) {
        result[rowMap[key]] = null;
        updatedFlag = true;
      }
    });

    Object.keys(colMap).forEach((key) => {
      if (colMap[key].length === 1) {
        result[colMap[key]] = null;
        updatedFlag = true;
      }
    });
    result = result.filter((item) => !!item);
  }
  return result;
}

function setRoutes(array) {
  let result = createNDimArray([array.length, 0]);
  array.forEach((fromItem, i) => {
    array.forEach((toItem, j) => {
      if (i !== j) {
        if (fromItem.row === toItem.row || fromItem.col === toItem.col) {
          result[i].push(j);
        }
      }
    });
  });
  return result;
}

function findLoopByBackTrackMethod(baseArr, startIndex, routes) {
  let result = [startIndex];

  // list with positions of used routes
  let usedRoutes = createNDimArray([baseArr.length], null);
  usedRoutes[startIndex] = 0;

  while (result.length > 0 && !isLoopFound(result, startIndex)) {
    let currentIndex = result[result.length - 1]; // index of point at work (last point)
    while (
      usedRoutes[currentIndex] < routes[currentIndex].length &&
      !isLoopFound(result, startIndex)
    ) {
      // try to get next point to step
      const nextIndex = routes[currentIndex][usedRoutes[currentIndex]];
      if (nextIndex === startIndex) {
        result.push(nextIndex);
      }
      if (usedRoutes[nextIndex] === null) {
        // point not used before
        result.push(nextIndex);
        currentIndex = nextIndex;
        usedRoutes[currentIndex] = 0;
      } else {
        usedRoutes[currentIndex] += 1;
      }
    }
    if (!isLoopFound(result, startIndex)) {
      result.pop();
      usedRoutes[currentIndex] = null;
      usedRoutes[result[result.length - 1]] += 1;
    }
  }

  // remove last element (start/end of loop)
  if (result.length > 0) result.pop();

  return result;
}

function getLoop(resultArr, index) {
  try {
    let baseArr = [...resultArr];
    let startIndex = index;
    let startItem = baseArr[startIndex];

    // remove single item rows and colums
    baseArr = removeSingleItemCases(baseArr);

    // update start index;
    startIndex = baseArr.findIndex((item) => isEqualPoints(item, startItem));
    if (startIndex === -1) throw new Error('Invalid startIndex');

    // generate routes
    let routes = setRoutes(baseArr);

    // set array with loop elements
    let loopArr = findLoopByBackTrackMethod(baseArr, startIndex, routes);

    let result = loopArr.map((item) => baseArr[item]);
    return cloneObj(result);
  } catch (err) {
    console.log(`getCycle - Error: ${err}`);
    return [];
  }
}

function solution(inputData) {
  try {
    let result;
    let { inputArr, outputArr, costMatrix, type } = setInput(inputData);

    // basic solution
    let resultArr = northWestCorner([...inputArr], [...outputArr]);
    let resultSum = sumMatrix(resultArr, costMatrix);

    // console.log('Base plan sum:', resultSum);
    // console.log('Type opimization:', type);

    // get item for optimization
    let nextOptimum = getNextOptimum(type, resultArr, costMatrix);
    let moveOnFlag = !!nextOptimum;

    while (moveOnFlag) {
      moveOnFlag = false;
      resultArr.push({ ...nextOptimum, value: 0 });

      let loopArr = getLoop(resultArr, resultArr.length - 1);

      // set "+" & "-" for loop elements
      // get min value of "-" elements
      // get indexes at resultArr
      let min = null;
      loopArr.forEach((item, index) => {
        item.type = index % 2 === 0 ? '+' : '-';
        item.index = resultArr.findIndex((resultItem) => isEqualPoints(item, resultItem));

        // get min of elements with '-'
        if (item.type === '-') {
          if (min === null) min = item.value;
          if (min > item.value) min = item.value;
        }
      });

      // update loopArr with new values

      let removedZeroElFlag = false;
      loopArr.forEach((item, index) => {
        if (item.type === '+') item.value = item.value + min;
        if (item.type === '-') item.value = item.value - min;

        // remove one item with value === 0 (instead first item - new item)
        if (!removedZeroElFlag && item.value <= 0 && index > 0) {
          removedZeroElFlag = true;
          resultArr[item.index] = null;
          loopArr[index] = null;
        } else {
          // update resultArr
          resultArr[item.index].value = item.value;
        }
      });

      resultArr = resultArr.filter((item) => !!item);
      resultSum = sumMatrix(resultArr, costMatrix);

      nextOptimum = getNextOptimum(type, resultArr, costMatrix);
      moveOnFlag = !!nextOptimum;
    }

    result = setOutput(resultArr, costMatrix);
    return result;
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

module.exports = { solution };
