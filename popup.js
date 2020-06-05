
//Background comms
 var port = chrome.extension.connect({
      name: "Sample Communication"
 });

// Artist button handlers
//let gretchenandrew = document.getElementById('gretchenandrew');
//gretchenandrew.onclick = () => port.postMessage("gretchenandrew");
//
//let jakeelwes = document.getElementById('jakeelwes');
//jakeelwes.onclick = () => port.postMessage("jakeelwes");

const buttons = document.querySelectorAll('.button');

buttons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  port.postMessage(currentBtn.id);
});

// Close all button handler
let closeall = document.getElementById('closeAll');

closeall.onclick = () => closeAll();


// Close all popups

function closeAll() {
    chrome.storage.local.get(['popups'], function(result) {
        popups = result.popups;
        if (popups !== undefined) {
            popups.forEach( function (popup){
                console.log("Removing " + popup);
                chrome.windows.remove(popup); 
            });
        }
    });
    chrome.storage.local.set({popups: []}, function () {
        console.log(popups);
    });
}
