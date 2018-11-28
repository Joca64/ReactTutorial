import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const squareName = this.props.victory[i] ? 'square victory' : 'square';

    return <Square
      key={i}
      value={this.props.squares[i]}
      className={squareName}
      onClick={() => this.props.onClick(i)}
    />;
  }

  createRows() {
    let rows = [];

    for(let line = 0; line < 3; line++) {
      let cells = [];
      
      for(let cell = 0; cell < 3; cell++) {
        cells.push(this.renderSquare(3 * line + cell));
      }

      rows.push(<div className="board-row" key={line}>{cells}</div>)
    }
    return rows;
  }

  render() {
    return (
      <div>
        {this.createRows()}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveSpot: ''
      }],
      xIsNext: true,
      stepNumber: 0,
      victoryArray: Array(9).fill(false),
      normalOrder: true
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
      victoryArray: Array(9).fill(false)
    })
    const history = this.state.history;
    const currentMove = history[this.state.stepNumber];
    calculateWinner(currentMove.squares, this.state.victoryArray);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(squares[i] || calculateWinner(squares, this.state.victoryArray)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveSpot: i
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      victoryArray: this.state.victoryArray
    });
  }

  render() {
    const history = this.state.history;
    const currentMove = history[this.state.stepNumber];
    const gameEndMessage = calculateWinner(currentMove.squares, this.state.victoryArray);

    const movesButtons = history.map((move, moveNumber) => {
      const description = moveNumber ?
        'Go to move #' + moveNumber + ' (' +Math.ceil((move.moveSpot+1)/3) +',' +((move.moveSpot+1) - (Math.floor(move.moveSpot/3)*3)) +')':
        'Go to game start';

      if(moveNumber === this.state.stepNumber)
      {
        return (
          <li key={moveNumber}>
            <button onClick={() => this.jumpTo(moveNumber)}><b>{description}</b></button>
          </li>
        )
      } else {
        return (
          <li key={moveNumber}>
            <button onClick={() => this.jumpTo(moveNumber)}>{description}</button>
          </li>
        )
      }
    });

    if(!this.state.normalOrder) {
      movesButtons.reverse();
    }

    let status;
    if(gameEndMessage) {
      status = gameEndMessage;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            key='board'
            squares={currentMove.squares}
            victory={this.state.victoryArray}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.setState({normalOrder: !this.state.normalOrder})}>Reverse Move Order</button>
          <div>{status}</div>
          <ol reversed={!this.state.normalOrder}>{movesButtons}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares, victory) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      victory[a] = true;
      victory[b] = true;
      victory[c] = true;
      return 'Winner: ' +squares[a];
    }
  }

  for (let cell = 0; cell < squares.length; cell++) {
    if(!squares[cell]) {
      return null;
    }
  }

  return 'It\'s a draw!';
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
