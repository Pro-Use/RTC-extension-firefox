function closeAll() {
    chrome.windows.getAll({}, function(windows) {
        var all_windows = [];
        windows.forEach(function(window) {
           all_windows.push(window.id); 
        });
        chrome.storage.local.get(['popups'], function(result) {
            let popups = result.popups;
            console.log("popups:"+popups);
            if (popups !== undefined) {
                popups.forEach( function (popup){
                    if (all_windows.includes(popup)) {
                        console.log("Removing " + popup);
                        chrome.windows.remove(popup); 
                    }
                });
            }
        });
        chrome.storage.local.get(['info_wid_id'], function(result) {
            let info_wid_id = result.info_wid_id;
            if (info_wid_id !== undefined && all_windows.includes(info_wid_id)) {
                chrome.windows.remove(info_wid_id);
            }
        });
        chrome.storage.local.set({popups: []});
    });
}

var close_all_button = document.getElementById("close_all");

close_all_button.onmousedown = () => closeAll();
