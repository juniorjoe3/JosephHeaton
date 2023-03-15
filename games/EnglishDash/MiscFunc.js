console.log('load miscfunc')


export const func = {};

func.ticksInSeconds = function(seconds, tickSpeed) {
  return (seconds * 1000) / tickSpeed;
}

func.randomizeArray = function(array) {
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

func.filterOut = function(array,value) {
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

func.rndBetween = function(from,to) {
    return Math.random()*(to-from) + from;
  }

func.fetchFileToSessionStorage =  async function(filePath,sessionStorageName) {
    try {
      const response = await fetch(filePath);
      if (response.ok) {
        console.log('loaded successfully')
        const data = await response.text();
        sessionStorage.setItem(sessionStorageName, data);
      } else {
        console.log('!!!failed to load');
      }
    }
      catch(error){
      console.log(error)   //doesnt do anything
    }
  }


