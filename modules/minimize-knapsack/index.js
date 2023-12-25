const { createNDimArray, getNOD } = require('../utils');

function excludeCase(resultTable, itemIndex, weightIndex) {
  let result = Number.MAX_SAFE_INTEGER;
  if (itemIndex >= 1) result = resultTable[itemIndex - 1][weightIndex];
  return result;
}

function includeUnboundedCase(resultTable, itemIndex, weightIndex, item) {
  let result = item.cost;
  const deltaWeight = weightIndex - item.weight;
  if (deltaWeight >= 0) {
    // could be added
    result += resultTable[itemIndex][deltaWeight];
  }
  return result;
}

function setInput(inputData) {
  let { weight, items } = inputData;
  const nod = getNOD([weight, ...items.map((item) => item.weight)]);
  if (nod) {
    weight = Math.floor(weight / nod);
    items = items.map((item) => {
      return {
        ...item,
        weight: Math.floor(item.weight / nod)
      };
    });
  }
  return { ...inputData, weight, items };
}

function setOutput(resultTable, sortedItems, weight) {
  // RETURN VALUE ONLY
  // return resultTable[resultTable.length - 1][resultTable[0].length - 1];

  // RETURN RESULT TABLE
  return resultTable;

  // return solution list
  let result = {};
  let rowIndex = resultTable.length - 1;
  let colIndex = resultTable[0].length - 1;
  while (rowIndex >= 0) {
    if (colIndex <= 0) break;
    while (colIndex > 0) {
      if (
        rowIndex >= 1 &&
        resultTable[rowIndex][colIndex] === resultTable[rowIndex - 1][colIndex]
      ) {
        // exclude case
        rowIndex -= 1;
      } else {
        // include case
        const caseName = sortedItems[rowIndex].name;
        if (!result[caseName]) result[caseName] = 0;
        result[caseName] += 1;
        colIndex -= sortedItems[rowIndex].weight;
      }
    }
  }

  return result;
}

function solution(inputData) {
  try {
    let result;
    const { weight, limit, items } = setInput(inputData);

    items.sort((A, B) => (A.weight >= B.weight ? 1 : -1));
    let resultTable = createNDimArray([items.length, weight + 1]);

    resultTable.forEach((tableRow, itemIndex) => {
      tableRow.forEach((weight, weightIndex) => {
        let exclude;
        let include;
        if (itemIndex === 0 && weightIndex === 0) {
          tableRow[weightIndex] = 0;
          return;
        }
        if (limit === 'unlim') {
          // unbounded knapsack problem
          exclude = excludeCase(resultTable, itemIndex, weightIndex);
          include = includeUnboundedCase(resultTable, itemIndex, weightIndex, items[itemIndex]);
          tableRow[weightIndex] = Math.min(exclude, include);
        }
      });
    });

    result = setOutput(resultTable, items, weight);
    return result;
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

module.exports = solution;
