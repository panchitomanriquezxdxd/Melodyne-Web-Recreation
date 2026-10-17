/* Deshacer / rehacer (guarda tono y posición de cada nota) */
const hist={u:[],r:[]};
const snapNotes=()=>notes.map(n=>[n.nc,n.dt]);
function pushH(){hist.u.push(snapNotes());if(hist.u.length>100)hist.u.shift();hist.r=[]}
function applyS(s){s.forEach((v,i)=>{notes[i].nc=v[0];notes[i].dt=v[1]});draw()}
function undo(){if(!hist.u.length)return;hist.r.push(snapNotes());applyS(hist.u.pop())}
function redo(){if(!hist.r.length)return;hist.u.push(snapNotes());applyS(hist.r.pop())}
