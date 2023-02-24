export class Grid {
  //properties
  #width; #height; #yCam; #xCam; #wCam; #hCam; #cam_ele;
  #gridObjs = []; //all objs in the grid 
  #gridBarriers = []; // only barriers
  // init
  constructor(width, height, yCam, xCam, wCam, hCam, cam_container_id) {
    this.#height = height;
    this.#width = width;
    this.#yCam = yCam;
    this.#xCam = xCam;
    this.#wCam = wCam;
    this.#hCam = hCam;
    this.#cam_ele = document.getElementById(cam_container_id);
    this.#cam_ele.style.width = this.#wCam + 'px';
    this.#cam_ele.style.height = this.#hCam + 'px';
  // methods
  }
  createGridObj(html_id, imgPath, xPos, yPos, width, height, speed, weight) {
    const newObj = new gridObj(this.#cam_ele.id, html_id,imgPath, xPos, yPos, width, height, speed,weight, this);
    this.#gridObjs.push(newObj);
    return newObj;
  }
  createHardBoundry() {
    this.createGridBarrier(0,-100,this.gridWidth,100); //top
    this.createGridBarrier(0,this.gridHeight,this.gridWidth,100); //bottom
    this.createGridBarrier(-100,0,100,this.gridHeight); //left
    this.createGridBarrier(this.gridWidth,0,100,this.gridHeight); //right
  }
  createGridBarrier(xPos,yPos,width,height) {
    const id = "barrier_" + this.gridBarriers.length;
    const newBarrier = new gridBarrier(id,xPos,yPos,width,height);
    this.gridBarriers.push(newBarrier);
    this.gridObjs.push(newBarrier);
    return newBarrier;
  }
  // getters and setters
  get gridHeight() {
    return this.#height;
  }
  get gridWidth() {
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
  get gridObjs() {
    return this.#gridObjs;
  }
  get gridBarriers() {
    return this.#gridBarriers;
  }
}





export class gridObj {
    //properties
    #html_id; #width; #height; #html_ele; #speed; #xPos; #yPos; #xVel = 0; #yVel = 0; 
    #moveInt = null; #leftKey = false; #rightKey = false; #upKey = false; #downKey = false; 
    #grid; #edge; #tickSpeed; #objType; #colType; #weight;
    // init
    constructor(parent_id, html_id, imgPath, xPos, yPos, width, height, speed, weight, grid) {
      this.#grid = grid 
      this.#html_id = html_id;
      this.#width = width;
      this.#tickSpeed = 15;
      this.#height = height;
      this.#speed = speed;
      this.#weight = weight;
      this.#xPos = xPos;
      this.#yPos = yPos;
      this.#edge = 5;
      this.#colType = 'block'
      this.#objType = 'dynamic'
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
      ele.style.top = (yPos + grid.yCam) + 'px';
      ele.style.left = (xPos + grid.xCam) + 'px';
      parent.appendChild(ele);
      this.#html_ele = ele;
    }
    // getters and setters
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
          this.left = (x - this.#grid.xCam);
        }
        get yPos() {
          return this.#yPos;
        }
        set yPos(y) {
          this.#yPos = y;
          this.top = (y - this.#grid.yCam);
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
    // methods
    addTextBox(text) {
      const textBox = document.createElement('div');
      const textNode = document.createTextNode(text);
      textBox.appendChild(textNode);
      textBox.style.backgroundColor = "yellow";
      textBox.style.padding = "5px";
      textBox.style.fontSize = "1.3rem";
      this.ele.appendChild(textBox); 
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
      const objArray = this.#grid.gridObjs;
      let index = 0;
        while (!(yOverlap && xOverlap) && index < objArray.length) {
          yOverlap = false;
          xOverlap = false;
          obj = objArray[index];
              if (obj.id != this.id) {
                if (!(this.topHitBox >= obj.bottomHitBox || this.bottomHitBox <= obj.topHitBox)) {
                  yOverlap = true;  
                }
                if (!(this.leftHitBox >= obj.rightHitBox || this.rightHitBox <= obj.leftHitBox)) {
                  xOverlap = true; 
                }
              }
          index += 1;
        }
      if (xOverlap && yOverlap) {
        this.#handleCollision(axis,obj);
      } else {
        this.xPos = this.xPos; // update real position with new position
        this.yPos = this.yPos;
      }
    }
    #handleCollision(axis,obj) {
      console.log('collision')
      if (axis == 'x') {
        this.checkxPos((this.xPos - this.#xVel)); // return values to before collision
      } else {
        this.checkyPos((this.yPos - this.#yVel));  // return values to before collision
      }
      switch (this.#colType) {
        case 'block':
            // do nothing
          break;
        case 'stop':
          this.changeVelocity(-(this.#xVel),-(this.#yVel));
          break;
        case "bounce":
          this.#colBounce(axis,obj);
          break;
      }
      if (obj.objType == 'dynamic') {obj.changeVelocity(0,0);} //start move int if not moving}
    }
    #colBounce(axis, obj) {
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
}




export class gridBarrier {
  //properties
  #barrier_id; #width; #height; #xPos; #yPos; #edge; #objType; #weight;
  // init
  constructor(barrier_id, xPos, yPos, width, height) {
    this.#width = width;
    this.#height = height;
    this.#weight = 1000;
    this.#xPos = xPos;
    this.#yPos = yPos;
    this.#edge = 5;
    this.#barrier_id = barrier_id;
    this.#objType = 'barrier'
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
  // methods
  
}
