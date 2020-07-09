var work_titles = {
    gretchenandrew:"Gretchen Andrew - The Next American President",
    sofiacrespo:"Sofia Crespo x Dark Fractures - Artificial Remnants",
    disnovation:"DISNOVATION.ORG - Predictive Art Bot",
    jakeelwes:"Jake Elwes - Zizi - Queering the Dataset",
    bengrosser:"Ben Grosser - Tracing You",
    libbyheaney:"Libby Heaney - Elvis",
    joelsimon:"Joel Simon - Artbreeder"
};
var new_width, new_height;
browser.storage.local.get(['last_triggered'], function(result) {
     let last_triggered = result.last_triggered;
     console.log(last_triggered);
     if (last_triggered !== undefined) {
         //document.getElementById(last_triggered).style.display = "block";
         title_div = document.getElementById("ctrl-title");
         title_div.textContent = work_titles[last_triggered];
         document.title = work_titles[last_triggered];
     }
    new_width = window.innerWidth - (document.getElementById("title").offsetWidth + 10);
    new_height = window.innerHeight - (document.getElementById("title").offsetHeight);
    console.log(new_width, new_height);
    const gettingCurrent = browser.tabs.getCurrent();
    gettingCurrent.then(function(tabInfo){
        var window_id = tabInfo.windowId;
        let gettingWindow = browser.windows.get(window_id);
        gettingWindow.then(function(window){
            let height = window.height - new_height;
            let width = window.width - new_width;
            browser.windows.update(window_id, {
                height: height,
                width: width
              });
        });
    });
});


//Design close buttons
const buttons = document.querySelectorAll('.close');

buttons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  {
      window.close();
  };
});

//Close after timeout

setTimeout(function(){ 
    window.close(); 
}, 5000);


