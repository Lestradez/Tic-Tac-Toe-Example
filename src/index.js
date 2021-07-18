import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//--------Board Component
class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      lastSquare: null,
    };
    
  }
  
  renderSquare(i) {
    let style;
    switch(i){
      case 0: style ={borderTopLeftRadius:'4vw'};
      break;
      case 2: style ={borderTopRightRadius:'4vw'};
      break;
      case 6: style ={borderBottomLeftRadius:'4vw'};
      break;
      case 8: style ={borderBottomRightRadius:'4vw'};
      break;
      default: style ={};
    }
    return <Square 
      style = {style}
      key = {'square'+i}
      value={this.props.squares[i]}
      squareClass={(i===this.props.lastSquare)? 'square current':'square'} 
      onClick={ ()=>this.props.onClick(i)}
      />;
  }
  
  render() {
    
    return <div className="board">{ createSquares(this) }</div> 
    
  }
}

//----------Game Component
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history : [{
        squares: Array(9).fill(null),
        stepCoordinates:'',
        lastSquare: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      //squareClass: 'scuare',
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    const stepCoordinates= calcCoordinates(i);
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares:squares,
        stepCoordinates: stepCoordinates,
        lastSquare: i,
      }]),      
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2)===0,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner( current.squares);
    //const squareClass = 'square';
    const moves = history.map((step,move)=>{
      const coordinates = step.stepCoordinates;
      const desc = move ?
      'Move # ' + move :
      'Start';     
      return(
        <li key={move}>
          <button className = "button" onClick = {()=> this.jumpTo(move)}>{desc}</button>
          <label className = "coordinates" > {coordinates}</label>
        </li>
      );
    });
    
    let status;
    if (winner){  
      status = 'Winner is: ' + winner;      
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            stepCoordinates = {current.stepCoordinates}
            lastSquare = {current.lastSquare}
            onClick = {(i)=>{this.handleClick(i)}} />
        </div>
        <div className="game-info">
          <div><h1>{ status }</h1></div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

//-----------Functions

function createSquares(board) {
  let rows = [];
  for(var i = 0; i < 3; i++){
    let squares = [];
    for(var j = 0; j < 3; j++){
      squares.push(board.renderSquare(3*i+j));
    }
    rows.push(<div key = {'row'+i} className="board-row">{squares}</div>);
  }
  return rows;
}

function Square(props) {
  
  return (
    <button style = {props.style} className={props.squareClass} onClick={ props.onClick }>
      {props.value}
    </button> 
  );
  
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
      return squares[a];
    }
  }
  return null;
}

function calcCoordinates(i){
  const board = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
  ];
  let rowPos;
  let colPos;
  for(let j=1;j<=3;j++) {
    for(let k=1;k<=3;k++){ 
      if(i===board[j-1][k-1]){
        rowPos = j;
        colPos = k;
      };
  };
  };

  return '(' + colPos + ',' + rowPos + ')';
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
