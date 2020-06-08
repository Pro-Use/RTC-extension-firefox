
var popups = [];


// Clear Window cache on load
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.remove("popups", function () {
        console.log("Cleared popup cache");
    });
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
      port.onMessage.addListener(function(msg) {
           console.log("message recieved: " + msg);
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
        optionsDictionary.top = dims[1];
        optionsDictionary.width = dims[2];
        optionsDictionary.height = dims[3];

    }
    return new Promise((resolve, reject) => {
        try {
            chrome.windows.create(optionsDictionary, function (newWindow) {
              if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                else {
                  let new_id = newWindow.id;
                  chrome.windows.get(new_id, function (wid) {
                    if (fullscreen && wid.state != "fullscreen") {
                      console.log("window not fullscreen but should be...");
                      chrome.windows.update(new_id, {state: "fullscreen"});
                    }
                  });
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
  let dims = [0,0,window.screen.availWidth, window.screen.availHeight];
  let id = await openWindow(dims, false,"https://darkfractures.com/example/index.html");
  storePopupID(id);
};

disnovation = async() => {
  let dims = [0,0,window.screen.availWidth, window.screen.availHeight];
  let id = await openWindow(dims, false,"http://predictiveartbot.com/");
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
  let id = await openWindow(dims, false,"https://tracingyou.bengrosser.com");
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
    }
    ;
    openMultiple(dims_array, url_array);

};

