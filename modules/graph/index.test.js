const {
  createGraph,
  removeNode,
  removeEdge
} = require('./');

require('../../test')(createGraph, [__dirname, 'tests', 'creation']);
require('../../test')(removeNode, [__dirname, 'tests', 'remove-node']);
require('../../test')(removeEdge, [__dirname, 'tests', 'remove-edge']);
