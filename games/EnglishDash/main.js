// localStorage.clear();


// import and export hub ---------------------------------------------------
console.log('begin main.js import and export')

import {getAudioHandler} from './audio.js';
export const audioHandler = getAudioHandler();
audioHandler.audioFolderPath = './audio/'

import {getSprites} from './sprites.js';
export const sprites = getSprites();

import {func} from './MiscFunc.js';

import {Game} from './game.js';
const game = new Game();
export {game}

import { menus } from './menus.js';

console.log('end of main.js import and export')

// load game settings --------------------------------------------------------
console.log('load game settings')
loadGameSettings();

function loadGameSettings() {
    loadSettings();
    checkForHighScore();
    menus.main.updateWordList();
}

function loadSettings() {
    if (localStorage.getItem('playerName') != null) {
        menus.settings.gameWindow_range.value = Number(localStorage.getItem('windowScale'));
        menus.settings.masterVol_range.value = Number(localStorage.getItem('masterVol'));  
        menus.settings.UIVol_range.value = Number(localStorage.getItem('uiVol'));  
        menus.settings.effectsVol_range.value = Number(localStorage.getItem('effectsVol'));  
        menus.settings.voiceVol_range.value = Number(localStorage.getItem('voiceVol'));  
        menus.main.playerName_input.value = localStorage.getItem('playerName');
    }
    menus.settings.update();
}

function checkForHighScore() {
    if (localStorage.getItem('highScore') == null) {
        localStorage.setItem('highScore', 0);
        localStorage.setItem('hsName','');
    }
}

console.log('finished loading game settings')

// save game settings -------------------------------------------
function saveGameSettings() {
    saveSettings();
}

function saveSettings() {
    localStorage.setItem('windowScale',menus.settings.gameWindow_range.value);
    localStorage.setItem('masterVol',menus.settings.masterVol_range.value);
    localStorage.setItem('uiVol',menus.settings.UIVol_range.value);
    localStorage.setItem('effectsVol',menus.settings.effectsVol_range.value);
    localStorage.setItem('voiceVol',menus.settings.voiceVol_range.value);
    localStorage.setItem('playerName', menus.main.playerName_input.value);
}

window.addEventListener("beforeunload", saveGameSettings, false);



// game logic ------------------------------------------------------------------------------

game.start = function() {
    audioHandler.play('update');
    menus.inGame.bottomText_div.innerHTML = "Use WASD or the arrow keys to move!"
    game.createOuterBoundry();
    const wordList = createWordArray();
    game.changeWordList(wordList);

    game.round = 0;
    game.score = 0;
    game.health = 3;

    const playerOne = game.createNewEntity('playerOne','player','/images/spr_bird.png',300,300,1,75,75,5,10,500);
    playerOne.addTextBox('you');
    playerOne.addSprite(sprites.get('bird'));
    
    buildPlayerControls();
    game.blockControls = false;

    createLoopEvents();
    game.startMainLoop();
    game.runEvent('moveEntities')
    game.runEvent('spawnInBots');
    game.runEvent('startRoundOne');
    game.runEvent('updateSprite')

}

function createWordArray() {
    const wordArray = JSON.parse(sessionStorage.getItem('wordList'));
    return func.randomizeArray(wordArray);
}

function buildPlayerControls() {
    const playerOne = game.entity('playerOne');
    playerOne.beginAction = function(action) {
        switch(action) {
            case 'up':
                playerOne.yVel = -playerOne.speed;
                break;
            case 'down':
                playerOne.yVel = playerOne.speed;
                break;
            case 'left':
                playerOne.xVel = -playerOne.speed;
                break;
            case 'right':
                playerOne.xVel = playerOne.speed;
                break;
        }
    }
    playerOne.endAction = function(action) {
        switch(action) {
            case 'up':
                if (!game.controls.get('playerOnedown')) {
                    playerOne.yVel = 0; 
                }
                break;
            case 'down':
                if (!game.controls.get('playerOneup')) {
                    playerOne.yVel = 0; 
                }
                break;
            case 'left':
                if (!game.controls.get('playerOneright')) {
                    playerOne.xVel = 0; 
                }
                break;
            case 'right':
                if (!game.controls.get('playerOneleft')) {
                    playerOne.xVel = 0; 
                }
                break;
        }
    }
}

function newRound() {
    if (game.round > (game.wordList.length - 1)) {
      game.round = 0
      game.changeWordList(randomizeArray(game.wordList));
    }
    const question = game.wordList[game.round].question;
    const answer = game.wordList[game.round].answer;
    menus.inGame.bottomText_div.innerHTML = question;
    const answerArray = func.randomizeArray(func.filterOut(Array.from(game.answerSet),answer)); // randomize and remove answer
    answerArray.unshift(answer); // put answer at top of array
    const order = func.randomizeArray([5,6,7,8]); // get random order for bot_5 to bot_8
    game.entity('playerOne').textValue = question;
    for (let i = 0; i < 4; i++) {
        const name = 'bot_' + order[i];
        game.entity(name).textValue = answerArray[i];
        game.entity(name).speed += 0.15;
    }
  }

function gameOver() {
    console.log('gameOver')
    menus.gameOver.playerName_h2.innerHTML = menus.main.playerName_input.value;
    menus.gameOver.score_h2.innerHTML = "Score: " + game.score;
    const text = "Highscore: " + localStorage.getItem('highScore') + " " + localStorage.getItem('hsName');
    menus.gameOver.highScore_h2.innerHTML = text;
    menus.gameOver.open();
    if (localStorage.getItem('highScore') < game.score) {
        localStorage.setItem('highScore', game.score)
        localStorage.setItem('hsName', ("(" + menus.main.playerName_input.value + ")"));
        setTimeout(()=>{audioHandler.play('wow');},200);
    } else {
        setTimeout(()=>{audioHandler.play('childuhoh');},200);
    }
    // setTimeout(()=>{game.stopMainLoop();},500)
}


// build game loop events

function createLoopEvents() {
    // move entities and check for collision 
    const moveEntities = game.buildEvent('moveEntities');
    moveEntities.counter = -1; // allows the event to run an infinite number of times
    moveEntities.delay = 0; // no buffer
    moveEntities.buffer = 0; // no delay
    moveEntities.eachEvent = function() {
        const entityArray = Array.from(game.entities.values()); // to be used in the collision detection
        for (const entity of game.entities.values()) {
            
            if (!entity.isDead && (entity.xVel != 0 || entity.yVel != 0)) {
                
                let result = game.moveEntity('x',entity,entityArray);
                if (result != false && entity.isSpawnMode == false) {
                    collisionHandler(entity, result);    
                }
                entity.updatePos();
                result = game.moveEntity('y',entity,entityArray);
                if (result != false && entity.isSpawnMode == false) {
                    collisionHandler(entity, result);    
                }
                entity.updatePos();
            }
        }   
    }
    function collisionHandler(entity_1, result) {
        const axis = result[1];
        const entity_2 = result[0];
        if ((entity_1.group != 'barrier') && (entity_2.group != 'barrier') && (entity_1.group == 'player' || entity_2.group == 'player')) {
            let answer;
            if (entity_1.group == 'bot') {
                respawnBot(entity_1);
                answer = entity_1.textValue;
            } else {
                respawnBot(entity_2);
                answer = entity_2.textValue;
            } 
            if (answer == game.wordList[game.round].answer) {
                audioHandler.play('coin');
                game.score +=1;
                game.round +=1;
                newRound();
            } else {
                audioHandler.play('wrong');
                game.health -= 1;
                game.runEventXTimes('hurtAnimation', 3);
                if (game.health == 0) {
                menus.inGame.bottomText_div.innerHTML = '';
                gameOver();
                } 
            }
        } else {
            if (entity_1.group == 'bot') {
                game.colBounce(axis, entity_1, entity_2);
              } else {
                game.colBlock(axis, entity_1);
              }
        }
    }
    function respawnBot(entity) {
        entity.isSpawnMode = true;
        entity.xPos = game.width + 10;
        entity.yPos = game.height / 2;
        let xVal = func.rndBetween(-(entity.speed),-1);
        let yVal = func.rndBetween(-(entity.speed),entity.speed)
        if (Math.abs(xVal / yVal) < 0.30) {
            xVal = -5;
            yVal = 0;
            console.log('ahhh')
        }
        entity.xVel = xVal;
        entity.yVel = yVal;
    }

    // spawn in the bots
    const spawnInBots = game.buildEvent('spawnInBots');
    spawnInBots.counter = 4;
    spawnInBots.buffer = .5;
    spawnInBots.delay = 0;
    spawnInBots.eachEvent = function() {
        console.log('spawnInBots')
        let name = 'bot_' + game.entities.size;
        const xPos = (game.width + 10) 
        const yPos = (game.height / 2) - (40/2);
        const entity = game.createNewEntity(name,'bot','/images/bird2.png',xPos,yPos,1,50,50,5,1,500);
        entity.addSprite(sprites.get('bird'));
        entity.addTextBox('');
        entity.xVel = -3;
    }
    
    // start round one and scatter the direction of the bots
    const startRoundOne = game.buildEvent('startRoundOne');
    startRoundOne.counter = 1;
    startRoundOne. buffer = 0;
    startRoundOne.delay = 3;
    startRoundOne.eachEvent = function() {
        console.log('startRoundOne')
        newRound();
        for (let i = 5; i < 9 ;i++) {
            game.entity('bot_' + i).xVel = func.rndBetween(-2,2)
            game.entity('bot_' + i).yVel = func.rndBetween(-2,2)
        }
    }
     // hurt animation
    const hurtAnimation = game.buildEvent('hurtAnimation');
    hurtAnimation.buffer = .2;
    hurtAnimation.counter = 3;
    hurtAnimation.delay = 0;
    hurtAnimation.eachEvent = function() {
        console.log('hurt animation')
        game.cam_div.style.backgroundColor = "rgb(238, 153, 153)";
        game.cam_div.style.backgroundBlendMode = 'overlay';
        setTimeout(()=>{game.cam_div.style.backgroundBlendMode = null;},100)
    }

    // sprites
    const updateSprite = game.buildEvent('updateSprite');
    updateSprite.counter = -1;
    updateSprite.buffer = 0.03;
    updateSprite.delay = 0;
    updateSprite.eachEvent = function() {
        // console.log('sprites')
        for (const entity of game.entities.values()) { 
            if (entity.sprite) {
                game.spriteHandler(entity);    
            }    
        }   
    }

} // end of create events


