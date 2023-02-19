
// get resume.json 
async function fetchResume() {
  try {
    const response = await fetch('../data/resume.json');
    if (response.ok) {
      const data = await response.text();
      sessionStorage.setItem('resume', data);
      printResume();
    } else {
      console.log('!!!resume failed to load');
    }
  }
    catch(error){
    console.log(error)   //doesnt do anything
  }
}

function clearResume() {
  const resume_container = document.getElementById("resume_container");
  while (resume_container.hasChildNodes()) {
    resume_container.removeChild(resume_container.lastChild)
  }
}

// print resume
function printResume() {
  clearResume();
  const resume_container = document.getElementById('resume_container');
  const dateFrom = readDateFrom();
  const catArray = readOrder();
  const resumeArray = JSON.parse(sessionStorage.getItem('resume'));
  // create the list of headers for later use with the expand button
  sessionStorage.setItem('headerList', "");    
  // for each visible field
  let catIndex = 1; // skip "visible fields div"
  let current_cat = "";
  while (current_cat != 'Hidden Fields' && catIndex < catArray.length) {
    current_cat = catArray[catIndex];
    const entrySet = new Set();
    //first find the entries of the current category and filtered for the date
    for (let entryIndex = 0; entryIndex < resumeArray.length; entryIndex++ ) {
      const entry_obj = resumeArray[entryIndex];
          //check entry date
          let entryDate = new Date();
          if (entry_obj.dateTo != '') {
            entryDate = new Date(entry_obj.dateTo);
          }
      if (entry_obj.category == current_cat && entryDate >= dateFrom) {
        entrySet.add(entry_obj);
      }
    }
    // now print the field 
    if (entrySet.size > 0) {
      const field_div = document.createElement('div');
      const textNode = document.createTextNode(current_cat);
      field_div.appendChild(textNode);
      field_div.className = 'field';
      resume_container.appendChild(field_div)
        switch (current_cat) {
          case "Education":
            entrySet.forEach(function(value) {printEntry_Full(value)});
            break;
          case "Work Experience":
            entrySet.forEach(function(value) {printEntry_Full(value)});
            break;
          case "Hard Skills":
            entrySet.forEach(function(value) {printEntry_Full(value)});
            break;
          case "Soft Skills":
            entrySet.forEach(function(value) {printEntry_Full(value)});
            break;
          case "Community Service":
            entrySet.forEach(function(value) {printEntry_Full(value)});
            break;
          case "Interests":
            entrySet.forEach(function(value) {printEntry_Full(value)});
            break;
          case "":

        }
    }
    // increment
    catIndex += 1;
  }
}


function printEntry_Full(entry_obj) {
  const resume_container = document.getElementById('resume_container');
    //create entry div
    const div_entry = document.createElement('div');
    div_entry.className = "entry";
    div_entry.id = "entry_div_" + entry_obj.title;
    resume_container.appendChild(div_entry);
    //create header div
    const div_header = document.createElement('div');
    div_header.className = "header"
    div_header.setAttribute("onclick","toggleView(this)")
    div_header.setAttribute("draggable","true")
    div_header.setAttribute("ondragend","dragEntryEnd()")
    div_header.setAttribute("ondragstart","dragEntryStart(event)")
    div_header.id = "header_" + entry_obj.title;
          // add this to the list of collapsable headers
          const headerList = sessionStorage.getItem('headerList');
          sessionStorage.setItem('headerList', headerList + ',header_' + entry_obj.title);
    div_entry.appendChild(div_header)
    //create header interior
      // arrow
      const div_arrow = document.createElement('div');
      div_arrow.className = 'arrow';
      div_header.appendChild(div_arrow);
      //title
      const div_title = document.createElement('div');
      div_title.className = 'title';
      const textNode1 = document.createTextNode(entry_obj.title);
      div_title.appendChild(textNode1);
      div_header.appendChild(div_title);
      // location
      const div_loc = document.createElement('div');
      div_loc.className = 'location';
      const textNode2 = document.createTextNode(entry_obj.location);
      div_loc.appendChild(textNode2);
      div_header.appendChild(div_loc);
      // date
      const div_date = document.createElement('div');
      div_date.className = 'date';
      const textNode3 = document.createTextNode(entry_obj.dateString);
      div_date.appendChild(textNode3);
      div_header.appendChild(div_date);
    // create detail ul
    const detail_ul = document.createElement('ul')
    detail_ul.className = 'detail';
    div_entry.appendChild(detail_ul);
    for (let i = 0; i < entry_obj.detail.length; i++) {
      const li = document.createElement('li');
      li.className = 'bullet';
      const textNode4 = document.createTextNode(entry_obj.detail[i]);
      li.appendChild(textNode4);
      detail_ul.appendChild(li);
    }


}


// <div onclick="toggleView(this)" class="header" draggable="true" ondragend="dragEntryEnd()" ondragstart="dragEntryStart(event)">






// save values
function saveValues() {
  saveOrder();
  saveDateFrom();
}

// save field order to local storage
function saveOrder() {
  const categories = readOrder();
  localStorage.setItem('categories', JSON.stringify(categories));
  console.log('run save order');
}

// read order
function readOrder() {
  const categories = [];
  const numOfFields = 8
  for (let i = 0; i < numOfFields; i++ ) {
    let x = Number(i) + 1
    const container = document.getElementById("div" + x);
    const content = container.firstElementChild;
    categories[i] = content.innerHTML;
  }
  return categories;
}

// load Order
function loadOrder() {
  if (localStorage.getItem('categories') != null) {
    console.log('run load order');
    const categories = JSON.parse(localStorage.getItem('categories'));
    const numOfFields = 8
      for (let i = 0; i < numOfFields; i++ ) {
        let x = Number(i) + 1
        const container = document.getElementById("div" + x);
        const content = container.firstElementChild;
        content.innerHTML = categories[i];
          if (categories[i] == 'Hidden Fields' ) {
            content.className = 'divider_HF';
          } else if (categories[i] == 'Visible Fields') {
            content.className = 'divider';
          } else {
            content.className = 'content'
          }
      }
  }
}

// save dateFrom
function saveDateFrom() {
  const fromMonth = document.getElementById('fromMonth').value;
  const fromYear = document.getElementById('fromYear').value;
  localStorage.setItem('month', fromMonth);
  localStorage.setItem('year', fromYear);
}

// load dateTo
function loadDateFrom() {
  if (localStorage.getItem('month') != null) {
    const fromMonth = localStorage.getItem('month');
    const fromYear = localStorage.getItem('year');
    document.getElementById('fromMonth').value = fromMonth;
    document.getElementById('fromYear').value = fromYear;
  }
}

// date from
function readDateFrom() {
  const fromMonth = document.getElementById('fromMonth').value;
  const fromYear = document.getElementById('fromYear').value;  
  const fromDate = new Date(fromYear, (fromMonth-1));
  console.log(fromDate);
  return fromDate;
}

function toggleView(header_div) {
  console.log('toggle view');
  const entry_div = header_div.parentElement;
  const icon = header_div.firstElementChild;
  const detail_div = entry_div.lastElementChild;
  if (detail_div.style.display == 'none') {
    detail_div.style.display = null;
    icon.style.backgroundImage = "url('/images/triangle_down.png')";
  } else {
    detail_div.style.display = 'none';
    icon.style.backgroundImage = "url('/images/triangle_right.png')";
  }
  
}

function toggleViewAll(para) {
  const headerList_str = sessionStorage.getItem('headerList');
  console.log(headerList_str);
  const headerList = headerList_str.split(',');
  console.log(headerList);
  for (let i = 1; i < headerList.length; i++) {
    console.log(headerList[i]);
    const header_id = headerList[i];
    const header_div = document.getElementById(header_id);
    const entry_div = header_div.parentElement;
    const icon = header_div.firstElementChild;
    const detail_div = entry_div.lastElementChild;
    if (para == 'expand') {
      detail_div.style.display = null;
      icon.style.backgroundImage = "url('/images/triangle_down.png')";
    } else {
      detail_div.style.display = 'none';
      icon.style.backgroundImage = "url('/images/triangle_right.png')";
    }
  }
}

function sliderUpdate() {
  const slider = document.getElementById("myRange");
  const resume_container = document.getElementById('resume_container');
  const middle_container = document.getElementById('middle_container');
  const val = slider.value/100;
  resume_container.style.transform = "scale(" + val + ")";
  middle_container.style.width = (val * 700) + 'px';
}


//drag and drop resume entries into garbage can -----------------------------------------------------------------------------------
function allowDropGarbage(ev) {
  ev.preventDefault();
}

function dragEntryStart(ev) { //attaches data to the drag event
  ev.dataTransfer.setData("text", ev.target.parentElement.id);
  console.log(ev.dataTransfer.getData('text'));
  const entry_div = ev.target.parentElement;
  const detail_div = entry_div.lastElementChild;
  detail_div.style.display = 'none';
  const garbage_div = document.getElementById("garbage_div");
  garbage_div.style.backgroundImage = "url('/images/garbage_open.png')"; //opens the garbage can
}

function dragEntryEnd() {
  const garbage_div = document.getElementById("garbage_div");
  garbage_div.style.backgroundImage = null; // closes the garbage can
}

function dropDeleteEntry(ev) {
  ev.preventDefault();
  const resume_container = document.getElementById("resume_container");
  const entry_div_id = ev.dataTransfer.getData("text");
  const div_class = entry_div_id.substring(0,5);
  console.log(div_class);
  if ( div_class == 'entry') {
    console.log(entry_div_id)
    const entry_div = document.getElementById(entry_div_id);
    resume_container.removeChild(entry_div);
    ev.target.style.backgroundImage = null;
  }
}


// drag and drop for left side panel -----------------------------------------------------------------------------------

function allowDrop(ev) { //allows the drop event to take place, overrides the default value
    ev.preventDefault(); 
  }

  // function allowDropGarbage(ev) {
  //   ev.preventDefault();
  //   const garbage_div = document.getElementById("garbage_div");
  //   garbage_div.style.backgroundImage = "url('/images/garbage_open.png')"; //opens the garbage can
  // }
  
  function drag(ev) { //attaches data to the drag event
    ev.dataTransfer.setData("text", ev.target.id + ',' + ev.target.parentElement.id ); 
  }
  
  function dropShift(ev) { 
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text").split(','); // (child num  ,  parent num)
    ev.target.parentElement.appendChild(document.getElementById(data[0]));
    const fromContainer_Num = data[1].substr(-1, 1);
    const text = String(ev.target.parentElement.id)
    const toContainer_Num = text.substring(text.length - 1);
    if (fromContainer_Num > toContainer_Num) {
      //shift down
      for (let i = fromContainer_Num; i > toContainer_Num; i--) {
          let container = document.getElementById("div" + i);
          let contentAbove = document.getElementById("div" + (i-1)).firstElementChild;
          container.appendChild(contentAbove);
      }
    } else {
      //shift up
      for (let i = fromContainer_Num; i < toContainer_Num; i++) {
          let x = Number(i) + 1;
          let container = document.getElementById("div" + i);
          let contentBelow = document.getElementById("div" + (x)).firstElementChild;
          container.appendChild(contentBelow);
      }
    }
    printResume();
  }

  // not used, kept for future referrence

  // function dropDelete(ev) {
  //   ev.preventDefault();
  //   const dragdrop_div = document.getElementById("dragdrop_container");
  //   const data = ev.dataTransfer.getData("text").split(',');
  //   const fromContainer_Num = data[1].substr(-1, 1);
  //   const fromContainer_Ele = document.getElementById("div" + fromContainer_Num)
  //   fromContainer_Ele.removeChild(fromContainer_Ele.lastElementChild);
  //   const numOfContainers = dragdrop_div.childElementCount;
  //   for (let i = fromContainer_Num; i < numOfContainers; i++) {
  //         let x = Number(i) + 1;
  //         let container = document.getElementById("div" + i);
  //         let contentBelow = document.getElementById("div" + (x)).firstElementChild;
  //         container.appendChild(contentBelow);
  //     }
  //     dragdrop_div.removeChild(dragdrop_div.lastElementChild);
  //     ev.target.style.backgroundImage = null;
  // }