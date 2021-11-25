const P1 = 'X';
const P2 = 'O';
let aiActive = false;

let player = function(name, mark) {

    this.name = name;

    this.mark = mark;

    return {name, mark};
};

let gameBoard = (function() {

    let board = [...Array(9).keys()];


    this.clearBoard = function() {
        for(let i = 0;i<board.length;i++){
            board[i] = i;
        }
    }

    return {board, clearBoard};
})();

let gamePlay = (function() {
    
    let turn = P2;

    let winningPositions = [7, 56, 73, 84, 146, 273, 292, 448];

    this.checkCurrentState = function(board, currMark) {
        let binaryNum = '';
        let flag = false;
        for (let i = 0; i < 9; i++) {
            if (board[i] == currMark) {
                binaryNum += '1';
            } else {
                binaryNum += '0';
            }
        }
        binaryNum = parseInt(binaryNum ,2);
        winningPositions.forEach(num => {
            let res = binaryNum & num;
            if(res == num) {
                flag = true;
            }
        })
        return flag;
    }

    this.fetchEmptyIndex = function(board) {
        let emptyIndexes = [];
        for(let i = 0;i<board.length; i++) {
            if(board[i] != 'X' && board[i] != 'O') {
                emptyIndexes.push(i);
            }
        }
        
        return emptyIndexes;
    }

    this.fillBoardWithMark = function(board, index, mark) {
        board[index] = mark;
    }

    this.setTurn = function(turn) {
        this.turn = turn;
    }

    this.getTurn = function() {
        return this.turn;
    };

    this.displayOverlay = function(winner) {
        let ele = document.createElement('label');
        ele.setAttribute('id','result');
        if(winner == '') {
            ele.textContent = 'Game tied';
        } else {
            ele.textContent = winner + ' won';
        }
        let messageDiv = document.querySelector('#message-container');
        messageDiv.insertBefore(ele, messageDiv.childNodes[messageDiv.childNodes.length - 2]);
        document.querySelector('#overlay').style.display = 'block';
    };

    this.refresh = function() {
        turn = P2;
        gameBoard.clearBoard();
        document.querySelectorAll('#game-container img').forEach(ele => ele.remove());
        document.querySelector('#result').remove();
        document.querySelector('#overlay').style.display = 'none';
    };

    // this.fillInRandomBox = function(board) {
    //     let random =  Math.floor((Math.random() * 9) + 1);

    // };

    return {setTurn, getTurn, displayOverlay, refresh, fillBoardWithMark, fetchEmptyIndex, checkCurrentState};
})();

function miniMaxGameplay(currBoard, currMark) {
    const emptyIndexes = gamePlay.fetchEmptyIndex(currBoard);

    if(gamePlay.checkCurrentState(currBoard, P1)) {
        return 1;
    } else if(gamePlay.checkCurrentState(currBoard, P2)) {
        return -1;
    } else if(gamePlay.fetchEmptyIndex(currBoard).length == 0) {
        return 0;
    }

    let allPlayInfo = [];
    for(let i = 0; i<emptyIndexes.length; i++) {
        let currPlayInfo = {};
        let result;
        currPlayInfo.index = currBoard[emptyIndexes[i]];
        currBoard[i] = currMark;
        if(currMark == P1) {
            result = miniMaxGameplay(currBoard, P2);
            currPlayInfo.score = result;
        } else {
            result = miniMaxGameplay(currBoard, P1);
            currPlayInfo.score = result;
        }
        currBoard[emptyIndexes[i]] = currPlayInfo.index;
        allPlayInfo.push(currPlayInfo);
    }

    let bestTestPlay = null;

    if(currMark == P1) {
        let bestScore = -Infinity;
        for(let i = 0;i<allPlayInfo.length; i++) {
            if(allPlayInfo[i].score > bestScore) {
                bestScore = allPlayInfo[i].score;
                bestTestPlay = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for(let i = 0;i<allPlayInfo.length; i++) {
            if(allPlayInfo[i].score < bestScore) {
                bestScore = allPlayInfo[i].score;
                bestTestPlay = i;
            }
        }
    }

    return allPlayInfo[bestTestPlay];

}

(function (selector) {
    let boxes = document.querySelectorAll(selector);
    let restartButton = document.querySelector('#restart');
    let humanGif = document.querySelector('#human');
    let homeButton = document.querySelector('#home');
    let aiGif = document.querySelector('#robot');

    let player1 = player('Player 1', 'X');
    let player2 = player('Player 2', 'O');

    let init = function() {
        boxes.forEach(box => {
            box.addEventListener('click', addXorO);
        });
        restartButton.addEventListener('click', gamePlay.refresh);
        humanGif.addEventListener('click', displayBoard);
        aiGif.addEventListener('click', function() {
            aiActive = true;
            displayBoard();
        })

        homeButton.addEventListener('click', function() {
            gamePlay.refresh();
            document.querySelector('#first-page').style.display = 'block';
            document.querySelector('#second-page').style.display = 'none';
        });
    }

    displayBoard = function() {
        document.querySelector('#first-page').style.display = 'none';
        document.querySelector('#second-page').style.display = 'block';
    };

    function addXorO(e) {
        if (e.target.childNodes.length == 0) {
            if(gamePlay.getTurn() == P1) {
                let img = document.createElement('img');
                img.setAttribute('src','pngs/x.png');
                e.target.appendChild(img);
                gamePlay.fillBoardWithMark(gameBoard.board, e.target.getAttribute('id').split('-')[1], player1.mark);
                gamePlay.setTurn(P2);
                if (gamePlay.checkCurrentState(gameBoard.board, player1.mark)) {
                    gamePlay.displayOverlay(player1.name);
                }
                
            } else {
                let img = document.createElement('img');
                img.setAttribute('src','pngs/o.png');
                e.target.appendChild(img);
                gamePlay.fillBoardWithMark(gameBoard.board, e.target.getAttribute('id').split('-')[1], player2.mark);
                gamePlay.setTurn(P1);
                if (gamePlay.checkCurrentState(gameBoard.board, player2.mark)) {
                    gamePlay.displayOverlay(player2.name);
                }
            }
            if(gamePlay.fetchEmptyIndex(gameBoard.board).length == 0) {
                gamePlay.displayOverlay('');
                return;
            } 

            if(aiActive ) {
                const bestPlay = miniMaxGameplay(gameBoard.board, P1);
                gamePlay.fillBoardWithMark(gameBoard.board, bestPlay.index, P1);
                document.querySelector('box-'+bestPlay.index).appendChild(document.createElement('img').setAttribute('src', 'pngs/x.png'));
                gamePlay.setTurn(P2);
            }
        }
        

    }

    init();
})('#game-container div');

