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
            board[row][col] = value; //the cell's value is updated to either 'X' or 'O'


        } else {
            return false; //the cell is occupied
        }
        printBoard(); //print after playing cell
        displayController.boardDisplay(); // update DOM 

        return true; //successful move was reached
    } 

    //reset board to empty
    function reset () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = ''
            } 
        }
    }
    
    printBoard(); // print at start of game
    return {
        printBoard,
        getBoard,
        playCell,
        reset,
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
            let winner = checkForWins();

            // proceed to cpu's turn only if there is no winner
            if (!winner) {
                cpuTurn();
            }
        }
        return move;
    }

    // generate a random move, repeating until a valid move is reached. 
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
                break;
            }
        }
        checkForWins();
    }

    // check all possible wins and draws, ending game if needed.
    function checkForWins () {

        let winner = false;

        //check columns
        for (let i = 0; i < 3; i++) {
            if (
                board[0][i] !== '' &&
                board[0][i] === board[1][i] &&
                board[1][i] === board[2][i] 
                ) {
                    console.log(`col ${i} win`)
                    win(board[0][i]);
                }

            // check rows
            else if (
                board[i][0] !== '' &&
                board[i][0] === board[i][1] &&
                board[i][1] === board[i][2] 
                ) {
                    console.log (`row ${i} win`)
                    win(board[i][0]);
                }
        }

        //check diagonals
        if (
            board[1][1] !== '' && (
            board[0][0] === board [1][1] &&
            board[1][1] === board [2][2] ||
            board[0][2] === board [1][1] &&
            board[1][1] === board [2][0] )
        ) {
            console.log("diagonal win")
            win(board[1][1]);
        }

        //check draw
        if (
            !(board[0].includes('')) &&
            !(board[1].includes('')) &&
            !(board[2].includes(''))
        ) {
            win('draw');
        }

        // announce a winner and reset the game board.
        function win (player) {
            winner = true;
            // handle a draw game
            if (player === 'draw') {
                console.log('DRAW!')
            } else {
                console.log(player + " WINS!")
            }
            gameBoard.reset();
            gameBoard.printBoard();

            // prevent click from starting a new game until reset button is clicked
            displayController.endGame();
        }
        return winner; //true only if winner is decided
    }

    return {
        playerMove,
        checkForWins,
    };
})()

//3. generate the DOM gameboard, include click listeners, and update its contents during gameplay
const displayController = (function () {
    const boardData = gameBoard.getBoard();
    const board = document.createElement('div');
    document.getElementById('main').appendChild(board);
    board.id = 'board'

    //boolean tracking whether a board has been generated to ensure there are not repeats 
    let boardIsGenerated = false;
    //boolean to check before move is made
    let gameIsOver = false;

    //generate the board in DOM
    function generateBoard () {
        if (boardIsGenerated === false) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    cell = document.createElement('div');
                    cell.classList = "cell";
                    cell.id = `row ${i}, col ${j}`;
        
                    board.appendChild(cell);
                }
            }
            boardIsGenerated = true;
        } 
        
    }
    

    // update the board to reflect the board data
    function boardDisplay () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let cell = document.getElementById(`row ${i}, col ${j}`);
                cell.textContent = boardData[i][j];
            }
        }
    }

    //the function used to play cells when they are clicked 
    function cellClick (i, j){
        if (!gameIsOver) {
            console.log('clicking ' + i + ' , ' + j);
            gameController.playerMove(i, j)
        } else {
            console.log ('cannot move when game is over.')
        }
    }

        
    // add click listeners to board cells to play the cell
    function addClickListeners () {
        console.log("adding listeners");

        // define a reusable click handler function, which can later be removed
        function cellClickHandler (i, j) {
            return () => cellClick (i, j);
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let cell = document.getElementById(`row ${i}, col ${j}`);
                let clickHandler = cellClickHandler(i, j);
                cell.addEventListener('click', () => clickHandler(i, j))
            }
        }
    }

    //start button will generate the board and add click listeners
    const startBtn = document.querySelector('button');
    startBtn.addEventListener('click', pressStart);

    function pressStart() {
        console.log('pressing start');

        generateBoard();
        addClickListeners();

        //'board' div background becomes black to create the game grid
        document.getElementById('board').style.backgroundColor = 'black';

        //'start' button becomes a 'reset' button 
        startBtn.textContent = 'RESET';
        startBtn.removeEventListener('click', pressStart)

        startBtn.addEventListener('click', () => {
            console.log('pressing reset');
            
            gameBoard.reset();
            boardDisplay();
            gameIsOver = false;
            
        })
    };
            
    function endGame () {
        console.log('ending game');
        gameIsOver = true;
    }

    return {
        boardDisplay,
        addClickListeners,
        endGame,
    }

})()

//4. notify the player about the game state using a text element

