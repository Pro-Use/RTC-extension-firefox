var focused = true;
var timeout = null;
var stay = true;
var interval;
var timeout_alert = document.getElementById("timeout");
var seconds = document.getElementById("seconds");
var stay_button = document.getElementById("stay");

stay_button.onclick = function() {
    stay = true;
    timeout_alert.style.display = "none";
    clearInterval(interval);
    interval = null;
    seconds.innerHTML = 20;
};

function timer(callback) {
    timer_on = true;    
    timeout = setTimeout(function() {
            callback();
    }, 60000);
}

function timed_out(){
    if (! focused) {
//       alert("lost focus"); 
        stay = false;
        timeout_alert.style.display = "flex";
        var countdown = 20;
        interval = setInterval(function() {
            countdown -= 1;
            seconds.innerHTML = countdown;
            if (countdown === 0) {
                clearInterval(interval);
                if (! stay) {
                    window.close();
                } else {
                    seconds.innerHTML = 20;
                }
            }
        }, 1000);
        
    }
}

window.onblur = function(){
   focused = false;
   console.log("lost focus");
   timer(timed_out);
};

window.onfocus = function(){
  console.log("got focus");
  if (timeout !== null){
    clearTimeout(timeout);
  }
  timeout = null;
  focused = true;
};

