// localStorage.clear();



// load game -----------------------------------------------------
console.log('begin main.js load')

import {gameObj,Game,playAudio} from './classes.js';

//global objects, variables
const game = new Game(1200,500,0,0,1200,500,'game_camera');
let player = '';
let previousMenu = '';
let currentMenu = 'mainMenu';
loadGameData();
updateWordList();

console.log('main.js loaded')

function updateWordList() {
    const list = document.getElementById('wordList').value;
    let filePath = '';
    switch(list) {
        case 'plurals':
            filePath = './pluralsList.json'
            break;
        case 'animals':
            filePath = './pluralsList.json'
            break;
        case 'transportation':
            filePath = './pluralsList.json'
            break;
    }
    fetchFilePath(filePath);
}

async function fetchFilePath(filePath) {
    try {
      const response = await fetch(filePath);
      if (response.ok) {
        console.log('loaded successfully')
        const data = await response.text();
        sessionStorage.setItem('wordList', data);
      } else {
        console.log('!!!failed to load');
      }
    }
      catch(error){
      console.log(error)   //doesnt do anything
    }
  }

// load data from local storage ----------------------------------------
function loadGameData() {
    loadSettings();
}

function loadSettings() {
    const windowRange = document.getElementById('windowRange');
    const volumeRange = document.getElementById('volumeRange');
    const playerInput = document.getElementById('playerName');
    if (localStorage.getItem('playerName') != null) {
        windowRange.value = Number(localStorage.getItem('windowScale'));
        volumeRange.value = Number(localStorage.getItem('volume'));  
        playerInput.value = localStorage.getItem('playerName');
    }
    updateSettings();  
}

// save data to local storage -------------------------------------------
function saveGameData() {
    saveSettings();
}

function saveSettings() {
    const windowRange = document.getElementById('windowRange');
    const volumeRange = document.getElementById('volumeRange');
    const playerInput = document.getElementById('playerName');
    localStorage.setItem('windowScale', (windowRange.value));
    localStorage.setItem('volume',volumeRange.value);
    localStorage.setItem('playerName', playerInput.value);

}


  // main game logic -------------------------------------------------------
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
    document.getElementById('floatingMenu').style.backgroundColor = 'transparent';
    eventListeners('add');
    menuHandler('mainMenu','')

    const wordList = createWordArray();
    game.changeWordList(wordList);

    player = game.createGameObj('player','/images/blue_barrier.png',200,230,50,50,10,500,true);
    player.colType = 'bounce';
    player.addTextBox('me')
    
    game.gameRound = 0;
    game.gameScore = 0;
    game.normal_startGame();
}

function quitGame() {
    document.getElementById('floatingMenu').style.backgroundColor = null;
    game.deleteAllObjs();
}


// --- menu buttons --------------------------------------------------
function pauseGame() {
    game.pauseGame();
    eventListeners('remove')
    menuHandler('','pauseMenu');
    playAudio('click',game.volume);
}

function unPauseGame() {
    eventListeners('add');
    game.unPauseGame();
    menuHandler('pauseMenu','');
    playAudio('click',game.volume);
}

function back() {
    playAudio('click',game.volume);
    switch (currentMenu) {
        case 'settingsMenu':
            updateSettings();
            break;
    }
    menuHandler(currentMenu, previousMenu);
}

function updateSettings() {
    const windowRange = document.getElementById('windowRange');
    const volumeRange = document.getElementById('volumeRange');
    const game_container = document.getElementById('game_container')
    const val = windowRange.value/100;
    game_container.style.transform = "scale(" + val + ")";
    game.volume = Number(volumeRange.value);
}

function openSettingsMenu() {
    playAudio('click',game.volume);
    menuHandler(currentMenu,'settingsMenu');
}

function openMainMenu() {
    playAudio('click',game.volume);
    quitGame();
    menuHandler(currentMenu,'mainMenu')
}

function restartGame() {
    playAudio('click',game.volume);
    quitGame();
    menuHandler('pauseMenu','');
    startGame();
}


function menuHandler(from_id,to_id) {
    if (from_id != '') {
        previousMenu = from_id;
        const from = document.getElementById(from_id);
        switch (from_id) {
            case 'settingsMenu':
                from.style.display = 'none';
                break;
            case 'pauseMenu':
                from.style.display = 'none';
                break;
            case 'mainMenu':
                from.style.display = 'none';
                break;
        }
    } else {
        document.getElementById('floatingMenu').style.display = 'flex'
    }

    if (to_id != '') {
        currentMenu = to_id;
        const to = document.getElementById(to_id);
        switch (to_id) {
            case 'settingsMenu':
                to.style.display = 'flex';
                break;
            case 'pauseMenu':
                to.style.display = 'flex';
                break;
            case 'mainMenu':
                to.style.display = 'flex';
                break;
        }
    } else {
        document.getElementById('floatingMenu').style.display = 'none';
    }
}



// on & off event listeners
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

// permanent event listeners ----------------------------------------------------
document.getElementById('resume_btn').addEventListener('click', unPauseGame)
document.getElementById('settingsBack_btn').addEventListener('click', back)
document.getElementById('main_settings_btn').addEventListener('click', openSettingsMenu)
document.getElementById('pause_settings_btn').addEventListener('click', openSettingsMenu)
document.getElementById('play_btn').addEventListener('click', startGame)
document.getElementById('quit_btn').addEventListener('click', openMainMenu)
document.getElementById('restart_btn').addEventListener('click', restartGame)
window.addEventListener("beforeunload", saveGameData, false);


// keyboard controls
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





