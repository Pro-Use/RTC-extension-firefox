var img = document.getElementById('image');
let container = document.getElementById('img_container');
let src = container.dataset.src;
console.log(src);
container.onload = function() {
    img.style.display = "block";
    var frame_width = img.offsetWidth - window.innerWidth;
    var frame_height = img.offsetHeight - window.innerHeight;
    window.resizeBy(frame_width,frame_height);
};
container.src = src;
