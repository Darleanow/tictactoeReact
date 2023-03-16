import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className={`square ${isWinningSquare ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}



function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  let status;
  if (winningSquares) {
    status = 'Winner: ' + squares[winningSquares[0]];
  } else if (squares.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const renderSquare = (i) => {
    const isWinningSquare = winningSquares && winningSquares.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  };

  const board = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      row.push(renderSquare(index));
    }
    board.push(<div className="board-row" key={i}>{row}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSort() {
    setIsAscending(!isAscending);
  }
  function handlePlay(nextSquares, clickedSquare) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    console.log(nextHistory);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  
  const moves = history.map((step, move) => {
  const description = move ? `Go to move #${move} ${calculateLocation(step.clickedSquare)}` : 'Go to game start';
  const isCurrentMove = move === currentMove;
  return (
    <li key={move}>
      {isCurrentMove ? (
        <span className="current-move">You are at move #{move}</span>
      ) : (
        <button
          className="move-btn"
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      )}
    </li>
  );
  });
  

  if (!isAscending) {
    moves.reverse();
  }

  const winner = calculateWinner(currentSquares);
  let status;
  let winningSquares;
  if (winner) {
    status = 'Winner: ' + winner.player;
    winningSquares = winner.line;
  } else if (currentSquares.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winningSquares={winningSquares}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={toggleSort}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
function calculateLocation(index) {
  const col = (index % 3) + 1;
  const row = Math.floor(index / 3) + 1;
  return `(${col}, ${row})`;
}




function calculateWinner(squares) {
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
      console.log('Winner: ', { player: squares[a], line: lines[i] });
      return { player: squares[a], line: lines[i] };
    }
  }
  return null;
}
