var id = document.getElementById('video').getAttribute('data-video-id');
var pos = document.getElementById('video').getAttribute('data-video-pos');
var video_div = document.getElementById('main');

var options = {
    background: true,
    id: id,
    loop: true,
    autopause: false,
    autoplay: true,
    responsive: true
};

var vimeo_embed = new Vimeo.Player('video', options);

vimeo_embed.on('loadstart', function(data) {
    var new_height = video_div.offsetHeight - window.innerHeight;
    if (new_height > 0) {
        window.resizeBy(0, new_height);
        vimeo_embed.off('loadstart');
    }
});

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