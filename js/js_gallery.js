
// get gallery string from file
async function getGalleryStringFile() {
    try {
      const response = await fetch('../data/gallery.csv');
      if (response.ok) {
        const data = await response.text();
        const galleryArray = parseCSV(data);
        const tagSet = buildTagSet(galleryArray);
        printToPage(galleryArray);
        printCheckboxes(tagSet);
        sessionStorage.setItem('galleryArray',data);
        console.log('!!!gallery string loaded!!!');
      } else {
        console.log('!!!gellery text failed to load!!!');
      }
    }
      catch(error){
      console.log(error)   //doesnt do anything
    }
  }

// builds tag set
function buildTagSet(galleryArray) {
  const set = new Set();
  const numOfColumns = galleryArray[0].length;
  //iterate through rows
  for (let i = 1; i < galleryArray.length; i++) {
    //iterate through tags
    for (let x = 0; x < galleryArray[i][(numOfColumns - 1)].length; x++) {
      set.add(galleryArray[i][(numOfColumns - 1)][x]);
    }
  }
  return set;
}

// print tag checkboxes to HTML
function printCheckboxes(tagSet) {
  tagSet.forEach (function(tagName) {
    const label = document.createElement('label')
    const div = document.createElement('div')
    const input = document.createElement('input')
    const textNode = document.createTextNode(tagName);
    label.appendChild(textNode);
    const tag_cont = document.getElementById("tag_container");
    tag_cont.appendChild(div)
    const tag_div = tag_cont.lastElementChild;
    tag_div.appendChild(label);
    tag_div.lastElementChild.setAttribute('for', tagName);
    tag_div.appendChild(input);
    tag_div.lastElementChild.type = 'checkbox'
    tag_div.lastElementChild.id = tagName;
    tag_div.lastElementChild.name = 'tags';
    tag_div.lastElementChild.setAttribute('onclick', 'updateTags()');
    tag_div.lastElementChild.checked = true;
  })
}


// parses through a CSV string and returns an array of the rows, 
// the first row contains the column headers, 
// a cell can contain an array
function parseCSV(string) {
    const fullArray = [];
    const arrayOfRows = string.split("*row=>")
    const columnNames = stringToArrayNoSpaces(arrayOfRows[0]);
    fullArray[0] = columnNames;
    //rows
    for (let i = 1; i < arrayOfRows.length; i++) {
      const cutListOutArray = arrayOfRows[i].split('*list=>')
      const rowArray = stringToArrayNoSpaces(cutListOutArray[0]);
      //lists
      for (let i = 1; i < cutListOutArray.length; i++) {
        const listArray = stringToArrayNoSpaces(cutListOutArray[i]);
        rowArray.push(listArray);
      }
      // set to array
      fullArray[i] = rowArray;
    }
    return fullArray;
}

  //returns an array from a CSV string and removes the spaces around the commas
  function stringToArrayNoSpaces(string) {
    const array = string.split(",")
    for (let i = 0; i < array.length; i++) {
      array[i] = String(array[i]).trim()
      // console.log(array[i]);
    }
    return array;
}



// below code runs on load and when the tags are changed
function updateTags() {
  console.log('updateTags run');
  const galleryArray = parseCSV(sessionStorage.galleryArray);
  const filteredArray = filterArray(galleryArray);
  // const tagSet = buildTagSet(galleryArray);
  clearImages();
  printToPage(filteredArray);
}

function filterArray(galleryArray) {
  const filteredArray = ['headers'];
  // first check which tags are checked and put the checked tags into an array called tagsFiltered
  checkboxes = document.getElementsByName("tags");
  const tagsFiltered = [];
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      tagsFiltered.push(checkboxes[i].id)
    }
  }
  console.log(tagsFiltered);
  // now iterate through gallery array and if they have the checked tags, add them to the new filteredArray
  const numOfColumns = galleryArray[0].length;
  //iterate through rows
  for (let i = 1; i < galleryArray.length; i++) {
    //iterate through tags
    let value = false;
    let GAindex = 0;
    while (value == false && GAindex < galleryArray[i][(numOfColumns - 1)].length) {
      // iterate through tagsFiltered
      let TFindex = 0;
      while (value == false && TFindex < tagsFiltered.length) {
        console.log(galleryArray[i][(numOfColumns - 1)][GAindex])
        console.log(tagsFiltered[TFindex])
        if (galleryArray[i][(numOfColumns - 1)][GAindex] == tagsFiltered[TFindex]) {
          value = true;
          console.log('match')
          filteredArray.push(galleryArray[i]);
        } else { console.log('no match')}
        TFindex += 1;
      } 
    GAindex += 1;
    }
  }
  return filteredArray;
}


function clearImages() {
  const gal_div = document.getElementById("gallery_container");
  while (gal_div.hasChildNodes()) {
    gal_div.removeChild(gal_div.lastChild)
  }
}


function printToPage(array) {
  for (let i = 1; i < array.length; i++) {
    const img = document.createElement("img");
    const gal_div = document.getElementById("gallery_container");
    gal_div.appendChild(img)
    const imgTag = gal_div.lastElementChild
    imgTag.id = array[i][1];
    imgTag.className = "gal_images"
    imgTag.setAttribute('onmouseover','imgFocus(this)');
    imgTag.src = String("../gallery_images/" + array[i][2]);
  }
}

function toggleCheckboxes() {
  checkboxes = document.getElementsByName("tags");
  button = document.getElementById('toggleCheckboxes_btn')
  let value = false;
  if (!checkboxes[0].checked) {
    value = true
    button.innerHTML = 'Uncheck All'
  } else {
    button.innerHTML = 'Check All'
  }
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = value;
  }  
  updateTags();
}

function sliderUpdate() {
  const slider = document.getElementById("myRange");
  const imgTags = document.getElementsByClassName('gal_images');
  const gal_width = document.getElementById('gallery_container').clientWidth;
  const gal_height = document.getElementById('gallery_container').clientHeight;
  const new_height = gal_height * (slider.value/100);
  console.log(gal_width);
  console.log('start');
  for (let i = 0; i < imgTags.length; i++) {
    const natural_ratio = Math.round((imgTags[i].naturalHeight / imgTags[i].naturalWidth)*10000) / 10000;
    const new_width = new_height / natural_ratio;
    console.log(new_width);
    if (new_width < gal_width) {
      imgTags[i].style.height = slider.value + "%";
    }
  }
}

function imgFocus(imgTag) {
  const pTag = document.getElementById('description')
  pTag.innerHTML = imgTag.id;
  console.log('run');
}