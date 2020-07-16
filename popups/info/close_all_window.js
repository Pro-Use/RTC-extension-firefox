function closeAll() {
    browser.windows.getAll({}, function(windows) {
        var all_windows = [];
        windows.forEach(function(window) {
           all_windows.push(window.id); 
        });
        browser.storage.local.get(['popups'], function(result) {
            let popups = result.popups;
            console.log("popups:"+popups);
            if (popups !== undefined) {
                popups.forEach( function (popup){
                    if (all_windows.includes(popup)) {
                        console.log("Removing " + popup);
                        browser.windows.remove(popup); 
                    }
                });
            }
        });
        browser.storage.local.get(['info_wid_id'], function(result) {
            let info_wid_id = result.info_wid_id;
            if (info_wid_id !== undefined && all_windows.includes(info_wid_id)) {
                browser.windows.remove(info_wid_id);
            }
        });
        browser.storage.local.set({popups: []});
        window.close();
    });
}

var close_all_button = document.getElementById("close_all");

close_all_button.onmousedown = () => closeAll();
