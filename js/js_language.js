
//Set up event listeners
// document.getElementById('index_lang_btn').addEventListener("click", function(){ toggleLang('index'); });  


//check local storage for current language setting
let currentLang = 0  // chinese = 1  english = 0
if (localStorage.getItem("language")) {
    currentLang = localStorage.getItem('language');
} else {
    currentLang = 0;
}


//Build language Arrays
const indexArray =[];
buildIndexArray();
console.log(indexArray.length);


//run when page is refreshed
updatePage('index');


// Core functions
function toggleLang(page) {
    if (currentLang == 0) {
        currentLang = 1;
        localStorage.setItem('language', 1);
    } else {
        currentLang = 0;
        localStorage.setItem('language', 0);
    };
    updatePage(page);
}

function updatePage(page) {
    switch(page) {
        case 'index':
            updateLang_index();
            break;
        case 'professional':

            break; 
        case 'family':

            break;
    }
}

function updateLang_index() {
    let idString = '';
    let idNum = 0;
    for (let id = 0; id < indexArray.length; id+= 2) {
        idString = "lang" + id
        idNum = Number(id) + Number(currentLang);
        if (document.getElementById(idString)){
        document.getElementById(idString).innerHTML = indexArray[idNum];
        }
    }
}


// Language Arrays for different pages
function buildIndexArray() {
    indexArray[0] = "Home";
    indexArray[1] = '歸宿';
    indexArray[2] = "Search";
    indexArray[3] = '搜索';
    indexArray[4] = "Resume";
    indexArray[5] = '簡歷';
    indexArray[6] = "Contact";
    indexArray[7] = '聯係';
    indexArray[8] = "Games";
    indexArray[9] = '游戲';
    indexArray[10] = 'Noodles';
    indexArray[11] = '麵';
    indexArray[12] = 'Welcome to ';
    indexArray[13] = '大家歡迎';
    indexArray[14] = "josephheaton.com ";
    indexArray[15] = 'josephheaton.com';
    indexArray[16] = 'Photo Gallery';
    indexArray[17] = '照片';
    indexArray[18] = 'Professional';
    indexArray[19] = '專業';
    indexArray[20] = 'Projects';
    indexArray[21] = '???';
    indexArray[22] = '中文';
    indexArray[23] = 'English';
    indexArray[24] = '語言:';
    indexArray[25] = 'Language:';
    indexArray[26] = '中文';
    indexArray[27] = 'English';
    indexArray[28] = 'where I test out my web development projects.';
    indexArray[29] = '？？？';
    indexArray[30] = '？？？';
    indexArray[31] = '？？？';
}

