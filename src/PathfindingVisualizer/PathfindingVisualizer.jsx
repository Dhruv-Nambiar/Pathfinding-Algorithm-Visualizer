import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import { dijkstra, getNodesInShortestPath } from "../algorithms/dijkstras.jsx";
import { DFSmaze } from "../algorithms/DFSmaze.jsx";

let GRID_ROWS = 15;
let GRID_COLS = 23;
let CONTENT_WIDTH = "1000px";
const START_NODE_ROW = 7;
const START_NODE_COL = 3;
const END_NODE_ROW = 7;
const END_NODE_COL = 19;
const PATHFINDING_ANIMATION_SPEED = 20;
const SHORTEST_PATH_ANIMATION_SPEED = 70;
const MAZE_GENERATION_ANIMATION_SPEED = 40;
const MAZE_GENERATION_ANIMATION_DELAY = 1500;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      mouseMode: "pencil",
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
    window.addEventListener("mousedown", () => {
      this.setState({ mouseIsPressed: true });
    });
    window.addEventListener("mouseup", () => {
      this.setState({ mouseIsPressed: false });
    });
    const grid = getInitialGrid();
    this.setState({ grid });
    GRID_ROWS = Math.round(
      (window.innerHeight * 0.75) / ((window.innerWidth * 0.75) / GRID_COLS)
    );
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  animateDijkstra(visitedNodes, nodesInShortestPath) {
    //Always skip start node in animation
    let nodesToAnimate = visitedNodes.slice(1, visitedNodes.length);
    //If there is a path to the end-node, don't animate the end-node
    if (nodesInShortestPath.length !== 1) nodesToAnimate.pop();

    for (let i = 0; i <= nodesToAnimate.length; i++) {
      if (i === nodesToAnimate.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPath);
        }, PATHFINDING_ANIMATION_SPEED * i);
        return;
      }
      setTimeout(() => {
        const node = nodesToAnimate[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, PATHFINDING_ANIMATION_SPEED * i);
    }
  }

  animateShortestPath(nodesInShortestPath) {
    //Skip the first and last node in animation
    //i.e. the start and end node
    const nodesToAnimate = nodesInShortestPath.slice(
      1,
      nodesInShortestPath.length - 1
    );

    for (let i = 0; i < nodesToAnimate.length; i++) {
      setTimeout(() => {
        const node = nodesToAnimate[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, SHORTEST_PATH_ANIMATION_SPEED * i);
    }
  }

  visualizeDijkstra() {
    this.softReset();
    resetNodeAnimationClasses(document);
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[END_NODE_ROW][END_NODE_COL];
    const visitedNodes = dijkstra(grid, startNode, endNode);
    if (visitedNodes.length === 1) return;
    const nodesInShortestPath = getNodesInShortestPath(endNode);
    this.animateDijkstra(visitedNodes, nodesInShortestPath);
  }

  animateDFSMaze(visitedNodes) {
    const newGrid = getNewGridWithOnlyWalls(this.state.grid);
    this.setState({ grid: newGrid });
    const nodesToAnimate = visitedNodes.slice();
    for (let i = 1; i <= nodesToAnimate.length; i++) {
      if (i === nodesToAnimate.length) {
        setTimeout(() => {
          for (let i = 1; i < nodesToAnimate.length; i++) {
            const nextNode = nodesToAnimate[i];
            const prevNode = nextNode.previousNode;
            const midNode =
              newGrid[(nextNode.row + prevNode.row) / 2][
                (nextNode.col + prevNode.col) / 2
              ];
            const newMidNode = {
              ...midNode,
              isWall: false,
            };
            const newNextNode = {
              ...nextNode,
              isWall: false,
            };
            newGrid[midNode.row][midNode.col] = newMidNode;
            newGrid[nextNode.row][nextNode.col] = newNextNode;
          }
        }, PATHFINDING_ANIMATION_SPEED * i + MAZE_GENERATION_ANIMATION_DELAY);
        return;
      }
      setTimeout(() => {
        if (i > 1) {
          const lastIterationNextNode = nodesToAnimate[i - 1];
          const lastIterationPrevNode = lastIterationNextNode.previousNode;
          const lastIterationMidNode = getMiddleNode(
            newGrid,
            lastIterationNextNode,
            lastIterationPrevNode
          );
          document.getElementById(
            `node-${lastIterationMidNode.row}-${lastIterationMidNode.col}`
          ).className = "node";
          if (
            lastIterationNextNode.row !== END_NODE_ROW ||
            lastIterationNextNode.col !== END_NODE_COL
          )
            document.getElementById(
              `node-${lastIterationNextNode.row}-${lastIterationNextNode.col}`
            ).className = "node";
        }
        const nextNode = nodesToAnimate[i];
        const prevNode = nextNode.previousNode;
        const midNode = getMiddleNode(newGrid, nextNode, prevNode);
        document.getElementById(
          `node-${midNode.row}-${midNode.col}`
        ).className = "node current-node";
        if (nextNode.row !== END_NODE_ROW || nextNode.col !== END_NODE_COL)
          document.getElementById(
            `node-${nextNode.row}-${nextNode.col}`
          ).className = "node current-node";
      }, MAZE_GENERATION_ANIMATION_SPEED * i + MAZE_GENERATION_ANIMATION_DELAY);
    }
  }

  generateDFSMaze() {
    this.reset();
    const { grid } = this.state;
    const visitedNodes = DFSmaze(
      grid,
      grid[START_NODE_ROW][START_NODE_COL],
      null
    );
    this.reset();
    this.animateDFSMaze(visitedNodes);
  }

  reset() {
    resetNodeClasses(document);
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  //Resets previousNode and isVisited of all nodes
  softReset() {
    const newGrid = this.state.grid.slice();
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const node = newGrid[row][col];
        const newNode = {
          ...node,
          previousNode: null,
          isVisited: false,
        };
        newGrid[row][col] = newNode;
      }
    }
    this.setState({ grid: newGrid });
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

  debug() {
    resetNodeAnimationClasses(document);
    console.log(this.state.width);
    console.log(this.state.height);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <div class="header">
          <p>Pathfinding Visualizer</p>
          <button class="regularbtn" onClick={() => this.debug()}>
            Debug
          </button>
          <button class="visualizebtn" onClick={() => this.visualizeDijkstra()}>
            Visualize
          </button>
          <button class="regularbtn" onClick={() => this.reset()}>
            Reset
          </button>
          <button
            class="regularbtn"
            onClick={() => this.setMouseMode("pencil")}
          >
            Pencil
          </button>
          <button
            class="regularbtn"
            onClick={() => this.setMouseMode("eraser")}
          >
            Eraser
          </button>
          <button class="regularbtn" onClick={() => this.generateDFSMaze()}>
            New Maze
          </button>
          <div class="slidecontainer">
            <input
              type="range"
              min="15"
              max="31"
              defaultValue="23"
              class="slider"
              id="myRange"
            />
          </div>
        </div>
        <div
          className="square-grid"
          style={{
            "--columns": `${GRID_COLS}`,
            "--content-width": `${this.state.width * 0.75 + "px"}`,
          }}
        >
          {grid.map((row, rowIdx) => {
            return row.map((node, nodeIdx) => {
              const { row, col, isStart, isEnd, isWall } = node;
              return (
                <Node
                  key={nodeIdx}
                  row={row}
                  col={col}
                  isStart={isStart}
                  isEnd={isEnd}
                  isWall={isWall}
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
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithOnlyWalls = (grid) => {
  const newGrid = grid.slice();
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (row === START_NODE_ROW && col === START_NODE_COL) continue;
      if (row === END_NODE_ROW && col === END_NODE_COL) continue;
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isWall: true,
        isVisited: false,
      };
      newGrid[row][col] = newNode;
    }
  }
  return newGrid;
};

const getMiddleNode = (grid, nodeA, nodeB) => {
  const middleNodeRow = nodeA.row / 2 + nodeB.row / 2;
  const middleNodeCol = nodeA.col / 2 + nodeB.col / 2;
  return grid[middleNodeRow][middleNodeCol];
};

const resetNodeClasses = (document) => {
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
};

const resetNodeAnimationClasses = (document) => {
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      let className = document.getElementById(`node-${row}-${col}`).className;
      className = className.replace(
        /node-visited|current-node|node-shortest-path/,
        ""
      );
      document.getElementById(`node-${row}-${col}`).className = className;
    }
  }
};
