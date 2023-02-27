

// load -----------------------------------------------------
console.log('main.js loaded')
import {gridObj,Grid,playAudio} from './classes.js';
fetchWordList();
const grid = new Grid(1100,500,0,0,1100,500,'game_camera');
grid.createHardBoundry();
const player = grid.createGridObj('player','/images/red_barrier.png',800,200,50,50,15,1000);
player.colType = 'bounce'
player.addTextBox('me')






async function fetchWordList() {
    try {
      const response = await fetch('./pluralsList.json');
      if (response.ok) {
        console.log('loaded successfully')
        const data = await response.text();
        sessionStorage.setItem('wordList', data);
        createWordArray();
      } else {
        console.log('!!!failed to load');
      }
    }
      catch(error){
      console.log(error)   //doesnt do anything
    }
  }

  // main -------------------------------------------------------
function createWordArray() {
    const wordArray = JSON.parse(sessionStorage.getItem('wordList'));
    return randomizeArray(wordArray);
}

function randomizeArray(array) {
    const randomArray = [];
    const length = array.length;
    for (let i = 0; i < length; i++) {
        const pair = [i,(Math.random())];
        randomArray[i] = pair;
    }
    randomArray.sort(function(a,b){
        if (a[1] > b[1]) {
            return -1;
          } else {
            return 1;
          }
    });
    const outputArray = [];
    for (let i = 0; i < length; i++) {
        outputArray.push(array[randomArray[i][0]]);
    }
    return outputArray;
}

function startGame() {
    eventListeners('add');
    document.getElementById('pauseMenu').style.top = "-200px";

    grid.volume = 50;

    for (let i = 1; i < 10; i++) {
       let obj = grid.createGridObj(('bot' + i),'/images/red_barrier.png',(50*i),(50*i),40,40,5,500);
       obj.colType = 'bounce';
       obj.changeVelocity(Math.random()*6,Math.random()*6);
    }

}

function eventListeners(call) {
    if (call == 'add') {
        document.addEventListener("keydown", keysDown);
        document.addEventListener("keyup", keysUp);
        document.getElementById('pause_btn').addEventListener('click', pauseGame)
    }   else {
        document.removeEventListener("keydown", keysDown);
        document.removeEventListener("keyup", keysUp);
        document.getElementById('pause_btn').removeEventListener('click', pauseGame)
    }
}

function pauseGame() {
    grid.pauseObjs();
    eventListeners('remove')
    document.getElementById('pauseMenu').style.top = "40%";
    playAudio('click',grid.volume);
}

function unPauseGame() {
    eventListeners('add');
    document.getElementById('pauseMenu').style.top = "-200px";
    grid.unPauseObjs();
    playAudio('click',grid.volume);
}


// event listeners ----------------------------------------------------
document.getElementById('resume_btn').addEventListener('click', unPauseGame)

var keysDown = function(e) {
    e = e || window.event;
    switch (e.key) {
        case 'ArrowUp':
            player.upGo();
            break;
        case 'ArrowDown':
            player.downGo();
            break;
        case 'ArrowLeft':
            player.leftGo();
            break;
        case 'ArrowRight':
            player.rightGo();
            break;
    }
}

var keysUp = function(e) {
    e = e || window.event;
    switch (e.key) {
        case 'ArrowUp':
            player.upStop();
            break;
        case 'ArrowDown':
            player.downStop();
            break;
        case 'ArrowLeft':
            player.leftStop();
            break;
        case 'ArrowRight':
            player.rightStop();
            break;
        case 'Escape':
            pauseGame();
            break;
    }
}

// ---- testing -----------------

startGame();




