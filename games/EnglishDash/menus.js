console.log('load menu')

import { func } from "./MiscFunc.js";
import { game, audioHandler } from "./main.js";

export const menus = {
    div: document.getElementById('menus_container'),
    history: ['main'],
    main: {},
    settings: {},
    pause: {},
    gameOver: {},
    yesNo: {},
    inGame: {}
};

menus.goBack = function() {
    audioHandler.play('click');
    const currentMenu_ID = menus.history.pop();
    const previousMenu_ID = menus.history[menus.history.length-1]
    menus[currentMenu_ID].div.style.display = 'none';
    menus[previousMenu_ID].div.style.display = 'flex';
}


const main = menus.main;
const settings = menus.settings;
const pause = menus.pause;
const gameOver = menus.gameOver;
const yesNo = menus.yesNo;
const inGame = menus.inGame;


// main menu ---------------------------------------------------------------

main.id = 'main';
main.question = 'english';
main.div = document.getElementById('main');
main.wordList_select = document.getElementById('wordList');
main.question_container = document.getElementById('question_container');
main.question_select = document.getElementById('question');
main.playerName_input = document.getElementById('playerName');
main.play_btn = document.getElementById('play_btn');
main.settings_btn = document.getElementById('main_settings_btn');


    main.open = function() {
        audioHandler.play('click');
        const previousMenu = menus[menus.history[menus.history.length-1]];
        previousMenu.div.style.display = 'none';
        menus.history.push(main.id);
        main.div.style.display = 'flex';
        menus.div.style.backgroundColor = "rgb(102, 166, 206)";
    }

    main.click_play = function() {
        inGame.open();
        game.start();
    }

    main.updateWordList = async function() {
        const list = main.wordList_select.value;
        let filePath = '';
        switch(list) {
            case 'plurals':
                filePath = './pluralsList.json'
                main.question = 'english';
                main.question_select.value = 'english';
                main.question_container.style.display = 'none';
                document.getElementById(list).text = 'Plurals';
                break;
            case 'animals':
                filePath = './animals.json'
                main.question_container.style.display = null;
                document.getElementById(list).text = 'Animals';
                break;
            case 'flyers':
                filePath = './flyers.json'
                main.question_container.style.display = null;
                document.getElementById(list).text = 'Flyers Test';
                break;
        }
        await func.fetchFileToSessionStorage(filePath,'wordList');
            if (main.question == 'chinese') {
                main.question = 'english'; //change the new list to chinese
            }
            main.updateQuestion();
    }

    main.updateQuestion = function() {
        const wordArray = JSON.parse(sessionStorage.getItem('wordList'));
        if (main.question_select.value != main.question) {
            main.question = main.question_select.value;
            for (let i = 0; i<wordArray.length;i++) {
                const QA = wordArray[i];
                const question = QA.question;
                const answer = QA.answer;
                QA.question = answer;
                QA.answer = question;
            }
            sessionStorage.setItem('wordList',JSON.stringify(wordArray));
        }
        // const option = document.getElementById(main.wordList_select.value);
        // option.text = option.text + " - " + wordArray.length;
    }

// settings menu --------------------------------------------------------------

settings.id = 'settings';
settings.div = document.getElementById('settings');
settings.gameWindow_range = document.getElementById('windowRange');
settings.masterVol_range = document.getElementById('masterVolume')
settings.UIVol_range = document.getElementById('UIVolume');
settings.effectsVol_range = document.getElementById('effectsVolume');
settings.voiceVol_range = document.getElementById('voiceVolume');
settings.clearScores_btn = document.getElementById('clearScores_btn');
settings.back_btn = document.getElementById('settingsBack_btn');

    settings.open = function() {
        audioHandler.play('click');
        const previousMenu = menus[menus.history[menus.history.length-1]];
        previousMenu.div.style.display = 'none';
        menus.history.push(settings.id);
        settings.div.style.display = 'flex';
    }

    settings.update = function() {
        const scale = settings.gameWindow_range.value/100;
        game.div.style.transform = "scale(" + scale + ")";
        audioHandler.masterVol = settings.masterVol_range.value;
        audioHandler.uiVol = settings.UIVol_range.value;
        audioHandler.effectsVol = settings.effectsVol_range.value;
        audioHandler.voiceVol = settings.voiceVol_range.value;
    }

    settings.click_clearScores = function() {  
        yesNo.confirmClearScores(); 
    }

    settings.clearScores = function() {
        audioHandler.play('childgoodbye');
        localStorage.setItem('highScore', 0);
        localStorage.setItem('hsName','');
    }

    settings.click_back = function() {
        settings.update();
        menus.goBack();
    }


// pause menu ------------------------------------------------------------------

pause.id = 'pause';
pause.div = document.getElementById('pause');
pause.resume_btn = document.getElementById('resume_btn');
pause.settings_btn = document.getElementById('pause_settings_btn');
pause.restart_btn = document.getElementById('pause_restart_btn');
pause.quit_btn = document.getElementById('pause_quit_btn');

    pause.open = function() {
        audioHandler.play('click');
        const previousMenu = menus[menus.history[menus.history.length-1]];
        previousMenu.div.style.display = 'none';
        menus.history.push(pause.id);
        pause.div.style.display = 'flex';
    }

    pause.click_resume = function() {
        game.blockControls = false;
        inGame.open();
    }

    pause.click_quit = function() {
        audioHandler.play('click');
        game.quit();
        main.open();
    }

    pause.click_restart = function() {
        game.quit();
        game.start();
        inGame.open();
    }

    
// gameOver menu ----------------------------------------------------------------

gameOver.id = 'gameOver';
gameOver.div = document.getElementById('gameOver');
gameOver.playerName_h2 = document.getElementById('go_playerName');
gameOver.score_h2 = document.getElementById('go_score');
gameOver.highScore_h2 = document.getElementById('go_highScore');
gameOver.restart_btn = document.getElementById('go_restart_btn');
gameOver.quit_btn = document.getElementById('go_quit_btn');

    gameOver.open = function() {
        menus.div.style.display = 'flex'
        menus.history.push(gameOver.id);
        gameOver.div.style.display = 'flex';
        game.blockControls = true;
    }

    
// yesNo menu --------------------------------------------------------------

yesNo.id = 'yesNo';
yesNo.div = document.getElementById('yesNo');
yesNo.question_h1 = document.getElementById('yesNoQuestion');
yesNo.yes_btn = document.getElementById('yes_btn');
yesNo.no_btn = document.getElementById('no_btn');
yesNo.operation = '';

    yesNo.open = function() {
        audioHandler.play('click');
        const previousMenu = menus[menus.history[menus.history.length-1]];
        previousMenu.div.style.display = 'none';
        menus.history.push(yesNo.id);
        yesNo.div.style.display = 'flex';
    }

    yesNo.confirmClearScores = function() {
        yesNo.open();
        yesNo.question_h1 = 'Are you sure you want to clear the highscore?'
        yesNo.operation = 'clearScores';
    }   

    yesNo.click_yes = function() {
        switch (yesNo.operation) {
            case "clearScores":
                settings.clearScores();
                menus.goBack();
                break;
        }
    };


    
// inGame menu ----------------------------------------------------------------------

inGame.id = 'inGame';
inGame.div = document.getElementById('inGame');
inGame.header_div = document.getElementById('header');
inGame.footer_div = document.getElementById('footer');
inGame.score_div = document.getElementById('score');
inGame.title = document.getElementById('title');
inGame.pause_btn = document.getElementById('pause_btn');
inGame.bottomText_div = document.getElementById('bottomText_div');

    inGame.open = function() {
        audioHandler.play('click');
        game.startMainLoop();
        game.blockControls = false;
        const previousMenu = menus[menus.history[menus.history.length-1]];
        previousMenu.div.style.display = 'none';
        menus.history.push(inGame.id);
        menus.div.style.display = 'none';
        menus.div.style.backgroundColor = "transparent";
    }

    inGame.click_pause = function() {
        menus.div.style.display = 'flex'
        game.stopMainLoop();
        game.blockControls = true;
        pause.open();
    }


// --------- event listeners ----------------------------


main.settings_btn.addEventListener('click', settings.open);
main.wordList_select.addEventListener('input', main.updateWordList);
main.question_select.addEventListener('input', main.updateQuestion);
main.play_btn.addEventListener('click', main.click_play);

settings.clearScores_btn.addEventListener('click', settings.click_clearScores);
settings.back_btn.addEventListener('click', settings.click_back);

pause.resume_btn.addEventListener('click', pause.click_resume);
pause.settings_btn.addEventListener('click', settings.open);
pause.quit_btn.addEventListener('click', pause.click_quit);
pause.restart_btn.addEventListener('click', pause.click_restart);

gameOver.quit_btn.addEventListener('click', pause.click_quit);
gameOver.restart_btn.addEventListener('click', pause.click_restart);

yesNo.yes_btn.addEventListener('click', yesNo.click_yes);
yesNo.no_btn.addEventListener('click', menus.goBack);

inGame.pause_btn.addEventListener('click', inGame.click_pause)



