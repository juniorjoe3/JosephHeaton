getData();
async function getData() {
    const response = await fetch('../data/gallery.csv');
    const data = await response.text();
    printToPage(data);
    let d = new Date()
    console.log(d);
  }

function removeExtraSpaces(string) {
    const array = string.split(",")
    for (let i = 0; i < array.length; i++) {
      array[i] = String(array[i]).trim()
      // console.log(array[i]);
    }
    return array;
}


function printToPage(string) {
  const dataArray = removeExtraSpaces(string);
  let columnCount = Number(dataArray.shift());
  console.log(columnCount);
  
  for (let i = columnCount; i < dataArray.length; i += columnCount) {
    const a = document.createElement('a')
    const p = document.createElement('p')
    const img = document.createElement("img");
    const node = document.createTextNode(dataArray[i+1]);
    p.appendChild(node);
    const gal_div = document.getElementById("gallery_container");
    gal_div.appendChild(a);
    const aTag = gal_div.lastElementChild
    aTag.appendChild(img)
    aTag.lastElementChild.id = dataArray[i];
    aTag.lastElementChild.src = String("../gallery_images/" + dataArray[i+2]);
    aTag.appendChild(p)
    // console.log(dataArray[i+2]);
    


  }

}


