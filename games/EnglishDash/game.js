console.log('load game')


import { audioHandler } from './main.js';
import { menus } from './menus.js';
import {func} from './MiscFunc.js';


class Event {
  name = '';
  counter = 0;
  #buffer = 0;
  #delay = 0;
  tickStart = 0;
  tickRun = 0;
  game;
  eachEvent = ()=>{};
  endEvent = ()=>{};
  constructor(name, game) {
    this.name = name;
    this.game = game;
  }
  gate() {
    let line = (this.delay + this.tickStart);
    let now = this.game.ticker;
    if (now > line) {
      line = Number(this.buffer) + Number(this.tickRun)
      if (now > line) {
        this.tickRun = this.game.ticker;
        this.eachEvent();
        this.counter -= 1;
      }
      if (this.counter == 0) {
        this.endEvent();
        this.game.eventLooper.delete(this.name);
      } 
   }
  }
  get delay() {
    return Number(this.#delay);
  }
  set delay(seconds) {
    this.#delay = func.ticksInSeconds(seconds,this.game.tickSpeed);
  }
  get buffer() {
    return Number(this.#buffer);
  }
  set buffer(seconds) {
    this.#buffer = func.ticksInSeconds(seconds,this.game.tickSpeed);
  }
}


export class Game {
  //properties
  div = document.getElementById('game_container'); 
  cam_div = document.getElementById('game_camera');
  width = 1200; height = 475; 
  yCam = 25; xCam = 0; wCam = 1200; hCam = 500; 
  entities = new Map();
  controls = new Map();
  blockControls = true;
  wordList = [];
  answerSet = new Set();
  round;
  #score;
  health;
  mainLoopInterval = null; 
  tickSpeed = 15; 
  ticker = 10000;
  events = new Map();
  eventLooper = new Map();
  collisionHandler = ()=>{};
  // init
  constructor() {
    this.cam_div.style.width = this.wCam + 'px';
    this.cam_div.style.height = this.hCam + 'px';
  }
  // methods
  keyDown(entityName, action) {
    if (!this.blockControls) {
      const controlKey = entityName + action;
      if (!(this.controls.has(controlKey))) {
        this.controls.set(controlKey, false)
      } 
      if (!(this.controls.get(controlKey))) {
      this.entity(entityName).beginAction(action);
      this.controls.set(controlKey, true);
      }
    }
  }
  keyUp(entityName, action) {
      const controlKey = entityName + action;
      this.entity(entityName).endAction(action);
      this.controls.set(controlKey, false);
  }
  buildEvent(name) {
    const newEvent = new Event(name,this)
    this.events.set(newEvent.name, newEvent);
    return newEvent;
  }
  runEventXTimes(eventName,numOfTimes) {
    const event = this.events.get(eventName);
    event.counter = numOfTimes;
    event.tickStart = this.ticker;
    if (!this.eventLooper.has(eventName)) {
      this.eventLooper.set(eventName,()=>{event.gate();})
    }
  }
  runEvent(eventName) {
    const event = this.events.get(eventName);
    event.tickStart = this.ticker;
    if (!this.eventLooper.has(eventName)) {
      this.eventLooper.set(eventName,()=>{event.gate();})
    }
  }
  stopEvent(eventName) {
    if (this.eventLooper.has(eventName)) {
      this.eventLooper.delete(eventName);
    }  
  }
  spriteHandler(obj) {
    const sprite = obj.sprite;
    if (sprite.ticker > (sprite.framesPerAni[sprite.currentAni]-1)) {
      obj.sprite.ticker = 0
    }
    if (obj.xVel > 0) {
      obj.image.style.transform = "scaleX(1)";
    } else if ( obj.xVel < 0 )  {
      obj.image.style.transform = "scaleX(-1)";
    }
    let x = -(sprite.frameArray[sprite.currentAni][sprite.ticker][0]);
    let y = -(sprite.frameArray[sprite.currentAni][sprite.ticker][1]);
    // console.log("x: " + x + "  " + "y: " + y);
    obj.image.style.top = y + 'px';
    obj.image.style.left = x + 'px';
    obj.sprite.ticker +=1;

  }
  startMainLoop() {
    if (this.mainLoopInterval == null) {
      this.mainLoopInterval = setInterval(()=>{this.mainLoop();},this.tickSpeed);
    }
  }
  stopMainLoop() {
    clearInterval(this.mainLoopInterval);
    this.mainLoopInterval = null;
  }
  mainLoop() {
    this.ticker +=1;  
    // console.log('iterate through loop')
    for (const eventGate of this.eventLooper.values()) {
      eventGate();
    }
  }
  createNewEntity(name, group, imgPath, xPos, yPos, zPos, width, height, edge, speed, weight) {
    const newEntity = new Entity(this.cam_div, name, group, imgPath, xPos, yPos, zPos, width, height, edge, speed, weight, this);
    this.entities.set(newEntity.name, newEntity);
    return newEntity;
  }
  createOuterBoundry() {
    this.createBarrier(0,-100,1,this.width,100,5); //top
    this.createBarrier(0,this.height,1,this.width,100,5); //bottom
    this.createBarrier(-100,0,1,100,this.height,5); //left
    this.createBarrier(this.width,0,1,100,this.height,5); //right
  }
  createBarrier(xPos, yPos, zPos, width, height, edge) {
    const name = "barrier_" + this.entities.size;
    const newEntity = new Entity(this.cam_div, name, 'barrier', '', xPos, yPos, zPos, width, height, edge, 0, 0, this);
    newEntity.deleteDiv();
    this.entities.set(newEntity.name, newEntity);
    return newEntity;
  }
  quit() {
    this.ticker = 10000;
    this.eventLooper.clear();
    this.events.clear();
    this.stopMainLoop();
    this.deleteAllEntities();
  }
  pause() {
    menus.inGame.click_pause();
  }
  deleteAllEntities() {
    if (this.entities.size > 0) {
      for (const entityName of this.entities.keys()) {
        const entity = this.entity(entityName);
        entity.isDead = true;
        entity.deleteDiv();
      }
      this.entities.clear();
    }
  }
  changeWordList(array) {
    this.wordList.length = 0;
    this.answerSet.clear();
    for (let i = 0; i < array.length; i++) {
      this.wordList[i] = array[i];
      this.answerSet.add(array[i].answer)
    }
  }
  entity(name) {
    return this.entities.get(name);
  }
  moveEntity(axis,entity_1,entityArray) {
    // check x axis
    let index = 0
    const length = entityArray.length;
    let Overlap = false;
    let entity_2;
    if (axis == 'x') {
      entity_1.checkxPos((entity_1.xPos + entity_1.xVel)); // test this new position
      while (Overlap != true && index < length) {
          entity_2 = entityArray[index];
          if (entity_2 != entity_1) {
              if(entity_2.isDead == false && entity_2.isSpawnMode == false) {
                  Overlap = this.checkOverlap(entity_1,entity_2);
              }
          }
          index += 1;    
      }
    } else {
      entity_1.checkyPos((entity_1.yPos + entity_1.yVel)); // test this new position
      while (Overlap != true && index < length) {
          entity_2 = entityArray[index];
          if (entity_2 != entity_1) {
              if(entity_2.isDead == false && entity_2.isSpawnMode == false) {
                  Overlap = this.checkOverlap(entity_1,entity_2);
              }
          }
          index += 1;    
      }
    }
    if (Overlap) {
      return [entity_2,axis];
    } else {
        entity_1.isSpawnMode = false;
        return false;
    }
}
  checkOverlap(entity_1, entity_2) {
    if (entity_1.name != entity_2.name) {
      let x = false;
      let y = false;
      if (!(entity_1.topHitBox > entity_2.bottomHitBox || entity_1.bottomHitBox < entity_2.topHitBox)) {
        y = true;
      }
      if (!(entity_1.leftHitBox > entity_2.rightHitBox || entity_1.rightHitBox < entity_2.leftHitBox)) {
        x = true;
      }
      if (x && y) {
        return true;
      } else {
        return false;
      }
    }
  }
  colBlock(axis, entity_1) {
  if (axis == 'x') {
    entity_1.checkxPos((entity_1.xPos - entity_1.xVel)); // return values to before collision
  } else {
    entity_1.checkyPos((entity_1.yPos - entity_1.yVel));  // return values to before collision
  }  
}
  get score() {
    return this.#score;
  }
  set score(value) {
    menus.inGame.score_div.innerHTML = "Score: " + value;
    this.#score = value;
  }
  colBounce(axis, entity_1, entity_2) {
    audioHandler.play('pop');
    if (axis == 'x') {
      entity_1.checkxPos((entity_1.xPos - entity_1.xVel)); // return values to before collision
    } else {
      entity_1.checkyPos((entity_1.yPos - entity_1.yVel));  // return values to before collision
    }  
    if (entity_2.weight > 0) {
      if (axis == 'x') {
        let m1 = entity_1.weight;
        let m2 = entity_2.weight
        let u1 = entity_1.xVel;
        let u2 = entity_2.xVel;
        entity_1.xVel = (((m1-m2)*u1) + (2*m2*u2)) / (m1+m2)
        entity_2.xVel = (((m2-m1)*u2) + (2*m1*u1)) / (m1+m2)
      } else {
        let m1 = entity_1.weight;
        let m2 = entity_2.weight
        let u1 = entity_1.yVel;
        let u2 = entity_2.yVel;
        entity_1.yVel = (((m1-m2)*u1) + (2*m2*u2)) / (m1+m2)
        entity_2.yVel = (((m2-m1)*u2) + (2*m1*u1)) / (m1+m2)
      }
    } else {
      if (axis == 'x') {
        entity_1.xVel = -(entity_1.xVel);
      } else {
        entity_1.yVel = -(entity_1.yVel);
      }    
    }
  }
}


export class Entity {
    //properties
    name; group; div = false; 
    #width; #height; #xPos; #yPos; zPos; 
    speed; weight; 
    xVel = 0; yVel = 0; 
    edge; sprite;   
    isSpawnMode = true; isDead = false; 
    beginAction;
    endAction;
    game;
    // init
    constructor(parent, name, group, imgPath, xPos, yPos, zPos, width, height, edge, speed, weight, game) {
      this.name = name;
      this.#width = width;
      this.#height = height;
      this.speed = speed;
      this.weight = weight;
      this.#xPos = xPos;
      this.#yPos = yPos;
      this.edge = edge;
      this.zPos = zPos;
      this.game = game;
      this.group = group;

      const newDiv = document.createElement('div');
      if (imgPath != '') {
        const imgCont = document.createElement('div');
        const img = document.createElement('img');
        imgCont.className = 'imgCont';
        img.className = 'objImg';
        img.src = imgPath
        imgCont.appendChild(img);
        newDiv.appendChild(imgCont);
      }
      if (group == 'barrier') {
        this.isSpawnMode = false;
      }
      newDiv.style.display = 'flex';
      newDiv.style.justifyContent = 'center';
      newDiv.style.alignItems = 'center';
      newDiv.id = name;
      newDiv.style.height = this.#height + 'px';
      newDiv.style.width = this.#width + 'px';
      newDiv.className = group;
      newDiv.style.top = (yPos + game.yCam) + 'px';
      newDiv.style.left = (xPos + game.xCam) + 'px';
      parent.appendChild(newDiv);
      this.div = newDiv;
    }
    // methods
    deleteDiv() {
      if (this.div) {
        this.game.cam_div.removeChild(this.div);
        this.div = false;
      }
    }
    addSprite(spriteObj) {
      this.sprite = spriteObj;
      const sprite = this.sprite;
      sprite.divHeight = this.height;
      sprite.divWidth = this.width;
      sprite.calcImgWidth(this.width);
      sprite.calcImgHeight(this.height);
      sprite.calcFrameArray();
      this.image.style.height = sprite.imgHeight + "px";
      this.image.style.width = sprite.imgWidth + "px";
    }
    addTextBox(text) {
      const textBox = document.createElement('div');
      const textNode = document.createTextNode(text);
      textBox.appendChild(textNode);
      textBox.className = 'textBox';
      textBox.style.fontWeight = 'bold';
      textBox.style.padding = "5px";
      textBox.style.fontSize = "1.5rem";
      this.div.appendChild(textBox); 
    }
    checkxPos(x) { //to test a new position without actually showing on screen
      this.xPos = x;
    }
    checkyPos(y) { //to test a new position without actually showing on screen
      this.yPos = y;
    }
    updatePos() {
      this.yPos = this.yPos;
      this.xPos = this.xPos;
    }
    // getters and setters
        get topHitBox() {
          return this.#yPos + this.edge;
        }
        get bottomHitBox() {
          return this.#yPos + this.#height - this.edge;
        }
        get leftHitBox() {
          return this.#xPos + this.edge;
        }
        get rightHitBox() {
          return this.#xPos + this.#width - this.edge;
        }
        get top() {
          return this.div.offsetTop;
        }
        set top(y) {
          this.div.style.top = y + "px";
        }
        get left() {
          return this.div.offsetLeft;
        }
        set left(x) {
          this.div.style.left = x + 'px';
        }
        get xPos() {
          return this.#xPos;
        }
        set xPos(x) {
          this.#xPos = x;
          this.left = (x + this.game.xCam);
        }
        get yPos() {
          return this.#yPos;
        }
        set yPos(y) {
          this.#yPos = y;
          this.top = (y + this.game.yCam);
        }
        get width() {
          return this.#width;
        }
        set width(w) {
          this.#width = w;
          this.div.style.width = w + 'px';
        }
        get height() {
          return this.#height;
        }
        set height(h) {
          this.#height = h;
          this.div.style.height = h + 'px';
        }
        get styleClass() {
          return this.div.className;
        }
        set styleClass(c) {
          this.div.className = c;
        }
        get textValue() {
          return this.div.lastElementChild.innerHTML;
        }
        set textValue(text) {
          this.div.lastElementChild.innerHTML = text;
        }
        get textBox() {
          return this.div.querySelector('div');
        }
        get image() {
          return this.div.querySelector('img');
        }

}

