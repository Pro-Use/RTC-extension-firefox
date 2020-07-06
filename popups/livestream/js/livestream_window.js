var player_width = document.body.offsetWidth - 20;
var player_height = (player_width / 16) * 9;
console.log(player_width);

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
console.log(firstScriptTag);
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: player_width,
    height: player_height,
    videoId: 'Fau_WpbI2LM',
    events: {
    }
  });
}

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
