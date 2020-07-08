var work_info = {
    gretchenandrew:["Gretchen Andrew","The Next American President"],
    sofiacrespo:["Sofia Crespo x Dark Fractures","Artificial Remnants"],
    disnovation:["DISNOVATION.ORG","Predictive Art Bot"],
    jakeelwes:["Jake Elwes","Zizi - Queering the Dataset"],
    bengrosser:["Ben Grosser","Tracing You"],
    libbyheaney:["Libby Heaney","Elvis"],
    joelsimon:["Joel Simon", "Artbreeder"]
};

var all_artists_div = document.getElementById("all_artists");

chrome.alarms.getAll(function (alarms) {
    alarms.forEach(function(alarm) {
        let info = work_info[alarm.name];
        if (info !== undefined) {
            var spacer_div = document.createElement("div");
            spacer_div.classList.add("times-spacer");
            new_title_div = Object.assign(document.createElement("div"), {
               id:"popup-work-title", innerText: info[1]
            });
            all_artists_div.appendChild(new_title_div);
            new_artist_div = Object.assign(document.createElement("div"), {
               id:"popup-artist", innerText: info[0]
            });
            all_artists_div.appendChild(new_artist_div);
            new_time_div = Object.assign(document.createElement("div"), {
               id:"popup-time", innerText: new Date(alarm.scheduledTime)
            });
            all_artists_div.appendChild(new_time_div);
            all_artists_div.appendChild(spacer_div);
        }
    });
});

//Design close
let buttons = document.querySelectorAll('.close');

buttons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  {
      window.close();
  };
});