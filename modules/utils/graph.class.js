class Node {
  constructor(obj) {
    this.id = obj.id;
    this.edges = new Set();
  }
}

class Edge {
  constructor(obj, directed = false) {
    this.from = obj.from;
    this.to = obj.to;
    this.weight = obj.weight || 0;

    this.id = directed ? `${this.from}->${this.to}` : `${this.from}--${this.to}`;
  }
}

class Graph {
  constructor(obj) {
    const { nodes, edges, directed } = obj;

    this.directed = !!directed;
    this.nodes = new Map();
    this.edges = new Map();

    if (Array.isArray(nodes))
      nodes.forEach((id) => {
        this.addNode(new Node({ id }));
      });

    if (Array.isArray(edges))
      edges.forEach((item) => {
        this.addEdge(new Edge(item, this.directed));
      });
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  getEdges() {
    return Array.from(this.edges.values());
  }

  addNode(node) {
    if (!this.nodes.has(node.id)) this.nodes.set(node.id, node);
  }

  addEdge(edge) {
    if (this.edges.has(edge.id)) return;

    this.edges.set(edge.id, edge);

    let node;
    node = this.nodes.get(edge.from);
    if (node) node.edges.add(edge);

    if (!this.directed) {
      // A->B === B->A
      node = this.nodes.get(edge.to);
      if (node) node.edges.add(edge);
    }
  }

  removeNode(id) {
    const node = this.getNode(id);
    if (!node) return;

    // clear edges of node
    node.edges.forEach((item) => {
      this.removeEdge(item.id);
    });

    this.nodes.delete(id);
  }

  removeEdge(id) {
    const edge = this.edges.get(id);
    if (!edge) return;

    let node;
    node = this.nodes.get(edge.from);
    if (node) node.edges.delete(edge);

    if (!this.directed) {
      node = this.nodes.get(edge.to);
      if (node) node.edges.delete(edge);
    }

    this.edges.delete(id);
  }

  toJSON() {
    const result = {
      directed: this.directed,
      nodes: Array.from(this.nodes.keys()),
      edges: Array.from(this.edges.values()).map((edge) => ({ ...edge }))
    };
    return result;
  }
}

module.exports = Graph;
