const P1 = 'P1';
const P2 = 'P2';

let player = function(name) {
    let playerArray = Array(9).fill(0);

    this.name = name;

    this.fillPlayerArray = function(index) {
        playerArray[index] = 1;
    }

    this.getPlayerArray = function() {
        return playerArray;
    }

    this.clearPlayerArray = function() {
        playerArray = Array(9).fill(0);
    }

    return {fillPlayerArray, getPlayerArray, name, clearPlayerArray};
};

let gamePlay = (function() {
    
    let turn = true;

    let winningPositions = [7, 56, 73, 84, 146, 273, 292, 448];

    this.checkArray = function(array) {
        let str = array.join('');
        let n = parseInt(str, 2);
        let setBitsInN = checkSetbits(n);
        if(setBitsInN > 2) {
            for(let i = 0; i<winningPositions.length; i++) {
                let res = n & winningPositions[i];
                if(res == winningPositions[i])
                    return true;
            }
        }
    }

    this.getTurn = function() {
        if(turn) {
            turn = false;
            return P1;
        } else {
            turn = true;
            return P2;
        }
    }

    this.displayOverlay = function(winner) {
        let ele = document.createElement('label');
        ele.setAttribute('id','result');
        ele.textContent = winner + ' won';
        let messageDiv = document.querySelector('#message-container');
        console.log(ele); 
        messageDiv.insertBefore(ele, messageDiv.childNodes[messageDiv.childNodes.length - 2]);
        document.querySelector('#overlay').style.display = 'block';
    }

    this.refresh = function(p1, p2) {
        p1.clearPlayerArray();
        p2.clearPlayerArray();
        document.querySelectorAll('#game-container img').forEach(ele => ele.remove());
        document.querySelector('#result').remove();
        document.querySelector('#overlay').style.display = 'none';
    }


    function checkSetbits(n) {
        let count = 0;
        while(n) {
            n = n & (n-1);
            count++;
        }
        return count;
    }

    return {checkArray, getTurn, displayOverlay, refresh};
})();

(function (selector) {
    let boxes = document.querySelectorAll(selector);
    let restartButton = document.querySelector('#restart');
    let humanGif = document.querySelector('#human');
    let homeButton = document.querySelector('#home');

    let player1 = player('Player 1');
    let player2 = player('Player 2');

    let init = function() {
        boxes.forEach(box => {
            box.addEventListener('click', addXorO);
        });
        restartButton.addEventListener('click', gamePlay.refresh.bind(this, player1, player2));
        humanGif.addEventListener('click', function() {
            document.querySelector('#first-page').style.display = 'none';
            document.querySelector('#second-page').style.display = 'block';
        });

        homeButton.addEventListener('click', function() {
            gamePlay.refresh(player1, player2);
            document.querySelector('#first-page').style.display = 'block';
            document.querySelector('#second-page').style.display = 'none';
        });
    }

    function addXorO(e) {
        if (e.target.childNodes.length == 0) {
            if(gamePlay.getTurn() == P1) {
                let img = document.createElement('img');
                img.setAttribute('src','pngs/x.png');
                e.target.appendChild(img);
                player1.fillPlayerArray(e.target.getAttribute('id').split('-')[1]);
                if (gamePlay.checkArray(player1.getPlayerArray())) {
                    gamePlay.displayOverlay(player1.name);
                }
            } else {
                let img = document.createElement('img');
                img.setAttribute('src','pngs/o.png');
                e.target.appendChild(img);
                player2.fillPlayerArray(e.target.getAttribute('id').split('-')[1]);
                if (gamePlay.checkArray(player2.getPlayerArray())) {
                    gamePlay.displayOverlay(player2.name);
                }
            }

        }

    }

    init();
})('#game-container div');

