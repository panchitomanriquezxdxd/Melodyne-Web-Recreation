/* Detección de tono (YIN) y segmentación en notas */
function yin(y,p,W,tMin,tMax,fs){
  const d=new Float32Array(tMax+2);let run=0;d[0]=1;
  for(let t=1;t<=tMax;t++){let s=0;for(let i=0;i<W;i++){const v=y[p+i]-y[p+i+t];s+=v*v}run+=s;d[t]=run?s*t/run:1}
  for(let t=tMin;t<tMax;t++){
    if(d[t]<0.15){
      while(t+1<tMax&&d[t+1]<d[t])t++;
      const a=d[t-1],b=d[t],c=d[t+1],den=a-2*b+c,sh=den?0.5*(a-c)/den:0;
      return fs/(t+sh);
    }
  }
  return null;
}
function analyze(b){
  const x=b.getChannelData(0),sr=b.sampleRate,D=2,n=Math.min(x.length,sr*60),m=Math.floor(n/D),y=new Float32Array(m);
  for(let i=0;i<m;i++){let s=0;for(let k=0;k<D;k++)s+=x[i*D+k];y[i]=s/D}
  const fs=sr/D,W=1024,H=512,tMin=Math.floor(fs/1000),tMax=Math.floor(fs/70),hop=H*D/sr,fr=[];
  for(let p=0;p+W+tMax<m;p+=H){
    let e=0;for(let i=0;i<W;i++)e+=y[p+i]*y[p+i];
    const rms=Math.sqrt(e/W),f=rms>0.01?yin(y,p,W,tMin,tMax,fs):null;
    fr.push({t:(p+W/2)*D/sr,m:f?69+12*Math.log2(f/440):null});
  }
  notes=[];let cur=null;
  const close=()=>{
    if(cur&&cur.pts.length>=3){
      const c=cur.sum/cur.pts.length;
      notes.push({t0:cur.pts[0].t-hop/2,t1:cur.pts[cur.pts.length-1].t+hop/2,pts:cur.pts,c,nc:c,dt:0});
    }
    cur=null;
  };
  for(const f of fr){
    if(f.m==null){close();continue}
    if(cur&&Math.abs(f.m-cur.sum/cur.pts.length)>0.9)close();
    if(!cur)cur={pts:[],sum:0};
    cur.pts.push({t:f.t,m:f.m});cur.sum+=f.m;
  }
  close();
  if(notes.length){
    const all=notes.map(n=>n.c);
    lo=Math.floor(Math.min(...all))-4;hi=Math.ceil(Math.max(...all))+4;
  }
  sel=null;hist.u=[];hist.r=[];layout();
  ['play','export','fix','reset'].forEach(i=>$('#'+i).disabled=!notes.length);
  $('#info').textContent=notes.length?notes.length+' notas detectadas':'No se detectaron notas con tono claro';
  $('#empty').style.display='none';
}
