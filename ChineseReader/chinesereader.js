const dictMap = new Map();
let dictString = "";


async function loadDictionary() {
    console.log('loadDictionary')
        try {
          const response = await fetch('./chineseList.json');
          if (response.ok) {
            console.log('loaded successfully')
            dictString = await response.text();
            buildDict();
          } else {
            console.log('!!!failed to load');
          }
        }
          catch(error){
          console.log(error)   //doesnt do anything
        }  
}

function buildDict() {
    const dictArray = JSON.parse(dictString);
    for (let i = 0; i < dictArray.length; i++) {
        dictMap.set(dictArray[i][0],dictArray[i][1]);   
    }
}

function clearOutput() {
    const output = document.getElementById('output');
    while (output.lastElementChild) {
        output.removeChild(output.lastElementChild);
    }
}


function convert() {
    let rawText = document.getElementById("rawtext_input").value
    const output = document.getElementById("output")

    clearOutput();

    while (rawText.length > 0) {
        const unicode = String(rawText.charCodeAt(0));
        const charArray = dictMap.get(unicode);
        let match = false
 
        if (charArray) {
            console.log(charArray)
            console.log(charArray.length)
            let i = 0
            while (match == false && i < charArray.length) {
                const word = charArray[i][0]
                console.log(word)
                const len = word.length;
                console.log(len)
                let wordUni = "";
                let rawUni = "";
                for (let u = 0;u<len;u++) {
                    wordUni += String(word.charCodeAt(u));
                }
                for (let u = 0;u<len && u<rawText.length;u++) {
                    rawUni += String(rawText.charCodeAt(u));
                }
                console.log(wordUni)
                console.log(rawUni)
                if (wordUni == rawUni) {
                    match = true
                    output.appendChild(buildWordBlock(charArray[i]))
                    rawText = rawText.slice(len,rawText.length)
                } 
                i = i + 1
            }
            if (match == false) {
                output.appendChild(buildEmptyWordBlock(rawText.charAt(0)))
                rawText = rawText.slice(1,rawText.length)
            }    
        } else {
            output.appendChild(buildEmptyWordBlock(rawText.charAt(0)))
            rawText = rawText.slice(1,rawText.length)    
        }
    }
}

function buildWordBlock(wordArray) {
    console.log(wordArray)
    const block = document.createElement('div');
    const textNode = document.createTextNode(wordArray[0])
    block.appendChild(textNode);

    const info = document.createElement('div');
    for (let i = 1; i<3;i++) {
        const text = document.createElement('div');
        const node = document.createTextNode(wordArray[i]);
        text.appendChild(node);
        info.appendChild(text);
    }
    info.style.display = "none";
    info.className = 'info';
    block.appendChild(info);
    block.setAttribute("onmouseover","displayInfo(this)");
    block.setAttribute("onmouseleave","hideInfo(this)");
    block.className = "block";
    return block;
}

function buildEmptyWordBlock(text) {
    const block = document.createElement('div');
    const textNode = document.createTextNode(text)
    block.appendChild(textNode);    
    return block;
}



function displayInfo(block) {
    block.firstElementChild.style.display = null
    block.style.color = "white"   
    block.style.backgroundColor = "grey" 
}

function hideInfo(block) {
    block.firstElementChild.style.display = 'none'  
    block.style.color = null
    block.style.backgroundColor = null   
}