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
  createGridObj(html_id, imgPath, xPos, yPos, width, height, speed) {
    const newObj = new gridObj(this.#cam_ele.id, html_id,imgPath, xPos, yPos, width, height, speed, this);
    this.#gridObjs.push(newObj);
    return newObj;
  }
  createHardBoundry() {
    this.createGridBarrier(0,-10,this.gridWidth,10); //top
    this.createGridBarrier(0,this.gridHeight,this.gridWidth,10); //bottom
    this.createGridBarrier(-10,0,10,this.gridHeight); //left
    this.createGridBarrier(this.gridWidth,0,10,this.gridHeight); //right
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
    #html_id; #width; #height; #html_ele; #speed; #xPos; #yPos; #xVel; #yVel;
    #leftInt; #rightInt; #upInt; #downInt; #grid; #edge; #tickSpeed; #objType;
    // init
    constructor(parent_id, html_id, imgPath, xPos, yPos, width, height, speed, grid) {
      this.#grid = grid //circular ref :(
      this.#html_id = html_id;
      this.#width = width;
      this.#tickSpeed = 10;
      this.#height = height;
      this.#speed = speed;
      this.#xPos = xPos;
      this.#yPos = yPos;
      this.#leftInt = null;
      this.#rightInt = null;
      this.#upInt = null;
      this.#downInt = null;
      this.#edge = 10;
      this.#objType = 'dynamic'
      const parent = document.getElementById(parent_id);
      const ele = document.createElement('div');
      ele.id = html_id;
      ele.style.backgroundImage = "url('" + imgPath + "')";
      ele.style.height = this.#height + 'px';
      ele.style.width = this.#width + 'px';
      ele.className = 'dynamic'
      ele.style.top = (yPos + grid.yCam) + 'px';
      console.log(ele.style.top);
      ele.style.left = (xPos + grid.xCam) + 'px';
      parent.appendChild(ele);
      this.#html_ele = ele;
    }
    // getters and setters
    get id() {
      return this.#html_id;
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
    get styleClass() {
      return this.#html_ele.className;
    }
    set styleClass(c) {
      this.#html_ele.className = c;
    }
    // methods
    changeVelocity(x,y) {
      this.#xVel += (x);
      this.#yVel += (y);
      if (x != 0 || y != 0) {

      } else {
        
      }
    }
    checkxPos(x) {
      this.#xPos = x;
    }
    checkyPos(y) {
      this.#yPos = y;
    }
    leftGo() {
      if (this.#leftInt == null) {
        this.rightStop();
        this.ele.style.backgroundImage = "url('/images/garbage_open.png')"
        this.#leftInt = setInterval(()=>{this.checkxPos((this.xPos - this.speed)); this.#checkCollision('left');},this.#tickSpeed)
      }
    }
    leftStop() {
      clearInterval(this.#leftInt);
      this.#leftInt = null;
      this.ele.style.backgroundImage = "url('/images/garbage_closed.png')"
    }
    rightGo() {
      if (this.#rightInt == null) {
        this.leftStop();
        this.ele.style.backgroundImage = "url('/images/garbage_open.png')"
        this.#rightInt = setInterval(()=>{this.checkxPos((this.xPos + this.speed)); this.#checkCollision('right');},this.#tickSpeed)
      }
    }
    rightStop() {
      clearInterval(this.#rightInt);
      this.#rightInt = null;
      this.ele.style.backgroundImage = "url('/images/garbage_closed.png')"
    }
    upGo() {
      if (this.#upInt == null) {
        this.downStop();
        this.ele.style.backgroundImage = "url('/images/garbage_open.png')"
        this.#upInt = setInterval(()=>{this.checkyPos((this.yPos - this.speed)); this.#checkCollision('up');},this.#tickSpeed)
      }
    }
    upStop() {
      clearInterval(this.#upInt);
      this.#upInt = null;
      this.ele.style.backgroundImage = "url('/images/garbage_closed.png')"
    }
    downGo() {
      if (this.#downInt == null) {
        this.upStop();
        this.ele.style.backgroundImage = "url('/images/garbage_open.png')"
        this.#downInt = setInterval(()=>{this.checkyPos((this.yPos + this.speed)); this.#checkCollision('down');},this.#tickSpeed)
      }
    }
    downStop() {
      clearInterval(this.#downInt);
      this.#downInt = null;
      this.ele.style.backgroundImage = "url('/images/garbage_closed.png')"
    }
    #checkCollision(direction) {
      let yCollision = false;
      let xCollision = false;
      const objArray = this.#grid.gridObjs;
      let index = 0;
        while (!(yCollision && xCollision) && index < objArray.length) {
          yCollision = false;
          xCollision = false;
          const obj = objArray[index];
          if (obj.id != this.id) {
            if (!(this.topHitBox >= obj.bottomHitBox || this.bottomHitBox <= obj.topHitBox)) {
              yCollision = true;  
            }
            if (!(this.leftHitBox >= obj.rightHitBox || this.rightHitBox <= obj.leftHitBox)) {
              xCollision = true; 
            }
          }
          index += 1;
        }
        index -= 1; //return to last obj
      if (xCollision && yCollision) {
        switch (direction) {
          case 'up':
            // this.upStop();
            this.checkyPos(this.yPos + this.speed)
            break;
          case 'down':
            // this.downStop();
            this.checkyPos(this.yPos - this.speed)
            break;
          case 'right':
            // this.rightStop();
            this.checkxPos(this.xPos - this.speed)
            break;
          case 'left':
            // this.leftStop();
            this.checkxPos(this.xPos + this.speed)
            break;
        }
      } else {
        switch (direction) {
          case 'up':
            this.yPos = this.yPos
            break;
          case 'down':
            this.yPos = this.yPos 
            break;
          case 'right':
            this.xPos = this.xPos
            break;
          case 'left':
            this.xPos = this.xPos
            break;
        }
      }
      
    }
}




export class gridBarrier {
  //properties
  #barrier_id; #width; #height; #xPos; #yPos; #edge; #objType
  // init
  constructor(barrier_id, xPos, yPos, width, height) {
    this.#width = width;
    this.#height = height;
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
  // methods
  
}
