var id = document.getElementById('video').getAttribute('data-video-id');
var video_div = document.getElementById('main');
var info_div = document.getElementById('info');

var options = {
    controls: false,
    id: id,
    loop: false,
    autopause: false,
    autoplay: true,
    responsive: true
};

var vimeo_embed = new Vimeo.Player('video', options);

vimeo_embed.on('ended', function(data) {
  video_div.style.display = "none";
  info_div.style.display = "flex";
});