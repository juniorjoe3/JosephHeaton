import {menuHandler, gameOver} from './main.js';


// audio --------------------
export function playAudio(audio,volume) {
  volume = volume / 100;
  switch (audio) {
    case "bounce":
      let audio_bounce = new Audio('./audio/bounce.mp3');
      audio_bounce.volume = volume;
      audio_bounce.play();
      break;
    case 'pop':
      let audio_pop = new Audio('./audio/pop.mp3');
      audio_pop.volume = volume * (.5);
      audio_pop.play();
      break;
    case 'click':
      let click = new Audio('./audio/click.mp3');
      click.volume = volume;
      click.play();
      break;
    case 'ohno':
      let ohno = new Audio('./audio/ohno.mp3');
      ohno.volume = volume;
      ohno.play();
      break;
    case 'coin':
      let coin = new Audio('./audio/coin.mp3');
      coin.volume = volume;
      coin.play();
      break;
    case 'wrong':
      let wrong = new Audio('./audio/wrong.mp3');
      wrong.volume = volume;
      wrong.play();
      break;
    case 'sadtrumpet':
      let sadtrumpet = new Audio('./audio/sadtrumpet.mp3');
      sadtrumpet.volume = volume;
      sadtrumpet.play();
      break;
    case 'delete':
      let delete_mp3 = new Audio('./audio/delete.mp3');
      delete_mp3.volume = volume;
      delete_mp3.play();
      break;
    case 'update':
      let update = new Audio('./audio/update.mp3');
      update.volume = volume;
      update.play();
      break;
    case 'wow':
      let wow = new Audio('./audio/wow.mp3');
      wow.volume = volume;
      wow.play();
      break;
    case 'childyes':
      let childyes = new Audio('./audio/childyes.mp3');
      childyes.volume = volume;
      childyes.play();
      break;
    case 'childno':
      let childno = new Audio('./audio/childno.mp3');
      childno.volume = volume;
      childno.play();
      break;
    case 'childgoodbye':
      let childgoodbye = new Audio('./audio/childgoodbye.mp3');
      childgoodbye.volume = volume;
      childgoodbye.play();
      break;
    case 'childok':
      let childok = new Audio('./audio/childok.mp3');
      childok.volume = volume;
      childok.play();
      break;
    case 'childuhoh':
      let childuhoh = new Audio('./audio/childuhoh.mp3');
      childuhoh.volume = volume;
      childuhoh.play();
      break;
  }
}


// misc functions ------------------------------------
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

function filterOut(array,value) {
  const newArray = []
  let x = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] != value) {
      newArray[x] = array[i];
      x +=1;
    }
  }
  return newArray;
}

function rndBetween(from,to) {
  return Math.random()*(to-from) + from;
}

export class Game {
  //properties
  #width; #height; #yCam; #xCam; #wCam; #hCam; #cam_ele; #volume; #mainInt; #tickSpeed; #ticker;
  #loopTriggers = [];// main loop triggers
  #loopDelays = [];
  #loopCounters = [];
  gameObjs = []; //all objs in the game 
  gameBarriers = []; // only barriers
  #wordList = [];
  #answerSet = new Set();
  #round = 0;
  #score = 0;
  #health = 0;
  // init
  constructor(width, height, yCam, xCam, wCam, hCam, cam_container_id) {
    this.#height = height;
    this.#width = width;
    this.#yCam = yCam;
    this.#xCam = xCam;
    this.#wCam = wCam;
    this.#hCam = hCam;
    this.#tickSpeed = 15;
    this.#ticker = 10000;
    this.#cam_ele = document.getElementById(cam_container_id);
    this.#cam_ele.style.width = this.#wCam + 'px';
    this.#cam_ele.style.height = this.#hCam + 'px';
    this.#volume = 100;
    for (let i = 0; i < 10;i++) {
      this.#loopDelays[i] = 0;
      this.#loopTriggers[i] = false;
      this.#loopCounters[i] = 0;
    }
  }
  // methods
  endGame() {
    this.pauseGame();
    this.deleteAllObjs();
    this.resetLoop();
  }
  resetLoop() {
    for (let i = 0; i < 10;i++) {
      this.#loopDelays[i] = 0;
      this.#loopTriggers[i] = false;
      this.#loopCounters[i] = 0;
    }
  }
  setMainInt() {
    this.#mainInt = setInterval(()=>{this.mainLoop();},this.#tickSpeed);
  }
  stopMainInt() {
    clearInterval(this.#mainInt);
  }
  mainLoop() {
    this.#ticker +=1;  
    this.loopGate(0,0.5,4, ()=>{this.normal_flyInNewObjs()},()=>{});
    this.loopGate(1,2,2,()=>{},()=>{this.normal_changeDirection()});
    this.loopGate(2,.4,3,()=>{this.normal_hurtAnimation();},()=>{});

    this.loopGate(3,0,0,()=>{},()=>{});
  }
  loopGate(index,delay,count,eachFunc,endFunc) {
    if (this.#loopTriggers[index] == true && this.#ticker > (this.#loopDelays[index] + this.seconds(delay))) { // <-- delay
      eachFunc();
      this.#loopDelays[index] = this.#ticker
      this.#loopCounters[index] += 1;
      if(this.#loopCounters[index] >= (count) ) { // <--- number of times to run
        this.#loopTriggers[index] = false;
        this.#loopCounters[index] = 0;
        endFunc();
      }
   }  
  }
  seconds(seconds) {
    return (seconds * 1000) / this.#tickSpeed;
  }
  createGameObj(html_id, imgPath, xPos, yPos, width, height, speed, weight, isPlayer) {
    const newObj = new gameObj(this.#cam_ele.id, html_id,imgPath, xPos, yPos, width, height, speed,weight, this, isPlayer);
    this.gameObjs.push(newObj);
    return newObj;
  }
  createHardBoundry() {
    this.createGameBarrier(0,-100,this.width,100); //top
    this.createGameBarrier(0,this.height,this.width,100); //bottom
    this.createGameBarrier(-100,0,100,this.height); //left
    this.createGameBarrier(this.width,0,100,this.height); //right
  }
  createGameBarrier(xPos,yPos,width,height) {
    const id = "barrier_" + this.gameBarriers.length;
    const newBarrier = new gameBarrier(id,xPos,yPos,width,height,this);
    this.gameBarriers.push(newBarrier);
    this.gameObjs.push(newBarrier);
    return newBarrier;
  }
  pauseGame() {
    console.log('pause');
    this.stopMainInt();
    this.gameObjs.forEach( obj => {
      if (obj.objType == 'dynamic') {
        obj.stopMoveInt();
      }
    })
  }
  unPauseGame() {
    console.log('unpause');
    this.setMainInt();
    this.gameObjs.forEach( obj => {
      if (obj.objType == 'dynamic') {
        obj.changeVelocity(0,0);
      }
    })
  }
  deleteNonPlayerObjs() {
    console.log('delete all non player objects');
    let obj = this.gameObjs[(this.gameObjs.length - 1)]
    while (obj.isPlayer == false) {
      obj.deleteHTML();
      this.gameObjs.pop();

      obj = this.gameObjs[(this.gameObjs.length - 1)]
    }
  }
  deleteAllObjs() {
    if (this.gameObjs.length > 0) {
      let arrayLength = this.gameObjs.length
      for (let i = 0; i < arrayLength; i++ ) {
        let obj = this.gameObjs[0];
        if ( obj.objType == 'dynamic') {
          obj.isDead = true;
          obj.deleteHTML();
        }
        this.gameObjs.shift();
      }
      delete this.gameBarriers;
      delete this.gameObjs;
      this.gameObjs = [];
      this.gameBarriers = [];
    }
  }
  normal_flyInNewObjs() {
    let name = 'bot ' + this.gameObjs.length;
    const xPos = (this.#width + 10) 
    const yPos = (this.#height / 2) - (40/2);
    const obj = this.createGameObj(name,'', xPos, yPos,40,40,1,500,false)
    obj.colType = 'bounce';
    obj.addTextBox('hello');
    obj.changeVelocity(-3,0);
  }
  normal_startGame() {
    this.createHardBoundry();
    this.setMainInt();
    this.loopTriggers[0] = true; // startNormalMode
    this.loopTriggers[1] = true; // after two seconds change their direction and coltype
  }
  normal_changeDirection() {
        this.normal_newRound();
        this.gameObjs[5].changeVelocity(rndBetween(-1,1), rndBetween(-1,1));
        this.gameObjs[6].changeVelocity(rndBetween(-1,1), rndBetween(-1,1));
        this.gameObjs[7].changeVelocity(rndBetween(-1,1), rndBetween(-1,1));
        this.gameObjs[8].changeVelocity(rndBetween(-1,1), rndBetween(-1,1));
        this.gameObjs[5].colType = 'normalMode';
        this.gameObjs[6].colType = 'normalMode';
        this.gameObjs[7].colType = 'normalMode';
        this.gameObjs[8].colType = 'normalMode';
        this.gameObjs[0].colType = 'normalMode';
  }
  normal_hurtAnimation() {
    this.#cam_ele.style.backgroundColor = "rgb(238, 153, 153)";
    setTimeout(()=>{this.#cam_ele.style.backgroundColor = null;},200)
  }
  normal_newRound() {
    if (this.round > (this.wordList.length - 1)) {
      this.round = 0
      this.changeWordList(randomizeArray(this.wordList));
    }
    const q_div = document.getElementById('currentWord')
    const question = this.wordList[this.round].question;
    const answer = this.wordList[this.round].answer;
    q_div.innerHTML = question;
    const answerArray = randomizeArray(filterOut(Array.from(this.answerSet),answer));
    const order = randomizeArray([5,6,7,8]);
    this.gameObjs[0].textValue = question;
    this.gameObjs[order[0]].textValue = answer;
    this.gameObjs[order[1]].textValue = answerArray[0];
    this.gameObjs[order[2]].textValue = answerArray[1];
    this.gameObjs[order[3]].textValue = answerArray[2];
    this.gameObjs[5].speed += 0.1;
    this.gameObjs[6].speed += 0.1;
    this.gameObjs[7].speed += 0.1;
    this.gameObjs[8].speed += 0.1;
  }
  changeWordList(array) {
    this.#wordList.length = 0;
    this.#answerSet.clear();
    for (let i = 0; i < array.length; i++) {
      this.#wordList[i] = array[i];
      this.answerSet.add(array[i].answer)
    }
  }
  // getters and setters
  get height() {
    return this.#height;
  }
  get width() {
    return this.#width;
  }
  get yCam() {
    return this.#yCam;
  }
  set yCam(y) {
    this.#yCam = y;
  }
  get xCam() {
    return this.#xCam;
  }
  set xCam(x) {
    this.#xCam = x;
  }
  get wCam() {
    return this.#wCam;
  }
  set wCam(w) {
    this.#wCam = w;
  }
  get hCam() {
    return this.#hCam;
  }
  set hCam(h) {
    this.#hCam = h;
  }
  get volume() {
    return this.#volume;
  }
  set volume(volume) {
    this.#volume = volume;
  }
  get cam_ele() {
    return this.#cam_ele;
  }
  get loopTriggers() {
    return this.#loopTriggers;
  }
  get wordList() {
    return this.#wordList;
  }
  get answerSet() {
    return this.#answerSet;
  }
  get round() {
    return this.#round;
  }
  set round(number) {
    this.#round = number;
  }
  get score() {
    return this.#score;
  }
  set score(value) {
    const score_div = document.getElementById('score');
    score_div.innerHTML = "Score: " + value;
    this.#score = value;
  }
  get health() {
    return this.#health;
  }
  set health(number) {
    this.#health = number;
  }
}


export class gameObj {
    //properties
    #html_id; #width; #height; #html_ele; #speed; #xPos; #yPos; #xVel = 0; #yVel = 0; 
    #moveInt = null; #leftKey = false; #rightKey = false; #upKey = false; #downKey = false; 
    #game; #edge; #tickSpeed; #objType; #colType; #weight; #isPlayer; #isSpawnMode;
    isDead = false;
    // init
    constructor(parent_id, html_id, imgPath, xPos, yPos, width, height, speed, weight, game, isPlayer) {
      this.#game = game 
      this.#html_id = html_id;
      this.#width = width;
      this.#tickSpeed = 15;
      this.#height = height;
      this.#speed = speed;
      this.#weight = weight;
      this.#xPos = xPos;
      this.#yPos = yPos;
      this.#edge = 2;
      this.#colType = 'block'
      this.#objType = 'dynamic'
      this.#isPlayer = isPlayer;
      this.#isSpawnMode = true;
      const parent = document.getElementById(parent_id);
      const ele = document.createElement('div');
      ele.style.display = 'flex';
      ele.style.justifyContent = 'center';
      ele.style.alignItems = 'center';
      ele.id = html_id;
      ele.style.backgroundImage = "url('" + imgPath + "')";
      ele.style.height = this.#height + 'px';
      ele.style.width = this.#width + 'px';
      ele.className = 'dynamic'
      ele.style.top = (yPos + game.yCam) + 'px';
      ele.style.left = (xPos + game.xCam) + 'px';
      parent.appendChild(ele);
      this.#html_ele = ele;
    }
    // getters and setters
        get isPlayer() {
          return this.#isPlayer;
        }
        get id() {
          return this.#html_id;
        }
        get objType() {
          return this.#objType;
        }
        get colType() {
          return this.#colType;
        }
        set colType(ct) {
          this.#colType = ct;
        }
        get ele() {
          return this.#html_ele;
        }
        get speed() {
          return this.#speed;
        }
        set speed(s) {
          this.#speed = s;
        }
        get xVel() {
          return this.#xVel;
        }
        set xVel(x) {
          this.#xVel = x
        }
        get yVel() {
          return this.#yVel;
        }
        set yVel(y) {
          this.#yVel = y;
        }
        get tickSpeed() {
          return this.#tickSpeed;
        }
        set tickSpeed(s) {
          this.#tickSpeed = s;
        }
        get topHitBox() {
          return this.#yPos + this.#edge;
        }
        get bottomHitBox() {
          return this.#yPos + this.#height - this.#edge;
        }
        get leftHitBox() {
          return this.#xPos + this.#edge;
        }
        get rightHitBox() {
          return this.#xPos + this.#width - this.#edge;
        }
        get top() {
          return this.#html_ele.offsetTop;
        }
        set top(y) {
          this.#html_ele.style.top = y + "px";
        }
        get left() {
          return this.#html_ele.offsetLeft;
        }
        set left(x) {
          this.#html_ele.style.left = x + 'px';
        }
        get xPos() {
          return this.#xPos;
        }
        set xPos(x) {
          this.#xPos = x;
          this.left = (x - this.game.xCam);
        }
        get yPos() {
          return this.#yPos;
        }
        set yPos(y) {
          this.#yPos = y;
          this.top = (y - this.game.yCam);
        }
        get width() {
          return this.#width;
        }
        set width(w) {
          this.#width = w;
          this.#html_ele.style.width = w + 'px';
        }
        get height() {
          return this.#height;
        }
        set height(h) {
          this.#height = w;
          this.#html_ele.style.height = h + 'px';
        }
        get weight() {
          return this.#weight;
        }
        set weight(w) {
          this.#weight = w;
        }
        get styleClass() {
          return this.#html_ele.className;
        }
        set styleClass(c) {
          this.#html_ele.className = c;
        }
        get textValue() {
          return this.ele.lastElementChild.innerHTML;
        }
        set textValue(text) {
          this.ele.lastElementChild.innerHTML = text;
        }
        get isSpawnMode() {
          return this.#isSpawnMode;
        }
        set isSpawnMode(val) {
          this.#isSpawnMode = val;
        }
        get game() {
          return this.#game;
        }
        get textBox() {
          return this.ele.lastElementChild;
        }
    // methods
    deleteHTML() {
      this.game.cam_ele.removeChild(this.ele);
    }
    addTextBox(text) {
      const textBox = document.createElement('div');
      const textNode = document.createTextNode(text);
      textBox.appendChild(textNode);
      textBox.className = 'textBox';
      textBox.style.backgroundColor = "rgb(241, 192, 192)"; 
      textBox.style.color = "black";
      textBox.style.fontWeight = 'bold';
      textBox.style.border = "1px solid black";
      textBox.style.padding = "5px";
      textBox.style.fontSize = "1.5rem";
      this.ele.appendChild(textBox); 
    }
    stopMoveInt() {
      clearInterval(this.#moveInt);
      this.#moveInt = null;
    }
    changeVelocity(x,y) { //change velocity and/or update the move interval
      this.#xVel += (x);
      this.#yVel += (y);
      if (this.#xVel != 0 || this.#yVel != 0) {
        if (this.#moveInt == null) { 
          this.#setMoveInt(); // run if the move int is not currently active
        }
      } else {
        clearInterval(this.#moveInt); // if velocity is 0, then stop the move interval
        this.#moveInt = null;
      }
    }
    setVelocity(x,y) { //set velocity and/or update the move interval
      this.#xVel = (x);
      this.#yVel = (y);
      if (this.#xVel != 0 || this.#yVel != 0) {
        if (this.#moveInt == null) { 
          this.#setMoveInt(); // run if the move int is not currently active
        }
      } else {
        clearInterval(this.#moveInt); // if velocity is 0, then stop the move interval
        this.#moveInt = null;
      }
    }
    #setMoveInt() { //start the move interval
      this.#moveInt = setInterval(()=> {
        // to run at tickspeed
        if (!this.isDead) {
          this.checkxPos((this.xPos + this.#xVel)); // test this new position
          this.#checkCollision('x'); // if no collision, position is updated
          this.checkyPos((this.yPos + this.#yVel)); // test this new position
          this.#checkCollision('y'); // if no collision, position is updated
        } else {
          clearInterval(this.#moveInt);
        }
        
      },this.#tickSpeed)
    }
    checkxPos(x) { //to test a new position without actually showing on screen
      this.#xPos = x;
    }
    checkyPos(y) { //to test a new position without actually showing on screen
      this.#yPos = y;
    }
    leftGo() { // left key is pressed
      if (this.#leftKey == false) {
        this.#leftKey = true;
        this.changeVelocity(-(this.speed),0);
   
      }
    }
    leftStop() { // left key is released
      this.#leftKey = false;
      this.changeVelocity(this.speed,0)
      if(this.#rightKey == false) {
        this.#xVel = 0
      }
    }
    rightGo() { // right key is pressed
      if (this.#rightKey == false) {
        this.#rightKey = true;
        this.changeVelocity((this.speed),0);
      }
    }
    rightStop() { //right key is released
      this.#rightKey = false;
      this.changeVelocity(-(this.speed),0)
      if(this.#leftKey == false) {
        this.#xVel = 0
      }
    }
    downGo() { //down key is pressed
      if (this.#downKey == false) {
        this.#downKey = true;
        this.changeVelocity(0,(this.speed));
      }
    }
    downStop() { // down key is released
      this.#downKey = false;
      this.changeVelocity(0,-(this.speed))
      this.#yVel = 0
    }
    upGo() { //up key is pressed
      if (this.#upKey == false) {
        this.#upKey = true;
        this.changeVelocity(0,-(this.speed));
      }
    }
    upStop() { // up key is released
      this.#upKey = false;
      this.changeVelocity(0,(this.speed))
      this.#yVel = 0
    }
    #checkCollision(axis) { //check for collision, can only check one axis at a time
      let yOverlap = false;
      let xOverlap = false;
      let obj;
      const objArray = this.game.gameObjs;
      let index = 0;
        while (!(yOverlap && xOverlap) && index < objArray.length) {
          yOverlap = false;
          xOverlap = false;
          obj = objArray[index];
              if (obj.id != this.id) {
                if (!(this.topHitBox > obj.bottomHitBox || this.bottomHitBox < obj.topHitBox)) {
                  yOverlap = true;  
                }
                if (!(this.leftHitBox > obj.rightHitBox || this.rightHitBox < obj.leftHitBox)) {
                  xOverlap = true; 
                }
              }
          index += 1;
        }
      if (xOverlap && yOverlap && (!obj.isSpawnMode)) {
        if (!this.isSpawnMode) {
          this.#handleCollision(axis,obj);
        } else {
          this.xPos = this.xPos; // update real position with new position
          this.yPos = this.yPos;
        }
      } else {
        this.isSpawnMode = false;
        this.xPos = this.xPos; // update real position with new position
        this.yPos = this.yPos;
      }
    }
    #handleCollision(axis,obj) {
      // console.log('! collision !')
      if (!obj.isSpawnMode) {
        switch (this.colType) {
          case 'block':
            this.#colBlock(axis);
            break;
          case 'stop':
            this.#colStop();
            break;
          case "bounce":
            this.#colBounce(axis,obj);
            break;
          case 'ghost':
            this.#colGhost();
            break;
          case "explode":
            this.#colExplode(axis);
            break;
          case 'normalMode':
            this.#colNormalMode(axis,obj);
            break;
        }
        if (obj.objType == 'dynamic') {obj.changeVelocity(0,0);} //start move int if not moving}
      }
    }
    #colGhost() {
      this.xPos = this.xPos; // update real position with new position
      this.yPos = this.yPos;  
    }
    #colBounce(axis, obj) {
      playAudio('pop',this.game.volume);
      if (axis == 'x') {
        this.checkxPos((this.xPos - this.#xVel)); // return values to before collision
      } else {
        this.checkyPos((this.yPos - this.#yVel));  // return values to before collision
      }  
      if (obj.weight < 1000) {
        if (axis == 'x') {
          let m1 = this.weight;
          let m2 = obj.weight
          let u1 = this.xVel;
          let u2 = obj.xVel;
          this.#xVel = (((m1-m2)*u1) + (2*m2*u2)) / (m1+m2)
          obj.xVel = (((m2-m1)*u2) + (2*m1*u1)) / (m1+m2)
        } else {
          let m1 = this.weight;
          let m2 = obj.weight
          let u1 = this.yVel;
          let u2 = obj.yVel;
          this.#yVel = (((m1-m2)*u1) + (2*m2*u2)) / (m1+m2)
          obj.yVel = (((m2-m1)*u2) + (2*m1*u1)) / (m1+m2)
        }
      } else {
        if (axis == 'x') {
          this.#xVel = -(this.#xVel);
        } else {
          this.#yVel = -(this.#yVel);
        }    
      }
    }
    #colBlock(axis) {
      if (axis == 'x') {
        this.checkxPos((this.xPos - this.#xVel)); // return values to before collision
      } else {
        this.checkyPos((this.yPos - this.#yVel));  // return values to before collision
      }  
    }
    #colStop() {
      if (axis == 'x') {
        this.checkxPos((this.xPos - this.#xVel)); // return values to before collision
      } else {
        this.checkyPos((this.yPos - this.#yVel));  // return values to before collision
      }  
      this.changeVelocity(-(this.#xVel),-(this.#yVel));  
    }
    #colExplode(axis) {
      if (axis == 'x') {
        this.checkxPos((this.xPos - this.#xVel)); // return values to before collision
      } else {
        this.checkyPos((this.yPos - this.#yVel));  // return values to before collision
      }  
    }
    #colNormalMode(axis,obj) {
  
      if ((this.isPlayer && obj.objType != 'barrier') || obj.isPlayer) {
        let answer;
        if (this.isPlayer) {
          answer = obj.textValue;
          obj.isSpawnMode = true;
          obj.xPos = this.game.width + 10;
          obj.yPos = this.game.height / 2;
          const xVal = rndBetween(-(obj.speed),-1);
          const yVal = rndBetween(-(obj.speed),obj.speed)
          console.log(xVal + " " + yVal);
          obj.setVelocity(xVal,yVal )
        } else {
          answer = this.textValue;
          this.isSpawnMode = true;
          this.xPos = this.game.width + 10;
          this.yPos = this.game.height / 2;
          const xVal = rndBetween(-(this.speed),-1);
          const yVal = rndBetween(-(this.speed),this.speed)
          console.log(xVal + " " + yVal);
          this.setVelocity(xVal, yVal);
        }
        if (answer == this.game.wordList[this.game.round].answer) {
          playAudio('coin',this.game.volume);
          this.game.score +=1;
          this.game.round +=1;
          this.game.normal_newRound();
        } else {
          playAudio('wrong',this.game.volume);
          this.game.health -= 1;
          this.game.loopTriggers[2] = true; //trigger hurt animation;
          if (this.game.health == 0) {
            this.game.deleteAllObjs();
            document.getElementById('currentWord').innerHTML = '';
            gameOver();
          } 
        }
      } else {
        this.#colBounce(axis,obj);
      }
    }
}


export class gameBarrier {
  //properties
  #barrier_id; #width; #height; #xPos; #yPos; #edge; #objType; #weight; #colType; #game; #isSpawnMode;
  // init
  constructor(barrier_id, xPos, yPos, width, height, game) {
    this.#width = width;
    this.#height = height;
    this.#weight = 1000;
    this.#xPos = xPos;
    this.#yPos = yPos;
    this.#edge = 5;
    this.#game = game
    this.#barrier_id = barrier_id;
    this.#objType = 'barrier';
    this.#colType = 'bounce';
    this.#isSpawnMode = false;
  }
  // getters and setters
  get id() {
    return this.#barrier_id;
  }
  get objType() {
    return this.#objType;
  }
  get topHitBox() {
    return this.#yPos + this.#edge;
  }
  get bottomHitBox() {
    return this.#yPos + this.#height - this.#edge;
  }
  get leftHitBox() {
    return this.#xPos + this.#edge;
  }
  get rightHitBox() {
    return this.#xPos + this.#width - this.#edge;
  }
  get xPos() {
    return this.#xPos;
  }
  set xPos(x) {
    this.#xPos = x;
  }
  get yPos() {
    return this.#yPos;
  }
  set yPos(y) {
    this.#yPos = y;
  }
  get width() {
    return this.#width;
  }
  set width(w) {
    this.#width = w;
  }
  get height() {
    return this.#height;
  }
  set height(h) {
    this.#height = w;
  }
  get weight() {
    return this.#weight;
  }
  get colType() {
    return this.#colType;
  }
  set colType(type) {
    this.#colType = type;
  }
  get game() {
    return this.#game;
  }
  // methods
  
}



