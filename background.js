
var popups = [];

// Timers
var times = [11,12,13,14,15,16,17];
//var times = [2];
//,2,3,4,5,6]; // For debug

var create_alarm = (pos) => {
    let now = new Date();
    // Alarm today:
    now.setHours(times[pos],00,00);
//    now.setMinutes(now.getMinutes() + times[pos]); // For debug
    // As UTC timestamp:
    new_time = now.getTime();
    // Is it in the past? Add 1 day
    if (new_time < Date.now()) {
//        console.log("In the past");
        new_time += 86400000;
    // Or is it less than a minute? Add a minute
    } else if ((new_time - Date.now()) < 60000 ) {
        new_time += 60000;
    }
//    console.log("Milliseconds till alarm " + (new_time - Date.now() ));
    let alarm_info = {
        when:new_time,
        periodInMinutes: 1440
    };
    browser.alarms.create(artists_funcs[pos].name, alarm_info);
};

var create_alarms = () => {
    browser.alarms.clear("countdown");
    browser.alarms.clearAll();
    // works
    for (i = 0; i < times.length; i++) {
        create_alarm(i);
    }
    // events
    var d = new Date();
    var n = d.getTimezoneOffset() / 60;
    var pv = new Date(Date.UTC(2020, 23, 7, 18 + n, 30));
    browser.alarms.create("pv", {when:pv.getTime()});
    var talk = new Date(Date.UTC(2020, 7, 6, 19 + n, 00));
    browser.alarms.create("talk", {when:talk.getTime()});
    // log
    browser.alarms.getAll(function(alarms) {
        alarms.forEach(function(alarm) {
           alarm_time = new Date(alarm.scheduledTime);
           console.log("Alarm: "+alarm.name+", Time: "+alarm_time); 
        });
    });
 };

// Update alarms on system idle update
browser.idle.onStateChanged.addListener(function() {
    browser.storage.local.get(['paused'], function(result) {
        if (result.paused === false) {
            create_alarms(); 
        }
    });
});

// Clear Window cache + create alarms on install
browser.runtime.onInstalled.addListener(function () {
    browser.storage.local.remove("popups", function () {
        console.log("Cleared popup cache");
    });
    create_alarms();
    update_icon_text();
    browser.storage.local.set({paused: false});
});

// Clear Window cache + create alarms on restart
browser.runtime.onStartup.addListener(function () {
    browser.storage.local.remove("popups", function () {
        console.log("Cleared popup cache");
    });
    browser.storage.local.get(['paused'], function(result) {
        if (result.paused === false) {
            create_alarms();
            update_icon_text();
        }
    });
});

// Closed window listener
browser.windows.onRemoved.addListener(function(id) {
    browser.storage.local.get(['popups'], function(result) {
        popups = result.popups;
        index = popups.indexOf(id);
        if (index > -1) {
            popups.splice(index, 1);
        }
        browser.storage.local.set({popups: popups}, function() {});
    });
});

// Popup comms
 browser.runtime.onConnect.addListener(function(port) {
      port.onMessage.addListener(async function(msg) {
           console.log("message recieved: " + msg);
           if (msg.includes("bio")) {
               msg = msg.split("-");
               let artist = null;
               if (msg.length === 2) {
                   artist = msg[1];
               }
               prWindow(artist);
           } else if (msg === "info_up") {
               browser.storage.local.get(['info_wid_id'], function(result) {
                    let info_wid_id = result.info_wid_id;
                    if (info_wid_id !== undefined) {
                        browser.windows.update(info_wid_id, {focused: true});
                    }
                });
           } else if (msg === "ctrl-link-work") {
               timesWindow(); 
           } else if (msg === "all-artists") {
               allArtistsWindow(); 
           } else if (msg === "ctrl-link") {
                arebyteWindow();          
           } else if (msg === 'popup-live'){
               liveWindow();
           } else if (msg === 'pause_toggle'){
               pause_toggle();
           } else {
                browser.storage.local.set({last_triggered: msg});
                await infoWindow(msg);
                if (msg === "gretchenandrew") {
                    gretchenandrew();
                } else if (msg === "sofiacrespo") {
                    sofiacrespo();
                } else if (msg === "jakeelwes") {
                    jakeelwes();
                } else if (msg === "disnovation") {
                    disnovation();
                } else if (msg === "bengrosser") {
                    bengrosser();
                } else if (msg === "libbyheaney") {
                    libbyheaney();
                } else if (msg === "joelsimon") {
                    joelsimon();
                }
                titleWindow(msg); 
           } 
      });
 });
 
  //Pause
function pause_toggle() {
    browser.storage.local.get(['paused'], function(result) {
        paused = result.paused;
        if (paused === null || paused === false) {
            browser.storage.local.set({paused: true});
            browser.alarms.clearAll();
            browser.browserAction.setBadgeText({text:""});
            console.log("Paused");
        } else {
            browser.storage.local.set({paused: false});
            create_alarms();
            update_icon_text();
            console.log("Unpaused");
            
        }
    });
    
 }
 
 //Popup functions
 
 function openWindow(dims, fullscreen, url) {
    optionsDictionary = {url: url, type: "popup"};
    if (fullscreen) {
        optionsDictionary.state = "fullscreen";
    } else {
        optionsDictionary.left = parseInt(dims[0]);
        optionsDictionary.top = parseInt(dims[1]);
        optionsDictionary.width = parseInt(dims[2]);
        optionsDictionary.height = parseInt(dims[3]);

    }
    return new Promise((resolve, reject) => {
          var pos = [optionsDictionary.left, optionsDictionary.top];
          let new_window = browser.windows.create(optionsDictionary);
          new_window.then(function (newWindow) {
              let new_id = newWindow.id;
              let update = browser.windows.update(new_id, {
                left: pos[0],
                top: pos[1]
              });
              update.then(function(window) {
                resolve(window.id);
              });
          });
    });
}

async function openMultiple(dims, urls) {
    if (dims.length !== urls.length) {
        console.log("Number of dims and urls do not match");
        return;
    }
    let new_popups = [];
    let num_popups = dims.length;
    var i;
      for (i = 0; i < num_popups; i++) {
        
        let new_dims = dims[i];
        var id = await openWindow(new_dims, false, urls[i]);
        new_popups.push(id);
      };
    console.log("Func ended popups: " + new_popups + ", length :" + new_popups.length);
    let close_id = await closeAllWindow();
    new_popups.push(close_id);
    storePopupID(new_popups);
}

function storePopupID(id) {
    browser.storage.local.get(['popups'], function(result) {
        popups = result.popups;
        if (popups === undefined){
            popups = [];
        }
        if (Number.isInteger(id)) {
            popups.push(id);
        } else if (Array.isArray(id)) {
            id.forEach(id_num => popups.push(id_num));
        }
        console.log("saving:" + popups);
        browser.storage.local.set({popups: popups}, function () {
            console.log(popups);
        });
    });
}

titleWindow = async (artist) => {
    let width = 450;
    let height = 100;
    let dims = [
      10,
      10,
      width,
      height
    ];
    if (artist === "sofiacrespo") {
        dims[0] = (window.screen.availWidth - width) - 10;
    }
    let id = await openWindow(dims, false,"/popups/info/title_window.html");
    storePopupID(id);
};

infoWindow = async (artist) => {
    let width = 450;
    let height = 500;
    let dims = [
      (window.screen.availWidth - width) / 2,
      (window.screen.availHeight - height) / 2,
      width,
      height
    ];
    let id = await openWindow(dims, false,"/popups/info/info_window.html");
//    storePopupID(id);
    browser.storage.local.set({info_wid_id: id});
};

prWindow = async (artist) => {
    let width = 800;
    let height = window.screen.availHeight - 100;
    let dims = [
      (window.screen.availWidth - width) / 2,
      (window.screen.availHeight - height) / 2,
      width,
      height
    ];
    url = "/popups/info/press_release_window.html";
    if (artist) url += "#" + artist;
    let id = await openWindow(dims, false, url);
};

liveWindow = async (event) => {
    let width = window.screen.availWidth - 200;
    let height = window.screen.availHeight - 100;
    let dims = [
      (window.screen.availWidth - width) / 2,
      (window.screen.availHeight - height) / 2,
      width,
      height
    ];
    url = "/popups/livestream/livestream_window.html";
    await openWindow(dims, false, url);
    chat_dims = [
        window.screen.availWidth - 500,
        window.screen.availHeight - 600,
        500, 
        600
    ];
    if (event === "pv") {
        chat_url = "https://studio.youtube.com/live_chat?is_popout=1&v=IsI7ESluACA";
    } else {
        chat_url = "https://studio.youtube.com/live_chat?is_popout=1&v=_bwqSE3REQE";
    }
    
    await openWindow(chat_dims, false, chat_url);
};

closeAllWindow = async() => {
    let width = 50;
    let height = 40;
    let dims = [
      window.screen.availWidth - (width + 40),
      window.screen.availHeight - (height + 40),
      width,
      height
    ];
    url = "/popups/info/close_all_window.html";
    let id = await openWindow(dims, false, url);
//    storePopupID(id);
    return id;
};

allArtistsWindow = async (artists) => {
    let width = 500;
    let height = window.screen.availHeight -200;
    let dims = [
      (window.screen.availWidth - width) / 2,
      (window.screen.availHeight - height) / 2,
      width,
      height
    ];
    let id = await openWindow(dims, false,"all_artists.html");
    storePopupID(id);
    browser.storage.local.set({info_wid_id: id});
};

arebyteWindow = async() => {
    let width = window.screen.availWidth - 100;
    let height = window.screen.availHeight - 100;
    let dims = [
      (window.screen.availWidth - width) / 2,
      (window.screen.availHeight - height) / 2,
      width,
      height
    ];
    let url = "https://www.arebyte.com/real-time-constraints";
    let id = await openWindow(dims, false, url);
    storePopupID(id);
};

timesWindow = async () => {
    let width = 500;
    let height = window.screen.availHeight -200;
    let dims = [
      (window.screen.availWidth - width) / 2,
      (window.screen.availHeight - height) / 2,
      width,
      height
    ];
    let id = await openWindow(dims, false,"popups/info/times_window.html");
    storePopupID(id);
    browser.storage.local.set({info_wid_id: id});
};
// Artist functions

// Gretchen Andrew

gretchenandrew = () => {
    let dims = [window.screen.availWidth - 100,
        window.screen.availHeight - 100];
    let dims_array = [];
    let url_array = ["https://the-next-american-president.com/","https://cover-of-artforum.com/"];
    var i;
    for (i = 0; i < url_array.length; i++) {
      let new_left = 
              (window.screen.availWidth - dims[0]) * Math.random();
      let new_top = 
              (window.screen.availHeight - dims[1]) * Math.random();
      let new_dims = [
          parseInt(new_left),
          parseInt(new_top),
          parseInt(dims[0]),
          parseInt(dims[1])
      ];
      dims_array.push(new_dims);
    }
    dims = [500, 665];
    for (i = 0; i < 10; i++) {
      let new_left = 
              (window.screen.availWidth - dims[0]) * Math.random();
      let new_top = 
              (window.screen.availHeight - dims[1]) * Math.random();
      let new_dims = [
          parseInt(new_left),
          parseInt(new_top),
          parseInt(dims[0]),
          parseInt(dims[1])
      ];
      dims_array.push(new_dims);
      url_array.push("popups/gretchenandrew/"+i+".html");
    };
    openMultiple(dims_array, url_array);
};

sofiacrespo = async() => {
  let dims = [0,0,window.screen.availWidth, window.screen.availHeight - 20];
  let id = await openWindow(dims, false,"/popups/sofiacrespo/artificialremnants.html");
  storePopupID(id);
};

disnovation = async() => {
  let dims = [0,0,window.screen.availWidth, window.screen.availHeight - 20];
  let id = await openWindow(dims, false,"/popups/disnovation/predictiveartbot.html");
  storePopupID(id);
};

jakeelwes = () => {
    let size = window.screen.availWidth / 3;
    let top = (window.screen.availHeight - size) / 2;
    let dims = [size, size];
    let dims_array = [];
    let url_array = [];
    var i;
    for (i = 0; i < 3; i++) {
        let new_left = i * size;
        let new_dims = [
            parseInt(new_left),
            parseInt(top),
            parseInt(dims[0]),
            parseInt(dims[1])
        ];
        dims_array.push(new_dims);
        url_array.push("popups/jakeelwes/"+i+".html");
    };
    openMultiple(dims_array, url_array);
    
};

bengrosser = async() => {
  let width = window.screen.availWidth - 100;  
  let height = window.screen.availHeight - 100;
  let dims = [
      (window.screen.availWidth - width) / 2,
      (window.screen.availHeight - height) / 2,
      width,
      height
  ];
  let id = await openWindow(dims, false,"popups/bengrosser/tracingyou.html");
  storePopupID(id);
};

libbyheaney = () => {
    let width = window.screen.availWidth / 2;
    let height = (width / 16) * 9;
    let top = (window.screen.availHeight - height) / 2;
    let dims = [width, height];
    let dims_array = [];
    let url_array = [];
    var i;
    for (i = 0; i < 2; i++) {
        let new_left = i * width;
        let new_dims = [
            parseInt(new_left),
            parseInt(top),
            parseInt(dims[0]),
            parseInt(dims[1])
        ];
        dims_array.push(new_dims);
        url_array.push("popups/libbyheaney/" + i + ".html");
    };
    openMultiple(dims_array, url_array);
};
   
joelsimon = async () => {
    const { availWidth:w, availHeight:h } = window.screen;
    const dims = [.2*w,.1*h, .6*w, .9*h].map(Math.floor);
    const id = await openWindow(dims, false, "popups/joelsimon/artbreeder.html");
    storePopupID(id);
};


var artists_funcs = [gretchenandrew, sofiacrespo, disnovation, 
    jakeelwes, bengrosser, libbyheaney, joelsimon];


browser.alarms.onAlarm.addListener(function(alarm) {
    console.log("Triggered:"+alarm.name);
    alarm_offset = Date.now() - alarm.scheduledTime;
    if (alarm.name === "pv" || alarm.name === "talk") {
        if (alarm_offset < 10800000) {
            liveWindow(alarm.name);
        }
    }
    else if (alarm_offset < 66000) {
        browser.storage.local.set({last_triggered: alarm.name});
        infoWindow(alarm.name);
        if (alarm.name === "gretchenandrew") {
            gretchenandrew();
        } else if (alarm.name === "sofiacrespo") {
            sofiacrespo();
        } else if (alarm.name === "jakeelwes") {
            jakeelwes();
        } else if (alarm.name === "disnovation") {
            disnovation();
        } else if (alarm.name === "bengrosser") {
            bengrosser();
        } else if (alarm.name === "libbyheaney") {
            libbyheaney();
        }  else if (alarm.name === "joelsimon") {
            joelsimon();
        }
        titleWindow(alarm.name);
        update_icon_text();
    } else {
        console.log("Missed " + alarm.name);
        update_icon_text();
    }
    browser.alarms.getAll(function(alarms) {
        alarms.forEach(function(saved_alarm) {
            if (saved_alarm.name === alarm.name) {
                alarm_time = new Date(saved_alarm.scheduledTime);
                console.log("Alarm: "+saved_alarm.name+", Next Time: "+alarm_time);
            }
        });
    });
});


var update_icon_text = () => {
    browser.alarms.getAll(function (alarms) {
        alarm_times = [];
        alarms.forEach(function(alarm) {
            if (alarm.name !== "countdown" && alarm.name !== "pv" && alarm.name !== "talk") {
                alarm_times.push(alarm.scheduledTime);
            }
        });
        alarm_times.sort(function(a, b){return a - b;});
        next_alarm_time = alarm_times[0];
        for (i = 0; i < alarms.length; i++) {
            alarm = alarms[i];
            if (alarm.scheduledTime === next_alarm_time){
                let next_ts = alarm.scheduledTime;
                let alarm_time = new Date(next_ts);
                let hour =  alarm_time.getHours();
                if (hour < 12) {
                    var time_txt = "am";
                } else if (hour === 12) {
                  hour = "";
                  var time_txt = "Noon";
                } else {
                    hour -= 12;
                    var time_txt = "pm";
                }
                browser.browserAction.setBadgeBackgroundColor({color:[0,0,0,150]});
                browser.browserAction.setBadgeText({text:hour.toString()+time_txt});
//                browser.alarms.create("countdown", {when: alarm.scheduledTime - 60000});
//                // Debug
//                browser.alarms.get("countdown", function(alarm) {
//                    console.log(alarm.name + " - " + new Date(alarm.scheduledTime)); 
//                 });
                break;
            }        
        }
    });
 }; 

// Icon timer overlay
update_icon_text();