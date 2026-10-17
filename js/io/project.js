/* Guardar y abrir proyectos (.json con audio y notas) */
$('#save').onclick=async()=>{
  if(!buf)return;
  const url=await new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(wav(buf))});
  const data={v:1,audio:url,notes:notes.map(({t0,t1,pts,c,nc,dt})=>({t0,t1,pts,c,nc,dt}))};
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));
  a.download='proyecto.melodyne.json';a.click();
};
$('#open').onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  try{
    const d=JSON.parse(await f.text());stop();
    buf=await ac.decodeAudioData(await(await fetch(d.audio)).arrayBuffer());
    notes=d.notes;sel=null;hist.u=[];hist.r=[];pps=+$('#zoom').value;
    if(notes.length){const c=notes.map(n=>n.c);lo=Math.floor(Math.min(...c))-4;hi=Math.ceil(Math.max(...c))+4}
    ['play','export','fix','reset'].forEach(i=>$('#'+i).disabled=!notes.length);
    $('#empty').style.display='none';$('#info').textContent=notes.length+' notas · proyecto cargado';layout();
  }catch{$('#info').textContent='El archivo no es un proyecto válido'}
  e.target.value='';
};
