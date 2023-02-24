console.log('run main.js')




// testing ------------------------------------------------------------------------------------
import {gridObj,Grid} from './classes.js';

const grid = new Grid(1000,600,0,0,1000,600,'game_camera');

const garbageCan = grid.createGridObj('garbageCan','/images/garbage_closed.png',200,200,75,100,5,400);
const garbageOpen5 = grid.createGridObj('garbageOpen5','/images/garbage_closed.png',300,50,50,70,5,200);
const garbageOpen6 = grid.createGridObj('garbageOpen6','/images/garbage_closed.png',300,500,75,100,5,900);
const garbageOpen7 = grid.createGridObj('garbageOpen7','/images/garbage_closed.png',100,50,50,70,5,200);
const garbageOpen8 = grid.createGridObj('garbageOpen8','/images/garbage_closed.png',50,300,75,100,5,900);

grid.createHardBoundry();

garbageCan.colType = 'bounce'
garbageOpen5.colType = "bounce";
garbageOpen5.changeVelocity(4,-6);
garbageOpen6.colType = "bounce";
garbageOpen6.changeVelocity(3,-1);
garbageOpen7.colType = "bounce";
garbageOpen7.changeVelocity(1,4);
garbageOpen8.colType = "bounce";
garbageOpen8.changeVelocity(2,3);



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

