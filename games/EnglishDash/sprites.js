console.log('load sprite')



// variable information

const spriteList = [
  "bird"
]

function getSpriteObj(spriteName) {
    const sprite = new Sprite();
    switch(spriteName) {
      case "bird":
        sprite.frameWidth = 690; sprite.frameHeight = 690; 
        sprite.sheetWidth = 2988; sprite.sheetHeight = 1536;
        sprite.xBetween = 0.2; sprite.yBetween = 15.5; //.2  15.5
        sprite.xZero = 9; sprite.yZero = 5;
        sprite.rows = 2; sprite.columns = 4;
        sprite.framesPerAni = [8]; sprite.numOfAnimations = 1;
        break;
    }
    return sprite;
  }


export function getSprites() {
  const obj = new Sprites(spriteList);
  return obj;
}


 
  // templates ------------------------------------------------------------
  class Sprites {
    get(name) {
      const sprite = getSpriteObj(name);
      return sprite;
    }
  }

  class Sprite {
    ticker = 0; frameArray = []; imgHeight = 0; imgWidth = 0; currentAni = 0;
    calcFrameArray() {
      let framesPerAni = this.framesPerAni;
      const aniArray = [];
      for (let aniIndex = 1; aniIndex <= this.numOfAnimations; aniIndex++) {
        const frameArr = [];
        let x = this.xZero;
        let y = this.yZero;
        let columnNum = 1;
        for (let frameIndex = 1; frameIndex <= framesPerAni; frameIndex++ ) {
          let xyArr = [];
          if (columnNum > this.columns ) {
            x = this.xZero;
            y = this.divHeight + this.yBetween;
            columnNum = 1;
          }
          xyArr[0] = x;
          xyArr[1] = y
          frameArr[frameIndex-1] = xyArr;
          x += this.xBetween + this.divWidth;
          columnNum += 1;
        }
        aniArray[aniIndex-1] = frameArr;
      }
        this.frameArray = aniArray;  
    }
    calcImgWidth(divWidth) {
      this.imgWidth = divWidth * (this.sheetWidth / this.frameWidth);
    }
    calcImgHeight(divHeight) {
      this.imgHeight = divHeight * (this.sheetHeight / this.frameHeight);
    }
  }
