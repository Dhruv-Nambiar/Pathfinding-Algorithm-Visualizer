import React, { Component } from "react";
import Node from "./Node/Node";
import "./Node/Node.css";
import "./PathfindingVisualizer.css";
import { dijkstra, getNodesInShortestPath } from "../algorithms/dijkstras.jsx";

let GRID_ROWS = 30;
let GRID_COLS = 50;
const START_NODE_ROW = 15;
const START_NODE_COL = 15;
const END_NODE_ROW = 15;
const END_NODE_COL = 35;
const PATHFINDING_ANIMATION_SPEED = 20;
const SHORTEST_PATH_ANIMATION_SPEED = 80;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      mouseMode: "pencil",
    };
  }
  componentDidMount() {
    window.addEventListener("mousedown", () => {
      this.setState({ mouseIsPressed: true });
    });
    window.addEventListener("mouseup", () => {
      this.setState({ mouseIsPressed: false });
    });
    // const viewportWidth = window.innerWidth;
    // GRID_COLS = viewportWidth / 20;
    // const viewportHeight = window.innerHeight;
    // GRID_ROWS = viewportHeight / 20;
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  animateDijkstra(visitedNodes, nodesInShortestPath) {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPath);
        }, PATHFINDING_ANIMATION_SPEED * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, PATHFINDING_ANIMATION_SPEED * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, SHORTEST_PATH_ANIMATION_SPEED * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[END_NODE_ROW][END_NODE_COL];
    const visitedNodes = dijkstra(grid, startNode, endNode);
    const nodesInShortestPath = getNodesInShortestPath(endNode);
    this.animateDijkstra(visitedNodes, nodesInShortestPath);
  }

  reset() {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (row === START_NODE_ROW && col === START_NODE_COL) {
          document.getElementById(`node-${row}-${col}`).className =
            "node start-node";
        } else if (row === END_NODE_ROW && col === END_NODE_COL) {
          document.getElementById(`node-${row}-${col}`).className =
            "node end-node";
        } else {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    if (this.state.mouseMode === "pencil" && this.state.grid[row][col].isWall)
      return;
    if (this.state.mouseMode === "eraser" && !this.state.grid[row][col].isWall)
      return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    if (this.state.mouseMode === "pencil" && this.state.grid[row][col].isWall)
      return;
    if (this.state.mouseMode === "eraser" && !this.state.grid[row][col].isWall)
      return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  setMouseMode(str) {
    this.setState({ mouseMode: str });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.setMouseMode("pencil")}>Pencil</button>
        <button onClick={() => this.setMouseMode("eraser")}>Eraser</button>
        <button onClick={() => this.reset()}>Reset</button>
        {/* <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isStart, isEnd, isWall, isRecentChange } =
                    node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isStart={isStart}
                      isEnd={isEnd}
                      isWall={isWall}
                      isRecentChange={isRecentChange}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div> */}
        <div className="square-grid">
          {grid.map((row, rowIdx) => {
            // row.map((node, nodeIdx) => {
            //   const { row, col, isStart, isEnd, isWall, isRecentChange } = node;
            //   return (
            //     <Node
            //       key={nodeIdx}
            //       row={row}
            //       col={col}
            //       isStart={isStart}
            //       isEnd={isEnd}
            //       isWall={isWall}
            //       isRecentChange={isRecentChange}
            //       mouseIsPressed={mouseIsPressed}
            //       onMouseDown={(row, col) => this.handleMouseDown(row, col)}
            //       onMouseUp={() => this.handleMouseUp()}
            //       onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
            //     ></Node>
            //   );
            // });
            return row.map((node, nodeIdx) => {
              const { row, col, isStart, isEnd, isWall, isRecentChange } = node;
              return (
                <Node
                  key={nodeIdx}
                  row={row}
                  col={col}
                  isStart={isStart}
                  isEnd={isEnd}
                  isWall={isWall}
                  isRecentChange={isRecentChange}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                  onMouseUp={() => this.handleMouseUp()}
                  onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                ></Node>
              );
            });
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  console.log(GRID_ROWS);
  const grid = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < GRID_COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isEnd: row === END_NODE_ROW && col === END_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isRecentChange: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
    isRecentChange: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
