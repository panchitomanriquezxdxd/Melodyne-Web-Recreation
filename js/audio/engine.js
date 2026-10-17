/* Reproducción, renderizado y exportación WAV */
function schedule(ctx,t0){
  const out=[];let end=0;
  for(const n of notes){
    const rate=2**((n.nc-n.c)/12),dur=n.t1-n.t0,d=dur/rate,st=t0+n.t0+n.dt;
    const s=ctx.createBufferSource(),g=ctx.createGain();
    s.buffer=buf;s.playbackRate.value=rate;
    g.gain.setValueAtTime(0,st);g.gain.linearRampToValueAtTime(1,st+0.012);
    g.gain.setValueAtTime(1,st+d-0.02);g.gain.linearRampToValueAtTime(0,st+d);
    s.connect(g).connect(ctx.destination);s.start(st,n.t0,dur);out.push(s);end=Math.max(end,n.t0+n.dt+d);
  }
  return{out,end};
}
function stop(){srcs.forEach(s=>{try{s.stop()}catch{}});srcs=[];playing=false;ph=null;cancelAnimationFrame(raf);$('#play').textContent='Reproducir';draw()}
$('#play').onclick=async()=>{
  if(playing)return stop();
  await ac.resume();playT0=ac.currentTime+0.05;
  const{out,end}=schedule(ac,playT0);srcs=out;playing=true;$('#play').textContent='Detener';
  const tick=()=>{
    ph=ac.currentTime-playT0;if(ph>end+0.1)return stop();
    const px=X(ph);if(px>box.scrollLeft+box.clientWidth-40)box.scrollLeft=px-40;
    draw();raf=requestAnimationFrame(tick);
  };
  tick();
};
function wav(ab){
  const d=ab.getChannelData(0),o=new DataView(new ArrayBuffer(44+d.length*2)),W=(i,s)=>[...s].forEach((c,k)=>o.setUint8(i+k,c.charCodeAt(0)));
  W(0,'RIFF');o.setUint32(4,36+d.length*2,true);W(8,'WAVEfmt ');o.setUint32(16,16,true);o.setUint16(20,1,true);o.setUint16(22,1,true);
  o.setUint32(24,ab.sampleRate,true);o.setUint32(28,ab.sampleRate*2,true);o.setUint16(32,2,true);o.setUint16(34,16,true);W(36,'data');o.setUint32(40,d.length*2,true);
  for(let i=0;i<d.length;i++)o.setInt16(44+i*2,Math.max(-1,Math.min(1,d[i]))*32767,true);
  return new Blob([o],{type:'audio/wav'});
}
$('#export').onclick=async()=>{
  const oc=new OfflineAudioContext(1,Math.ceil((buf.duration*2+1)*buf.sampleRate),buf.sampleRate);
  schedule(oc,0);const r=await oc.startRendering();
  const a=document.createElement('a');a.href=URL.createObjectURL(wav(r));a.download='melodyne-web.wav';a.click();
};
