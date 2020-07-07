//Design close
let buttons = document.querySelectorAll('.close');

buttons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  {
      window.close();
  };
});

//Background comms
 var port = chrome.extension.connect({
      name: "RTC_Comms"
 });

buttons = document.querySelectorAll('.send');

buttons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  {
      port.postMessage(currentBtn.id);
      window.close();
  };
});

// Close all button handler
var closeall = document.getElementById('closeAll');

closeall.onclick = () => closeAll();


// Close all popups

function closeAll() {
    chrome.storage.local.get(['popups'], function(result) {
        let popups = result.popups;
        if (popups !== undefined) {
            popups.forEach( function (popup){
                console.log("Removing " + popup);
                chrome.windows.remove(popup); 
            });
        }
    });
    chrome.storage.local.get(['info_wid_id'], function(result) {
        let info_wid_id = result.info_wid_id;
        if (info_wid_id !== undefined) {
            chrome.windows.remove(info_wid_id);
        }
    });
    chrome.storage.local.set({popups: []});
}

//launch live
var live_counter = 0;

document.addEventListener('keydown', logKey);

function logKey(e) {
  if (e.code === "KeyL"){
      live_counter += 1;
      if (live_counter > 2) {
           port.postMessage("popup-live");
      }
  };
}

var work_info = {
    gretchenandrew:["Gretchen Andrew","The Next American President"],
    sofiacrespo:["Sofia Crespo x Dark Fractures","Artificial Remnants"],
    disnovation:["DISNOVATION.ORG","Predictive Art Bot"],
    jakeelwes:["Jake Elwes","Zizi - Queering the Dataset"],
    bengrosser:["Ben Grosser","Tracing You"],
    libbyheaney:["Libby Heaney","Elvis"],
    joelsimon:["Joel Simon", "Artbreeder"]
};

var title = document.getElementById('popup-work-title');
var artist = document.getElementById('popup-artist');
var time = document.getElementById('popup-time');

//check for events:
var d = new Date();
var n = d.getTimezoneOffset() / 60;

var pv = [
    new Date(Date.UTC(2020, 23, 7, 18 + n, 30)),
    new Date(Date.UTC(2020, 23, 7, 21 + n, 30))
];
console.log(pv);

var talk = [
    new Date(Date.UTC(2020, 6, 8, 19 + n, 00)),
    new Date(Date.UTC(2020, 6, 8, 21 + n, 00))
];
console.log(talk);
var now = d.getTime();

console.log(pv[0].getTime() +"<" + now + "<" + pv[1].getTime());

if (pv[0].getTime() < now && now < pv[1].getTime()) {
    console.log("PV!");
    title.textContent = "Real Time Constraints";
    artist.textContent = "Opening";
    time.textContent = pv[0];
    document.getElementById("timer").style.display = "none";
    document.getElementById("live").style.display = "block";
    
} else if (talk[0].getTime() < now && now < talk[1].getTime()) {
    console.log("Talk!");
    title.textContent = "Real Time Constraints";
    artist.textContent = "Panel Discussion";
    time.textContent = talk[0];
    document.getElementById("timer").style.display = "none";
    document.getElementById("live").style.display = "block";
    
} else {
    var next_ts = null;

    chrome.alarms.getAll(function (alarms) {
        alarm_times = [];
        alarms.forEach(function(alarm) {
            if (alarm.name !== "countdown") {
                alarm_times.push(alarm.scheduledTime);
            }
        });
        alarm_times.sort(function(a, b){return a - b});
        next_alarm_time = alarm_times[0];
        for (i = 0; i < alarms.length; i++) {
            alarm = alarms[i];
            if (alarm.scheduledTime === next_alarm_time){
                next_ts = alarm.scheduledTime;
                alarm_time = new Date(next_ts);
                info = work_info[alarm.name];
                console.log(info);
                artist.textContent = info[0];
                title.textContent = info[1];
                time.textContent = alarm_time;
                break;
            }        
        }
    });

    var x = setInterval(function() {
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = next_ts - now;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display the result in the element with id="demo"
        countdown_str = hours + "h " + minutes + "m " + seconds + "s ";
        document.getElementById("timer").innerHTML = countdown_str;

        // If the count down is finished, write some text
        if (distance < 0) {
          clearInterval(x);
        }
    }, 1000);
}