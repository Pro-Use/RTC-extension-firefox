var id = document.getElementById('video').getAttribute('data-video-id');
var pos = document.getElementById('video').getAttribute('data-video-pos');

var options = {
    background: true,
    id: id,
    loop: true,
    autopause: false,
    autoplay: true,
    responsive: true
};

var vimeo_embed = new Vimeo.Player('video', options);

if (pos) {
    vimeo_embed.setCurrentTime(pos).then(function(seconds) {
        console.log("Player seeked to " + seconds);
    }).catch(function(error) {
      switch (error.name) {
        case 'RangeError':
            // The time is less than 0 or greater than the video's duration
            break;

        default:
            // Some other error occurred
            break;
      }
    });
}