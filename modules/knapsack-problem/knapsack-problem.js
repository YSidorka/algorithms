const { createNDimArray } = require('../utils/utils');

function excludeCase(resultTable, itemIndex, weightIndex) {
  let result = 0;

  if (itemIndex >= 1) result = resultTable[itemIndex - 1][weightIndex];
  return result;
}

function include01Case(resultTable, itemIndex, weightIndex, item) {
  let result = 0;
  const deltaWeight = weightIndex - item.weight;
  if ((deltaWeight >= 0)) { // could be added
    result = item.cost;
    if (itemIndex >= 1) result += resultTable[itemIndex - 1][deltaWeight];
  }
  return result;
}

function includeUnboundedCase(resultTable, itemIndex, weightIndex, item) {
  let result = 0;
  const deltaWeight = weightIndex - item.weight;
  if ((deltaWeight >= 0)) { // could be added
    result = item.cost;
    result += resultTable[itemIndex][deltaWeight];
  }
  return result;
}

function solution(inputData) {
  try {
    let result;
    const { weight, limit, items } = inputData;

    items.sort((A, B) => (A.weight >= B.weight) ? 1 : -1);
    let resultTable = createNDimArray([items.length, weight + 1]);

    resultTable.forEach((tableRow, itemIndex) => {
      tableRow.forEach((weight, weightIndex) => {

        let exclude;
        let include;

        // problem cases
        if (!limit || limit === 1) {
          // 0-1 knapsack problem
          exclude = excludeCase(resultTable, itemIndex, weightIndex);
          include = include01Case(resultTable, itemIndex, weightIndex, items[itemIndex]);
          tableRow[weightIndex] = Math.max(exclude, include);
        }

        if (limit === 'unlim') {
          // unbounded knapsack problem
          exclude = excludeCase(resultTable, itemIndex, weightIndex);
          include = includeUnboundedCase(resultTable, itemIndex, weightIndex, items[itemIndex]);
          tableRow[weightIndex] = Math.max(exclude, include);
        }
      });
    });

    // result = resultTable[items.length - 1][weight];
    result = resultTable;
    return result;

  } catch (err) {
    console.log(err.message)
    return null;
  }
}

module.exports = {
  solution
}
