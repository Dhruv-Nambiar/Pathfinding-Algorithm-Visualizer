export function DFSmaze(grid, startNode, endNode) {
  const stack = [startNode];
  const visitedNodes = [];

  while (stack.length) {
    const currentNode = stack.pop();
    visitedNodes.push(currentNode);
    currentNode.isVisited = true;
    const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
    shuffle(unvisitedNeighbors);
    for (let i = 0; i < unvisitedNeighbors.length; i++) {
      unvisitedNeighbors[i].previousNode = currentNode;
      stack.push(unvisitedNeighbors[i]);
    }
  }
  return visitedNodes;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 2) neighbors.push(grid[row - 2][col]);
  if (row < grid.length - 2) neighbors.push(grid[row + 2][col]);
  if (col > 2) neighbors.push(grid[row][col - 2]);
  if (col < grid[0].length - 2) neighbors.push(grid[row][col + 2]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
