/* Estado global y referencias al DOM */
const $=s=>document.querySelector(s);
const ac=new (window.AudioContext||window.webkitAudioContext)();
const NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const isBlack=m=>[1,3,6,8,10].includes(((m%12)+12)%12);
let buf=null,notes=[],sel=null,pps=120,lo=48,hi=72,rowH=16,playing=false,srcs=[],playT0=0,ph=null,raf=0;
const board=$('#board'),bx=board.getContext('2d'),keys=$('#keys'),kx=keys.getContext('2d'),box=$('#scroll');
