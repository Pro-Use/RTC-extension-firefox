let current_node = null
const key2id = {}
const key2node = {}
const Graph = ForceGraph()(document.getElementById('graph'))
    .nodeCanvasObject(({ img, x, y, size }, ctx) => {
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, size/2, 0, 2 * Math.PI, false)
        ctx.clip()
        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        ctx.restore()
    })
    .graphData({ nodes: [], links: []})
    .backgroundColor('black')
    .linkColor(() => 'white')
    .linkWidth(1)
    .enableZoomPanInteraction(false)
    .d3Force('center', null)
    .zoom(8)

Graph.d3Force('link').strength(.03)
Graph.d3Force('charge').strength(0)

function add_img(image){
    const { nodes, links } = Graph.graphData()
    const id = nodes.length
    const img = new Image()
    if (image.generated) {
        img.src = `https://joels-share.s3.amazonaws.com/arebyte/imgs/${image.key}.jpeg`
    } else {
        img.src = `https://artbreeder.b-cdn.net/imgs/${image.key.split(':')[0]}.jpeg`
    }
    const updated_links = links.concat(image.links.map(k => ({
        source: id, target:key2id[k], // distance: 
    })))    
    Graph.graphData({
        links: updated_links,
        nodes: [...nodes, { id, img, ...image }]
    })
    const added_node = Graph.graphData().nodes[id]
    if (image.follow) {
        current_node = added_node
    }
    key2id[image.key] = id
    key2node[image.key] = added_node
    return id
}

function main(timeline) {
    Graph.centerAt(20, 200, 0)
    let current_step = -1
    const audio = document.querySelector('audio')
    audio.playbackRate = 1.0
    function step() {
        const t = audio.currentTime
        if (current_step < timeline.length-1 && t > timeline[current_step+1].t) {
            current_step++
            add_img(timeline[current_step])
            // console.log(timeline[current_step].username);
            // chrome.runtime.sendMessage(timeline[current_step].username)
            if (current_step >= timeline.length-2) {
                Graph.zoomToFit(4000, 20)
                Graph.enableZoomPanInteraction(true)
            } else {
                Graph.centerAt(current_node.fx, current_node.fy, 1000)
            }
        }
        window.requestAnimationFrame(step)
    }
    step()
}

fetch('https://joels-share.s3.amazonaws.com/arebyte/timeline.json')
    .then(resp => resp.json())
    .then(timeline => main(timeline))

window.onresize = () => {
    Graph.width(window.innerWidth)
    Graph.height(window.innerHeight)
}