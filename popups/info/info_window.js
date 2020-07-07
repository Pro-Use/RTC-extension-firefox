var work_titles = {
    gretchenandrew:"Gretchen Andrew - The Next American President",
    sofiacrespo:"Sofia Crespo x Dark Fractures - Artificial Remnants",
    disnovation:"DISNOVATION.ORG - Predictive Art Bot",
    jakeelwes:"Jake Elwes - Zizi - Queering the Dataset",
    bengrosser:"Ben Grosser - Tracing You",
    libbyheaney:"Libby Heaney - Elvis",
    joelsimon:"Joel Simon - Artbreeder"
};

chrome.storage.local.get(['last_triggered'], function(result) {
     let last_triggered = result.last_triggered;
     console.log(last_triggered);
     if (last_triggered !== undefined) {
         document.getElementById(last_triggered).style.display = "block";
         document.title = work_titles[last_triggered];
     }
    var new_height = document.body.offsetHeight - window.innerHeight;
    console.log(new_height);
    if (new_height !== 0) {
       window.resizeBy(0, new_height);
    }
});

//Design close buttons
const buttons = document.querySelectorAll('.close');

buttons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  {
      window.close();
  };
});


