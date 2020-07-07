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
