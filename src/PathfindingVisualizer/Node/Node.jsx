import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      col,
      isStart,
      isEnd,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;
    const extraClassName = isStart
      ? "start-node"
      : isEnd
      ? "end-node"
      : isWall
      ? "wall-node"
      : "";
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}

// export class SquareGrid extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     const {
//       col,
//       isStart,
//       isEnd,
//       isWall,
//       onMouseDown,
//       onMouseEnter,
//       onMouseUp,
//       row,
//     } = this.props;
//     const extraClassName = isStart
//       ? "start-node"
//       : isEnd
//       ? "end-node"
//       : isWall
//       ? "wall-node"
//       : "";
//     return (
//       <div
//         id={`node-${row}-${col}`}
//         className={`node ${extraClassName}`}
//         onMouseDown={() => onMouseDown(row, col)}
//         onMouseEnter={() => onMouseEnter(row, col)}
//         onMouseUp={() => onMouseUp()}
//       ></div>
//     );
//   }
// }
