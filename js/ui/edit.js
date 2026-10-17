/* Edición con ratón y táctil: arrastrar nota, mover vista, afinar */
let drag=null,pan=null;
const pos=e=>{const r=board.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
board.addEventListener('pointerdown',e=>{
  const[x,y]=pos(e),n=hit(x,y,e.pointerType==='touch'?10:0);
  sel=n;board.setPointerCapture(e.pointerId);
  if(n)drag={n,x,y,nc:n.nc,dt:n.dt};
  else pan={x:e.clientX,y:e.clientY,l:box.scrollLeft,t:box.scrollTop};
  draw();
});
board.addEventListener('pointermove',e=>{
  const[x,y]=pos(e);
  if(drag){
    if(!drag.p){pushH();drag.p=1}
    let nc=drag.nc-(y-drag.y)/rowH;
    if($('#snap').checked)nc=Math.round(nc);
    drag.n.nc=Math.max(lo,Math.min(hi,nc));
    drag.n.dt=Math.max(-drag.n.t0,drag.dt+(x-drag.x)/pps);
    draw();
  }else if(pan){box.scrollLeft=pan.l-(e.clientX-pan.x);box.scrollTop=pan.t-(e.clientY-pan.y)}
  else board.style.cursor=hit(x,y)?'grab':'default';
});
const endDrag=()=>{drag=null;pan=null};
board.addEventListener('pointerup',endDrag);board.addEventListener('pointercancel',endDrag);
board.addEventListener('dblclick',e=>{
  const[x,y]=pos(e),n=hit(x,y,e.pointerType==='touch'?10:0);
  if(n){pushH();n.nc=Math.round(n.c);draw()}
});
$('#fix').onclick=()=>{pushH();const a=$('#amt').value/100;notes.forEach(n=>n.nc=n.c+(Math.round(n.c)-n.c)*a);draw()};
$('#reset').onclick=()=>{pushH();notes.forEach(n=>{n.nc=n.c;n.dt=0});draw()};
$('#undo').onclick=undo;$('#redo').onclick=redo;
$('#zoom').oninput=e=>{pps=+e.target.value;layout()};
