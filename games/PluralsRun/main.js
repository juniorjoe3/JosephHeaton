console.log('run main.js')




// testing ------------------------------------------------------------------------------------
import {gridObj,Grid} from './classes.js';

const grid = new Grid(1000,600,0,0,1000,600,'game_camera');

const garbageCan = grid.createGridObj('garbageCan','/images/garbage_closed.png',200,200,75,100,5);
const garbageOpen = grid.createGridObj('garbageOpen','/images/garbage_closed.png',100,100,75,100,5);
const garbageOpen2 = grid.createGridObj('garbageOpen2','/images/garbage_closed.png',0,0,75,100,5);
const garbageOpen3 = grid.createGridObj('garbageOpen3','/images/garbage_closed.png',300,300,75,100,5);
const garbageOpen4 = grid.createGridObj('garbageOpen4','/images/garbage_closed.png',400,500,75,100,5);
const garbageOpen5 = grid.createGridObj('garbageOpen5','/images/garbage_closed.png',10,300,75,100,5);
const garbageOpen6 = grid.createGridObj('garbageOpen6','/images/garbage_closed.png',700,300,75,100,5);

grid.createHardBoundry();



// player controls ---------------------------------------------------------------------------
document.addEventListener("keydown", (e) => {keysDown(e)});
document.addEventListener("keyup", (e) => {keysUp(e)});


function keysDown(e) {
    e = e || window.event;
    switch (e.key) {
        case 'ArrowUp':
            garbageCan.upGo();
            break;
        case 'ArrowDown':
            garbageCan.downGo();
            break;
        case 'ArrowLeft':
            garbageCan.leftGo();
            break;
        case 'ArrowRight':
            garbageCan.rightGo();
            break;
        case 'w':
            garbageOpen.upGo();
            break;
        case 's':
            garbageOpen.downGo();
            break;
        case 'a':
            garbageOpen.leftGo();
            break;
        case 'd':
            garbageOpen.rightGo();
    }
}

function keysUp(e) {
    e = e || window.event;
    switch (e.key) {
        case 'ArrowUp':
            garbageCan.upStop();
            break;
        case 'ArrowDown':
            garbageCan.downStop();
            break;
        case 'ArrowLeft':
            garbageCan.leftStop();
            break;
        case 'ArrowRight':
            garbageCan.rightStop();
            break;
        case 'w':
            garbageOpen.upStop();
            break;
        case 's':
            garbageOpen.downStop();
            break;
        case 'a':
            garbageOpen.leftStop();
            break;
        case 'd':
            garbageOpen.rightStop();
            break;      
    }
}

