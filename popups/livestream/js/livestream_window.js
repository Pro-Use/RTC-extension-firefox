var width = document.body.offsetWidth - 20;
var height = (width / 16) * 9;


var player;
now = new Date();
if (now.getDay() === 23) {
    vid_id = "_bwqSE3REQE";
} else {
    vid_id = "IsI7ESluACA";
}

var player = document.getElementById("player");
player.innerHTML = '<iframe width="'+width+'" height="'+height+'" src="https://www.youtube-nocookie.com/embed/'+vid_id+'?controls=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

//Design close buttons
const buttons = document.querySelectorAll('.close');

buttons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  {
      window.close();
  };
});

//Background comms
 var port = chrome.extension.connect({
      name: "RTC_Comms"
 });

const artistButtons = document.querySelectorAll('.send');

artistButtons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  {
      port.postMessage(currentBtn.id);
  };
});

//Draggable
dragElement(document.getElementById("bio-popup-live"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById("draggable")) {
    // if present, the header is where you move the DIV from:
    document.getElementById("draggable").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
//    document.onmouseout = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
