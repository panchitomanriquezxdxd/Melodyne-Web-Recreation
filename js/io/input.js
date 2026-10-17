/* Entrada de audio: archivo, micrófono y ejemplo */
async function loadBlob(b){stop();buf=await ac.decodeAudioData(await b.arrayBuffer());pps=+$('#zoom').value;analyze(buf)}
$('#file').onchange=e=>e.target.files[0]&&loadBlob(e.target.files[0]);
let mr=null;
$('#rec').onclick=async()=>{
  const b=$('#rec');
  if(mr){mr.stop();return}
  try{
    const st=await navigator.mediaDevices.getUserMedia({audio:true}),ch=[];
    mr=new MediaRecorder(st);mr.ondataavailable=e=>ch.push(e.data);
    mr.onstop=()=>{st.getTracks().forEach(t=>t.stop());mr=null;b.classList.remove('on');b.textContent='Grabar voz';loadBlob(new Blob(ch))};
    mr.start();b.classList.add('on');b.textContent='Detener grabación';
  }catch{$('#info').textContent='No se pudo acceder al micrófono'}
};
$('#demo').onclick=()=>{
  const sr=44100,seq=[[60,.1],[62,-.35],[64,.2],[65,-.1],[67,.4],[64,-.3],[60,.15]],len=sr*.55;
  const b=ac.createBuffer(1,Math.ceil(seq.length*len+sr*.2),sr),d=b.getChannelData(0);
  seq.forEach(([m,off],k)=>{
    const f=440*2**((m+off-69)/12),s0=Math.floor(k*len+sr*.1),n=Math.floor(len*.85);let p=0;
    for(let i=0;i<n;i++){
      p+=2*Math.PI*f*(1+0.004*Math.sin(i/sr*30))/sr;
      const env=Math.min(1,i/(sr*.03))*Math.min(1,(n-i)/(sr*.05));
      d[s0+i]+=env*0.25*(Math.sin(p)+.5*Math.sin(2*p)+.3*Math.sin(3*p)+.15*Math.sin(4*p));
    }
  });
  stop();buf=b;pps=+$('#zoom').value;analyze(buf);
};
