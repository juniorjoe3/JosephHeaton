// audio --------------------
export function playAudio(audio,volume) {
  volume = volume / 100;
  switch (audio) {
    case "bounce":
      let audio_bounce = new Audio('./bounce.mp3');
      audio_bounce.volume = volume;
      audio_bounce.play();
      break;
    case 'explode':
      let audio_explode = new Audio('./explode.mp3');
      audio_explode.volume = volume;
      audio_explode.play();
      break;
    case 'pop':
      let audio_pop = new Audio('./pop.mp3');
      audio_pop.volume = volume * (.5);
      audio_pop.play();
      break;
    case 'click':
      let click = new Audio('./click.mp3');
      click.volume = volume;
      click.play();
      break;
    case 'ohno':
      let ohno = new Audio('./ohno.mp3');
      ohno.volume = volume;
      ohno.play();
      break;
  }
}


export class Game {
  //properties
  #width; #height; #yCam; #xCam; #wCam; #hCam; #cam_ele; #volume; #mainInt; #tickSpeed; #ticker;
  #loopTriggers = [];// main loop triggers
  #loopDelays = [];
  #loopCounters = [];
  #gameObjs = []; //all objs in the game 
  #gameBarriers = []; // only barriers
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
  setMainInt() {
    console.log(this);
    this.#mainInt = setInterval(()=>{this.mainLoop();},this.#tickSpeed);
  }
  stopMainInt() {
    clearInterval(this.#mainInt);
  }
  mainLoop() {
    this.#ticker +=1;  
    // console.log(this.#ticker);
    // block
    if (this.#loopTriggers[0] == true && this.#ticker > (this.#loopDelays[0] + this.seconds(1))) { // <-- delay
      this.startNormalMode(); //code to be run
      this.#loopDelays[0] = this.#ticker
      this.#loopCounters[0] += 1;
      console.log(this.#loopCounters[0]);
      if(this.#loopCounters[0] >= (10) ) { // <--- number of times to run
        this.#loopTriggers[0] = false;
        this.#loopCounters[0] = 0;
      }
    }
    // block
    if (this.#loopTriggers[1] == true && this.#ticker > (this.#loopDelays[1] + this.seconds(5))) { // <-- delay
      this.flyInNewObjRight(); //code to be run
      this.#loopDelays[1] = this.#ticker
      this.#loopCounters[1] += 1;
      console.log(this.#loopCounters[1]);
      if(this.#loopCounters[1] >= (2) ) { // <--- number of times to run
        this.#loopTriggers[1] = false;
      }
    }
  }
  seconds(seconds) {
    return (seconds * 1000) / this.#tickSpeed;
  }
  createGameObj(html_id, imgPath, xPos, yPos, width, height, speed, weight, isPlayer) {
    const newObj = new gameObj(this.#cam_ele.id, html_id,imgPath, xPos, yPos, width, height, speed,weight, this, isPlayer);
    this.#gameObjs.push(newObj);
    return newObj;
  }
  createHardBoundry() {
    this.createGameBarrier(0,-100,this.gameWidth,100); //top
    this.createGameBarrier(0,this.gameHeight,this.gameWidth,100); //bottom
    this.createGameBarrier(-100,0,100,this.gameHeight); //left
    this.createGameBarrier(this.gameWidth,0,100,this.gameHeight); //right
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
    this.gameObjs.forEach( (obj) => {
      if (obj.objType == 'dynamic') {
        obj.deleteHTML();
      }
    })
    this.gameObjs.length = 0;
    this.gameBarriers.length = 0;
  }
  startNormalMode() {
    let name = 'bot ' + this.#gameObjs.length;
    const obj = this.createGameObj(name,'/images/red_barrier.png', 1000, 200,40,40,5,500,false)
    obj.colType = 'bounce';
    obj.changeVelocity(3-(Math.random()*7), 3-(Math.random()*7));
    // this.flyInNewObjRight(name,'/images/red_barrier.png',40,40,5,500,false)   
  }

  flyInNewObjRight(html_id, imgPath, width, height, speed, weight, isPlayer) {
    // const xPos = (this.gameWidth + 10) 
    // const yPos = (this.gameHeight / 2) - (height/2);
    // let obj = this.createGameObj(html_id, imgPath, xPos, yPos, width, height, speed, weight, isPlayer);
    // obj.colType = 'ghost';
    // obj.changeVelocity(-5, 0)
    // obj.colType = 'bounce';
    // obj.changeVelocity(2-(Math.random()*5), 3-(Math.random()*7));
  }
  // getters and setters
  get gameHeight() {
    return this.#height;
  }
  get gameWidth() {
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
  get gameObjs() {
    return this.#gameObjs;
  }
  set gameObjs(array) {
    this.#gameObjs = array;
  }
  get gameBarriers() {
    return this.#gameBarriers;
  }
  set gameBarriers(array) {
    this.#gameBarriers = array;
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
}


export class gameObj {
    //properties
    #html_id; #width; #height; #html_ele; #speed; #xPos; #yPos; #xVel = 0; #yVel = 0; 
    #moveInt = null; #leftKey = false; #rightKey = false; #upKey = false; #downKey = false; 
    #game; #edge; #tickSpeed; #objType; #colType; #weight; #isPlayer; #isSpawnMode;
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
          this.left = (x - this.#game.xCam);
        }
        get yPos() {
          return this.#yPos;
        }
        set yPos(y) {
          this.#yPos = y;
          this.top = (y - this.#game.yCam);
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
    // methods
    deleteHTML() {
      this.#game.cam_ele.removeChild(this.ele);
    }
    addTextBox(text) {
      const textBox = document.createElement('div');
      const textNode = document.createTextNode(text);
      textBox.appendChild(textNode);
      textBox.style.backgroundColor = "yellow";
      textBox.style.padding = "5px";
      textBox.style.fontSize = "1.3rem";
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
    #setMoveInt() { //start the move interval
      this.#moveInt = setInterval(()=> {
        // to run at tickspeed
        this.checkxPos((this.xPos + this.#xVel)); // test this new position
        this.#checkCollision('x'); // if no collision, position is updated
        this.checkyPos((this.yPos + this.#yVel)); // test this new position
        this.#checkCollision('y'); // if no collision, position is updated
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
      const objArray = this.#game.gameObjs;
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
      if (xOverlap && yOverlap) {
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
        }
        if (obj.objType == 'dynamic') {obj.changeVelocity(0,0);} //start move int if not moving}
      }
      
    }
    #colGhost() {
      this.xPos = this.xPos; // update real position with new position
      this.yPos = this.yPos;  
    }
    #colBounce(axis, obj) {
      playAudio('pop',this.#game.volume);
      if (axis == 'x') {
        this.checkxPos((this.xPos - this.#xVel)); // return values to before collision
      } else {
        this.checkyPos((this.yPos - this.#yVel));  // return values to before collision
      }  
      if (obj.weight < 1000) {
        if (axis == 'x') {
          // (this.leftHitBox >= obj.rightHitBox || this.rightHitBox <= obj.leftHitBox)
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
}


export class gameBarrier {
  //properties
  #barrier_id; #width; #height; #xPos; #yPos; #edge; #objType; #weight; #colType; #game; 
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
  // methods
  
}



