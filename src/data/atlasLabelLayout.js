// Screen-pixel placement for one extension caption. Geographic anchors never move.
export function labelEdge([x, y], box) {
  const cx = (box.left + box.right) / 2, cy = (box.top + box.bottom) / 2
  const dx = x - cx, dy = y - cy
  const ratio = Math.max(Math.abs(dx) / ((box.right - box.left) / 2), Math.abs(dy) / ((box.bottom - box.top) / 2))
  return ratio <= 1 ? null : [cx + dx / ratio, cy + dy / ratio]
}
export function segmentsCross(a, b, c, d) {
  const side = (p,q,r) => (q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0])
  return side(a,b,c)*side(a,b,d)<0 && side(c,d,a)*side(c,d,b)<0
}
export function placeCaption({ anchor, size, bounds, obstacles, lines = [] }) {
  const [w,h] = size, [bw,bh] = bounds
  const candidates = []
  for (const dy of [-28,28,-52,52,-76,76,0]) for (const dx of [0,-28,28,-52,52,-76,76]) {
    const x = Math.max(w/2+14,Math.min(bw-w/2-14,anchor[0]+dx))
    const y = Math.max(h/2+14,Math.min(bh-h/2-14,anchor[1]+dy))
    const box = {left:x-w/2,right:x+w/2,top:y-h/2,bottom:y+h/2}
    const overlaps = obstacles.filter(b => box.right+5>b.left && box.left-5<b.right && box.bottom+5>b.top && box.top-5<b.bottom).length
    const end = labelEdge(anchor,box)
    const crosses = end ? lines.filter(([a,b]) => segmentsCross(anchor,end,a,b)).length : 0
    const distance = Math.hypot(x-anchor[0],y-anchor[1])
    // Avoid text collisions first, then crossed roads/leaders, then displacement.
    candidates.push({point:[x,y],score:overlaps*100000+crosses*1000+distance})
  }
  return candidates.sort((a,b)=>a.score-b.score)[0].point
}
