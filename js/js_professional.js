



function allowDrop(ev) { //allows the drop event to take place, overrides the default value
    ev.preventDefault(); 
  }

  function allowDropGarbage(ev) {
    ev.preventDefault();
    const garbage_div = document.getElementById("garbage_div");
    garbage_div.style.backgroundImage = "url('/images/garbage_open.png')"; //opens the garbage can
  }
  
  function drag(ev) { //attaches data to the drag event
    ev.dataTransfer.setData("text", ev.target.id + ',' + ev.target.parentElement.id ); 
  }
  
  function dropShift(ev) { 
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text").split(','); // (child num  ,  parent num)
    ev.target.parentElement.appendChild(document.getElementById(data[0]));
    const fromContainer_Num = data[1].substr(-1, 1);
    const toContainer_Num = String(ev.target.parentElement.id).substr(-1,1);
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
  }

  function dropDelete(ev) {
    ev.preventDefault();
    const dragdrop_div = document.getElementById("dragdrop_container");
    const data = ev.dataTransfer.getData("text").split(',');
    const fromContainer_Num = data[1].substr(-1, 1);
    const fromContainer_Ele = document.getElementById("div" + fromContainer_Num)
    fromContainer_Ele.removeChild(fromContainer_Ele.lastElementChild);
    const numOfContainers = dragdrop_div.childElementCount;
    for (let i = fromContainer_Num; i < numOfContainers; i++) {
          let x = Number(i) + 1;
          let container = document.getElementById("div" + i);
          let contentBelow = document.getElementById("div" + (x)).firstElementChild;
          container.appendChild(contentBelow);
      }
      dragdrop_div.removeChild(dragdrop_div.lastElementChild);
      ev.target.style.backgroundImage = null;
  }