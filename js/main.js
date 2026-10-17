/* Arranque, atajos de teclado y sincronía de scroll */
addEventListener('resize',layout);
box.addEventListener('scroll',()=>{keys.style.marginTop=-box.scrollTop+'px'});
addEventListener('keydown',e=>{
  if(e.target.matches('input'))return;
  const k=e.key.toLowerCase(),mod=e.ctrlKey||e.metaKey;
  if(mod&&k==='z'){e.preventDefault();e.shiftKey?redo():undo()}
  else if(mod&&k==='y'){e.preventDefault();redo()}
  else if(k===' '&&!e.target.matches('button')){e.preventDefault();$('#play').click()}
  else if(sel&&(k==='arrowup'||k==='arrowdown')){e.preventDefault();pushH();sel.nc+=k==='arrowup'?1:-1;draw()}
});
layout();
