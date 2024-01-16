console.log('You got this!!')

//1. display a gameboard array in console and use console to play a cell.
const gameBoard = (() => {
    const board = []

    // generate a 3x3 2d array containing empty strings
    for (let i = 0; i < 3; i++) {
        board.push([]);
        for (let j = 0; j < 3; j++) {
            board[i].push('');
        }
    }

    //displays board in console
    const printBoard = () => {
        console.log(board[0]);
        console.log(board[1]);
        console.log(board[2]);
    }

    //retrieves board for usage outside of closure
    const getBoard = () => {return board;}

    //plays a cell, given an index and player, if the cell is empty
    function playCell (row, col, value) {
        let cell = board[row][col];

        if (cell === '') {
            console.log(cell);
            board[row][col] = value; //the cell's value is updated to either 'X' or 'O'


        } else {
            return false; //the cell is occupied
        }
        printBoard(); //print after playing cell
        return true; //successful move was reached
    } 
    
    printBoard(); // print at start of game
    return {
        printBoard,
        getBoard,
        playCell,
    }    
})()

// 2. create a gameplay loop that responds with a cpu move every time a player moves.
const gameController = (function() {
    const board = gameBoard.getBoard()

    // recieve player input and initiate cpuTurn if a valid move was made.
    function playerMove (row, col) {
        let move = gameBoard.playCell(row, col, 'X');
        if (!move) {
            console.log("Space is occupied. Choose a different space.");
        } else {
            checkForWins();
            cpuTurn();
        }
        return move;
    }

    // generate a random move, repeat until a valid move is reached. 
    function cpuTurn() {
        console.log("cpu's turn");

        // cap at 99 attempts to avoid crashes
        for (i = 0; i < 100; i++) {
            let row = Math.floor(Math.random() * 3);
            let col = Math.floor(Math.random() * 3);
            console.log (`cpu attempting ${row}, ${col}`)

            let move = gameBoard.playCell(row, col, 'O');

            // successful move was made
            if (move) {
                checkForWins();
                return move;
            }
        }
    }

    // check all possible wins and draws, ending game if needed.
    function checkForWins () {

        //check columns
        for (let i = 0; i < 3; i++) {
            if (
                board[0][i] !== '' &&
                board[0][i] === board[1][i] &&
                board[1][i] === board[2][i] 
                ) {
                    console.log(`col ${i} win`)
                    win(board[0][1]);
                    return board[0][i]; //the winning player
                }

        // check rows
            else if (
                board[i][0] !== '' &&
                board[i][0] === board[i][1] &&
                board[i][1] === board[i][2] 
                ) {
                    console.log (`row ${i} win`)
                    win(board[i][0]);
                    return board[i][0]; //the winning player
                }
        }

        //check diagonals
        if (
            board[1][1] !== '' && (
            board[0][0] === board [1][1] &&
            board[1][1] === board [2][2] ||
            board[0][2] === board [1][1] &&
            board[1][1] === board [2] )
        ) {
            console.log("diagonal win")
            win(board[1][1]);
            return board[1][1]; //the winning player
        }
    }

    function win(player) {
        console.log("game over...")
    }

    return {playerMove};
})()



