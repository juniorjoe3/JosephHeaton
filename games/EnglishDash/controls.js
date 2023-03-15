console.log("load controls")


import { game } from "./main.js";




// keyboard controls
const keysDown = function(e) {
    e = e || window.event;
    switch (e.key) {
        case 'ArrowUp':
            game.keyDown("playerOne","up");
            break;
        case 'ArrowDown':
            game.keyDown("playerOne","down");
            break;
        case 'ArrowLeft':
            game.keyDown("playerOne","left");
            break;
        case 'ArrowRight':
            game.keyDown("playerOne","right");
            break;
        case 'w':
            game.keyDown("playerOne","up");
            break;
        case 's':
            game.keyDown("playerOne","down");
            break;
        case 'a':
            game.keyDown("playerOne","left");
            break;
        case 'd':
            game.keyDown("playerOne","right");
            break;    
    }
}

const keysUp = function(e) {
    e = e || window.event;
    switch (e.key) {
        case 'ArrowUp':
            game.keyUp("playerOne","up");
            break;
        case 'ArrowDown':
            game.keyUp("playerOne","down");
            break;
        case 'ArrowLeft':
            game.keyUp("playerOne","left");
            break;
        case 'ArrowRight':
            game.keyUp("playerOne","right");
            break;
        case 'w':
            game.keyUp("playerOne","up");
            break;
        case 's':
            game.keyUp("playerOne","down");
            break;
        case 'a':
            game.keyUp("playerOne","left");
            break;
        case 'd':
            game.keyUp("playerOne","right");
            break;
        case 'Escape':
            game.pause();
            break;
    }
}

document.addEventListener("keydown", keysDown);
document.addEventListener("keyup", keysUp);