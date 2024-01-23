const { createNDimArray } = require('../utils');

function excludeCase(resultTable, itemIndex, weightIndex) {
  let result = 0;
  if (itemIndex >= 1) result = resultTable[itemIndex - 1][weightIndex];
  return result;
}

function include01Case(resultTable, itemIndex, weightIndex, item) {
  let result = 0;
  const deltaWeight = weightIndex - item.weight;
  if (deltaWeight >= 0) {
    // could be added
    result = item.cost;
    if (itemIndex >= 1) result += resultTable[itemIndex - 1][deltaWeight];
  }
  return result;
}

function includeUnboundedCase(resultTable, itemIndex, weightIndex, item) {
  let result = 0;
  const deltaWeight = weightIndex - item.weight;
  if (deltaWeight >= 0) {
    // could be added
    result = item.cost;
    result += resultTable[itemIndex][deltaWeight];
  }
  return result;
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
    // Destructuring assignment for clarity
    const { weight, limit, items } = inputData;
    let fn;

    // 0-1 knapsack problem
    if (!limit || limit === 1) fn = include01Case;
    // unbounded knapsack problem
    if (limit === 'unlim') fn = includeUnboundedCase;

    // Sort items by weight in ascending order
    items.sort((a, b) => (a.weight >= b.weight ? 1 : -1));

    // Initialize a 2D array for dynamic programming
    const resultTable = createNDimArray([items.length, weight + 1]);

    resultTable.forEach((tableRow, itemIndex) => {
      tableRow.forEach((weight, weightIndex) => {
        const exclude = excludeCase(resultTable, itemIndex, weightIndex);
        const include = fn(resultTable, itemIndex, weightIndex, items[itemIndex]);
        tableRow[weightIndex] = Math.max(exclude, include);
      });
    });

    // result = resultTable[items.length - 1][weight];
    const result = setOutput(resultTable, items, weight);
    return result;
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

module.exports = { solution };
