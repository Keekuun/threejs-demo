import"./__uno-B4IWW7T5.js";const y=e=>{console.log("ctx",e),e.clearRect(0,0,e.canvas.width,e.canvas.height)},E=(e,{x:t,y:o,r:l,color:r="blue"})=>{console.log("drawCircle ctx",e),e.save(),e.beginPath(),e.strokeStyle=r,e.arc(t,o,l,0,Math.PI*2),e.stroke(),e.closePath(),e.restore()},i=e=>({x:e.offsetX,y:e.offsetY}),f=(e,t)=>{for(let o of t)if(u(o,e)<o.r)return o;return null},u=(e,t)=>Math.sqrt((e.x-t.x)**2+(e.y-t.y)**2),a={IDLE:0,DRAG_START:1,DRAGGING:2};console.log("canvas");const g=document.getElementById("canvas"),c=g.getContext("2d");let s={dragStatus:a.IDLE,dragTarget:null,dragTargetType:-1,lastEventPos:{x:null,y:null},offsetEventPos:{x:null,y:null}};const n=[{id:1,x:100,y:100,r:50,color:"blue"},{id:2,x:200,y:200,r:60,color:"red"},{id:3,x:400,y:400,r:80,color:"green"}];function v(){console.log("startDrawCircles",n),n.forEach(e=>{E(c,e)})}v();g.addEventListener("mousedown",e=>{const t=i(e),o=f(t,n);o&&(console.log("set start drag circle:",o),s={...s,dragStatus:a.DRAG_START,lastEventPos:t,offsetEventPos:t,dragTarget:o,dragTargetType:0})});g.addEventListener("mousemove",e=>{const t=i(e);if(f(t,n)?c.canvas.style.cursor="move":c.canvas.style.cursor="",s.dragStatus===a.DRAG_START){u(t,s.lastEventPos)>5&&(console.log("dragging target:",s.dragTarget),s.dragStatus=a.DRAGGING,s.offsetEventPos=t,console.log("start dragging: ",s.dragTarget));return}if(s.dragStatus===a.DRAGGING){const{dragTargetType:l,dragTarget:r}=s;l===0&&(r.x+=t.x-s.offsetEventPos.x,r.y+=t.y-s.offsetEventPos.y,n.forEach(d=>{d.id===r.id&&(d.x=r.x,d.y=r.y)}),console.log("circles",n),y(c),v(),s.offsetEventPos=t)}});g.addEventListener("mouseup",e=>{s.dragStatus===a.DRAGGING&&(s={...s,dragStatus:a.IDLE},console.log("dragging end: ",s.dragTarget),c.canvas.style.cursor="")});
