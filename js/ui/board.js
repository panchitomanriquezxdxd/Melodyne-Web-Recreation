/* Dibujo del piano roll y blobs */
const X=t=>t*pps,Y=m=>(hi-m+0.5)*rowH;
function layout(){
  const rows=hi-lo+1,avail=Math.max(200,box.clientHeight-2);
  rowH=Math.max(innerWidth<700?22:14,Math.floor(avail/rows));
  const dur=buf?buf.duration:4;
  board.width=Math.max(box.clientWidth,Math.ceil(dur*pps)+80);
  board.height=rows*rowH;keys.height=rows*rowH;
  draw();
}
function path(n,s){
  bx.beginPath();
  n.pts.forEach((p,i)=>{const px=X(p.t+n.dt),py=Y(p.m+s);i?bx.lineTo(px,py):bx.moveTo(px,py)});
}
function draw(){
  const w=board.width,h=board.height;
  bx.clearRect(0,0,w,h);kx.clearRect(0,0,56,h);
  for(let m=lo;m<=hi;m++){
    const y=(hi-m)*rowH,bl=isBlack(m);
    bx.fillStyle=bl?'#23272c':'#2b3037';bx.fillRect(0,y,w,rowH);
    bx.fillStyle='#343942';bx.fillRect(0,y+rowH-1,w,1);
    kx.fillStyle=bl?'#15181b':'#d8dce1';kx.fillRect(0,y,bl?36:56,rowH-1);
    if(!bl&&m%12===0){kx.fillStyle='#1d2024';kx.font='11px sans-serif';kx.fillText('C'+(Math.floor(m/12)-1),30,y+rowH-4)}
  }
  for(let s=0;s*pps<w;s++){bx.fillStyle='#343942';bx.fillRect(s*pps,0,1,h);bx.fillStyle='#8b929c';bx.font='11px sans-serif';bx.fillText(s+'s',s*pps+3,11)}
  bx.lineCap='round';bx.lineJoin='round';
  for(const n of notes){
    const s=n.nc-n.c;
    if(s!==0||n.dt!==0){
      const dt=n.dt;n.dt=0;bx.strokeStyle='rgba(242,169,59,.3)';bx.lineWidth=1.5;bx.setLineDash([4,4]);path(n,0);bx.stroke();bx.setLineDash([]);n.dt=dt;
    }
    bx.strokeStyle=n===sel?'#ffd27a':'#f2a93b';bx.lineWidth=rowH*0.72;path(n,s);bx.stroke();
    bx.strokeStyle='rgba(60,35,0,.6)';bx.lineWidth=1.5;path(n,s);bx.stroke();
    const r=Math.round(n.nc);bx.fillStyle='#e6e8eb';bx.font='10px sans-serif';
    bx.fillText(NAMES[((r%12)+12)%12]+(Math.floor(r/12)-1),X(n.t0+n.dt)+2,Y(n.pts[0].m+s)-rowH*0.5-2);
  }
  if(ph!=null){bx.fillStyle='#fff';bx.fillRect(X(ph),0,2,h)}
}
function hit(x,y,tol=0){
  for(let i=notes.length-1;i>=0;i--){
    const n=notes[i],s=n.nc-n.c;
    for(const p of n.pts)if(Math.abs(X(p.t+n.dt)-x)<=pps*0.025+6+tol&&Math.abs(Y(p.m+s)-y)<=rowH*0.5+tol)return n;
  }
  return null;
}
