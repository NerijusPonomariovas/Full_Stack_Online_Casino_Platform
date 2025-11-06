import Cell from './Cell'; 

const BOARD = [
       [{value: "treat"}, {value: "treat"}, {value: "treat"}, {value: "treat"}, {value: "mine"}],
       [{value: "treat"}, {value: "treat"}, {value: "mine"}, {value: "treat"}, {value: "treat"}],
       [{value: "treat"}, {value: "treat"}, {value: "treat"}, {value: "treat"}, {value: "treat"}],
       [{value: "treat"}, {value: "treat"}, {value: "treat"}, {value: "treat"}, {value: "treat"}],
       [{value: "treat"}, {value: "mine"}, {value: "treat"}, {value: "treat"}, {value: "treat"}],
      ];

const Board = () => {
    return (
     <div className="board">
        {BOARD.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
            {row.map((cell, cellIndex) => (
                <Cell cell={cell} key={cellIndex} /> 
            ))}
        </div>
       ))}
        </div>
    );
};

export default Board;