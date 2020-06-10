chrome.storage.local.get(['last_triggered'], function(result) {
     let last_triggered = result.last_triggered;
     console.log(last_triggered);
     if (last_triggered !== undefined) {
         let info_div = document.getElementById(last_triggered).style.display = "block";
     }
});


