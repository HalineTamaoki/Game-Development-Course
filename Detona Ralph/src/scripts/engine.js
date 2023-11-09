const state = {
    pages:{
        startPage: document.getElementById("start-page"),
        gamePage: document.getElementById("game-page"),
        endPage: document.getElementById("end-page"),
    },
    view: {
        startButton: document.getElementById("start-button"),
        playAgainButton: document.getElementById("play-again-button"),
        squares: document.querySelectorAll(".square"),
        timeLeft: document.getElementById("time-left"),
        score: document.getElementById("score"),
        finalScore: document.getElementById("final-score")
    },
    values: {
        gameVelocity: 500,
        bombNumber: 10,
        gameTime: 60,
        hitPosition: null,
        clicked: false,
        imageNumber: null,
        score: 0,
        currentTimeLeft: null,
    },
    actions: {
        countDownId: null,
        timerId: null
    },
}

function changePage(page){
    switch(page){
        case 1:
            if(state.pages.startPage) state.pages.startPage.classList.add('hidden')
            if(state.pages.gamePage) state.pages.gamePage.classList.remove('hidden')
            if(state.pages.endPage )state.pages.endPage.classList.add('hidden')

            initGame();
            break;
        case 2:
            if(state.pages.startPage) state.pages.startPage.classList.add('hidden')
            if(state.pages.gamePage) state.pages.gamePage.classList.add('hidden')
            if(state.pages.endPage )state.pages.endPage.classList.remove('hidden')

            state.view.finalScore.innerText = state.values.score
            state.view.playAgainButton.addEventListener("mousedown", ()=>changePage(1))
            break;
        default:
            if(state.pages.startPage) state.pages.startPage.classList.remove('hidden')
            if(state.pages.gamePage) state.pages.gamePage.classList.add('hidden')
            if(state.pages.endPage )state.pages.endPage.classList.add('hidden')
            break;
    }
}
function cleanGame(){
    state.values.currentTimeLeft = state.values.gameTime
    state.values.score = 0
    state.values.hitPosition = 0
    state.values.imageNumber = 0

    state.view.timeLeft.innerText = state.values.currentTimeLeft
    state.view.squares.forEach((squares)=>squares.className="square")
}

function randomSquare(){
    let randomNumber = Math.floor(Math.random()*9)
    let randomNumber2 = Math.floor(Math.random()*10)+1

    if(state.view.squares[randomNumber]){
        let enemy = document.querySelector('[class*="enemy"]')

        if(enemy){
            enemy.classList.remove(`enemy-${state.values.imageNumber}`)
        }
        state.view.squares[randomNumber].classList.add(`enemy-${randomNumber2}`)
        state.values.clicked=false
        state.values.hitPosition=randomNumber
        state.values.imageNumber=randomNumber2
    }


}

function countDown(){
    state.values.currentTimeLeft--
    if(state.view.timeLeft) state.view.timeLeft.innerText = state.values.currentTimeLeft+1

    if(state.values.currentTimeLeft ==0){
        clearInterval(state.actions.countDownId)
        clearInterval(state.actions.timerId)

        changePage(2);
    }
}

function setScore(){
    if(state.values.imageNumber == state.values.bombNumber){
        state.values.score --
        playSound(false)
    } else{
        playSound(true)
        state.values.score ++
    }

    state.values.clicked = true;
    state.view.score.innerText = state.values.score
}

function addListenerHitBox(){
    state.view.squares.forEach((square)=>square.addEventListener("mousedown", () => {
        if(!state.values.clicked && square.id == state.values.hitPosition+1){
            setScore();
        }
    }))
}

function playSound(success){
    if(success){
        let audio = new Audio("./src/audios/right.mp3")
        audio.play();        
    } else {
        let audio = new Audio("./src/audios/wrong.mp3")
         audio.play();       
    }
}

function setIntervals(){
    state.actions.countDownId=setInterval(countDown, 1000)
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity)
}

function initGame(){
    cleanGame();
    setIntervals();
    addListenerHitBox();
}

function init(){
    if(state.view.startButton) {
        state.view.startButton.addEventListener("mousedown", ()=>changePage(1))
    }
}

init();