const Graph = require('../utils/graph.class');

function createGraph(inputData) {
  const { nodes, edges, directed } = inputData;
  const graph = new Graph({ nodes, edges, directed });
  return graph.toJSON();
}

function removeNode(inputData) {
  const { nodes, edges, directed, nodesToRemove } = inputData;
  const graph = new Graph({ nodes, edges, directed });
  nodesToRemove.forEach((id) => { graph.removeNode(id) });
  return graph.toJSON();
}

function removeEdge(inputData) {
  const { nodes, edges, directed, edgesToRemove } = inputData;
  const graph = new Graph({ nodes, edges, directed });
  edgesToRemove.forEach((id) => { graph.removeEdge(id) });
  return graph.toJSON();
}

module.exports = {
  solution: createGraph,
  createGraph,
  removeNode,
  removeEdge,
};
