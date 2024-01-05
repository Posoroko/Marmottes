const player = {
    name: "Ruben"
}

const game = {
    score: 0,
    missed: 0,
    over: true,
    activeTile: null,
    lastRandomNum: null,
    marmotSpeed: 1000,
    handleMarmotSpeed() {
        console.log('hello');
        // if(this.score % 100 === 0) {
        //     console.log(this.score % 100 === 0)
        //     this.marmotSpeed = this.marmotSpeed - 100;
        // }
    }    
}

const dom = {
    start: document.getElementById('start'),
    reset: document.getElementById('reset'),
    score: document.getElementById('score'),
    missed: document.getElementById('missed'),
    timer: {
        el: document.getElementById('timer'),
        set(sec) {
            this.el.innerHTML = `0:${sec}`
        }
    },
    board: {
        tileBox: document.getElementById('tileBox'),
        tile0: null,
        tile1: null,
        tile2: null,
        tile3: null,
        tile4: null,
        tile5: null,
        tile6: null,
        tile7: null,
        tile8: null        
    }
}

function startClick(e) {
    if(!game.over) return;
    game.over = false;
    startTimer();
    runGame();
}

function resetClick(e) {
    game.over = true;
    game.score = 0;
    game.missed = 0;
    timer.sec = "30";
    dom.score.innerText = "0";
    dom.missed.innerText = "0";
    dom.timer.set("30");
    if(game.activeTile) {
        dom.board[game.activeTile].dataset.state = "pending";
    }
    marmotSpeed = 1000;
    stopTimer();
}
function marmotClick(e) {
    missedClicked();
    updateScore("missed", 1);
}
function hitboxClick(e) {
    toggleActiveTile("success");
    deleteDeadMarmot(game.activeTile, 300);
    game.activeTile = null;
    updateScore("score", 50);
}
function missedClicked() {
    if(game.over) return;

    if(game.activeTile) {
        dom.board[game.activeTile].dataset.state = "pending";
    }
    
    updateScore("missed", 1);
}

function deleteDeadMarmot(tile, time) {
    setTimeout(() => {
        dom.board[tile].dataset.state = "pending";
    }, time);
}

// state = "pending", "active" or "success"
function toggleTile(tile, state) {
   tile.dataset.state = state;
}
function toggleActiveTile(state) {
   dom.board[game.activeTile].dataset.state = state;
}

function updateScore(prop, points) {
    if(prop === "score") {
        game.score = game.score + points;
        dom.score.innerText = game.score;
    }
    if(prop === "missed") {
        game.missed = game.missed + points;
        dom.missed.innerText = game.missed;
    }
}

/*

    Game loop

*/

function runGame() {
    if(game.over) return;

    if(game.activeTile) {
        dom.board[game.activeTile].dataset.state = "pending";
    }
    
    game.activeTile = randomTile();
    dom.board[game.activeTile].dataset.state = "active";
    game.handleMarmotSpeed();
    setTimeout(() => {
        runGame();
    }, game.marmotSpeed);

    if(timer.timeIsUp()) {
        game.over = true;
        stopTimer();
    }
    if(isGameOver()) {
        game.over = true;
        stopTimer();
    }
}

function isGameOver() {
    if(timer.timeIsUp()) {
        game.over = true;
        return true;
    }
    if(game.missed >= 10) {
        game.over = true;
        return true;
    }
    return false;
}

function randomTile() {

    let num = Math.floor(Math.random() * 8);

    if(num === game.lastRandomNum) {
        return `tile${(num + 1) % 9}`;
    }
    game.lastRandomNum = num;
    return `tile${num}`;

}


/*

    Game initioalization

*/
function buildBoard() {
    const tileBox = document.getElementById('tileBox');
    const _tileTemp = document.querySelector("[data-id='tileTemp']");
    const tileTemp = _tileTemp.cloneNode(true);
    _tileTemp.remove();

    const tiles = [];

    for(let i = 0; i <= 8; i++) {

        let temp = tileTemp.cloneNode(true);
        
        
        temp.id = `tile${i}`;

        const marmotTemp = temp.querySelector("[data-id='marmotTemp']");
        marmotTemp.dataset.tile = `tile${i}`;
        marmotTemp.addEventListener('click', (e) => {
            marmotClick(e);
        })

        const hitboxTemp = temp.querySelector("[data-id='hitboxTemp']");
        hitboxTemp.dataset.tile = `tile${i}`;
        hitboxTemp.addEventListener('click', (e) => {
            e.stopPropagation();
            hitboxClick(e)
        })
        //ajouter au HTML
        tileBox.appendChild(temp);
        // garder dan le js
        dom.board[`tile${i}`] = temp;
    }
}

function initiateGame() {
    dom.board.tileBox.addEventListener('click', (e) => {
        missedClicked();
    });

    dom.start.addEventListener('click', (e) => {
        startClick(e);
    });

    dom.reset.addEventListener('click', (e) => {
        resetClick(e);
    })
    buildBoard();
    dom.timer.set("05");
    dom.score.innerText = "0";
    dom.missed.innerText = "0";
}

/*
timer
*/

const timer = {
    sec: "5",
    interval: null,
    timeIsUp() {
        if (this.sec <= 0) {
            this.interval = null;
            return true;
        }
        return false;
    }
}

function startTimer() {
    timer.interval = setInterval(() => {
        updateTimer(-1);
    }, 1000);
}

function stopTimer() {
    console.log("stop timer");
    clearInterval(timer.interval);
    timer.interval = null;
}


function updateTimer(step) {
    let sec = parseInt(timer.sec);
    sec = sec + step;
    if(sec <= 0) {

        game.over = true;
        stopTimer();
    }

    
 
    timer.sec = sec;
    dom.timer.set(("0" + sec).slice(-2));
}

initiateGame();