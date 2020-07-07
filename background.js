
var popups = [];

// Clear Window cache + create alarms on install
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.remove("popups", function () {
        console.log("Cleared popup cache");
    });
    create_alarms();
});

// Clear Window cache + create alarms on restart
chrome.runtime.onStartup.addListener(function () {
    chrome.storage.local.remove("popups", function () {
        console.log("Cleared popup cache");
    });
    create_alarms();
});

// Closed window listener
chrome.windows.onRemoved.addListener(function(id) {
    chrome.storage.local.get(['popups'], function(result) {
        popups = result.popups;
        index = popups.indexOf(id);
        if (index > -1) {
            popups.splice(index, 1);
        }
        chrome.storage.local.set({popups: popups}, function() {});
    });
});

// Popup comms
 chrome.extension.onConnect.addListener(function(port) {
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
               chrome.storage.local.get(['info_wid_id'], function(result) {
                    let info_wid_id = result.info_wid_id;
                    if (info_wid_id !== undefined) {
                        chrome.windows.update(info_wid_id, {focused: true});
                    }
                });
           } else if (msg === "ctrl-link-work") {
               allArtistsWindow();
           } else if (msg === "ctrl-link") {
                prWindow(null);          
          } else if (msg === 'popup-live'){
               liveWindow();
           } else {
                chrome.storage.local.set({last_triggered: msg});
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
                titleWindow(); 
           } 
      });
 });
 
 //Popup functions
 
 function openWindow(dims, fullscreen, url) {
    optionsDictionary = {url: url, type: "popup"};
    if (fullscreen) {
        optionsDictionary.state = "fullscreen";
    } else {
        optionsDictionary.left = dims[0];
        optionsDictionary.top = parseInt(dims[1]);
        optionsDictionary.width = dims[2];
        optionsDictionary.height = dims[3];

    }
    return new Promise((resolve, reject) => {
        try {
          chrome.windows.create(optionsDictionary, function (newWindow) {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else {
              let new_id = newWindow.id;
              resolve(new_id);
            }
          });
        } catch (error) {
            reject (error);
        };
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
    chrome.storage.local.get(['popups'], function(result) {
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
        chrome.storage.local.set({popups: popups}, function () {
            console.log(popups);
        });
    });
}

titleWindow = async () => {
    let width = 450;
    let height = 10;
    let dims = [
      10,
      10,
      width,
      height
    ];
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
    chrome.storage.local.set({info_wid_id: id});
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
        chat_url = "https://studio.youtube.com/live_chat?is_popout=1&v=_bwqSE3REQE";
    } else {
        chat_url = "https://studio.youtube.com/live_chat?is_popout=1&v=IsI7ESluACA";
    }
    
    await openWindow(chat_dims, false, chat_url);
};

closeAllWindow = async() => {
    let width = 50;
    let height = 40;
    let dims = [
      window.screen.availWidth - (width + 10),
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
    chrome.storage.local.set({info_wid_id: id});
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
    console.log('joelsimon');;
    const round = (arr) => arr.map(Math.floor);
    const s3_root = 'https://joels-share.s3.amazonaws.com/arebyte';
    const { availWidth:w, availHeight:h } = window.screen;
    const video_sizes = [[714, 204], [806, 204]];
    let id1, id2, id3;
    let start = [.3 * w, .3 * h];
    let dims = [...start, ...video_sizes[0]];
    
    id1 = await openWindow(round(dims), false, `${s3_root}/vid/title_a.mp4`);
    storePopupID(id1);

    const offset = 150
    setTimeout(async () => {
        let dims = [start[0]+offset, start[1]+offset, ...video_sizes[1]];
        id2 = await openWindow(round(dims), false, `${s3_root}/vid/title_b.mp4`);
        storePopupID(id2);
    }, 3000);

    setTimeout(async () => {
        chrome.windows.remove(id1);
        chrome.windows.remove(id2);
        const r = .5 * w;
        dims = [r/2, (h-r)/2, r, r];
        id3 = await openWindow(round(dims), false, `popups/joelsimon/index.html`);
        storePopupID(id3);
    }, 6000);
};

// Timers
var times = [11,12,13,14,15,16,17];
//var times = [2];
//,2,3,4,5,6]; // For debug


var artists_funcs = [gretchenandrew, sofiacrespo, disnovation, 
    jakeelwes, bengrosser, libbyheaney, joelsimon];

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
    chrome.alarms.create(artists_funcs[pos].name, alarm_info);
};

chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("Triggered:"+alarm.name);
    alarm_offset = Date.now() - alarm.scheduledTime;
    if (alarm.name === "pv" || alarm.name === "talk") {
        if (alarm_offset < 10800000) {
            liveWindow(alarm.name);
        }
    }
    else if (alarm_offset < 66000) {
        chrome.storage.local.set({last_triggered: alarm.name});
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
        titleWindow();
        update_icon_text();
    } else {
        console.log("Missed " + alarm.name);
        update_icon_text();
    }
    chrome.alarms.getAll(function(alarms) {
        alarms.forEach(function(saved_alarm) {
            if (saved_alarm.name === alarm.name) {
                alarm_time = new Date(saved_alarm.scheduledTime);
                console.log("Alarm: "+saved_alarm.name+", Next Time: "+alarm_time);
            }
        });
    });
});

var create_alarms = () => {
    chrome.alarms.clear("countdown");
    chrome.alarms.clearAll();
    // works
    for (i = 0; i < times.length; i++) {
        create_alarm(i);
    }
    // events
    var d = new Date();
    var n = d.getTimezoneOffset() / 60;
    var pv = new Date(Date.UTC(2020, 23, 7, 18 + n, 30));
    chrome.alarms.create("pv", {when:pv.getTime()});
    var talk = new Date(Date.UTC(2020, 6, 8, 19 + n, 00));
    chrome.alarms.create("talk", {when:talk.getTime()});
    // log
    chrome.alarms.getAll(function(alarms) {
        alarms.forEach(function(alarm) {
           alarm_time = new Date(alarm.scheduledTime);
           console.log("Alarm: "+alarm.name+", Time: "+alarm_time); 
        });
    });
 };

var update_icon_text = () => {
    chrome.alarms.getAll(function (alarms) {
        alarm_times = [];
        alarms.forEach(function(alarm) {
            if (alarm.name !== "countdown") {
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
                    var time_txt = " am";
                } else if (hour === 12) {
                  hour = "";
                  var time_txt = "Noon";
                } else {
                    hour -= 12;
                    var time_txt = " pm";
                }
                chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,1]});
                chrome.browserAction.setBadgeText({text:hour.toString()+time_txt});
//                chrome.alarms.create("countdown", {when: alarm.scheduledTime - 60000});
//                // Debug
//                chrome.alarms.get("countdown", function(alarm) {
//                    console.log(alarm.name + " - " + new Date(alarm.scheduledTime)); 
//                 });
                break;
            }        
        }
    });
 };
 
var icon_timer = async (time) => {
    var sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms)); };
    console.log("starting countdown");
    work_trigger = time + 59000;
    chrome.browserAction.setBadgeBackgroundColor({color:[1,0,0,1]});
    while (Date.now() < work_trigger) {
        let countdown = (work_trigger - Date.now()) / 100;
        let countdown_str = countdown.toString();
        console.log(countdown_str);
        chrome.browserAction.setBadgeText({text:countdown_str.slice(0,4)});
        await sleep(300);

    };
    chrome.browserAction.setBadgeBackgroundColor({color:[0,0,0,1]});
    console.log("timer complete");
};

    

// Icon timer overlay
update_icon_text();