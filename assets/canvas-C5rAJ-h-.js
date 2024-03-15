import"./__uno-B4IWW7T5.js";const y=(e,s)=>{e.clearRect(0,0,s.width,s.height)},P=(e,{x:s,y:o,r:l,color:a="blue"})=>{console.log("drawCircle ctx",e),e.save(),e.beginPath(),e.strokeStyle=a,e.arc(s,o,l,0,Math.PI*2),e.stroke(),e.closePath(),e.restore()},S=e=>({x:e.offsetX,y:e.offsetY}),v=(e,s)=>({x:(e.offsetX-s.offset.x)/s.scale,y:(e.offsetY-s.offset.y)/s.scale}),x=(e,s)=>{for(let o of s)if(T(o,e)<o.r)return o;return null},T=(e,s)=>Math.sqrt((e.x-s.x)**2+(e.y-s.y)**2),r={IDLE:0,DRAG_START:1,DRAGGING:2,MOVE_START:3,MOVING:4};console.log("canvas");const c=document.getElementById("canvas"),n=c.getContext("2d");let t={dragStatus:r.IDLE,dragTarget:null,dragTargetType:-1,lastEventPos:{x:null,y:null},offsetEventPos:{x:null,y:null},scale:1,scaleStep:.1,maxScale:2,minScale:.5,offset:{x:0,y:0}};const g=[{id:1,x:100,y:100,r:50,color:"blue"},{id:2,x:200,y:200,r:60,color:"red"},{id:3,x:400,y:400,r:80,color:"green"}];function d(){g.forEach(e=>{P(n,e)})}d();c.addEventListener("mousedown",e=>{e.preventDefault();const s=v(e,t),o=x(s,g);o&&(console.log("set start drag circle:",o),t={...t,dragStatus:r.DRAG_START,lastEventPos:s,offsetEventPos:s,dragTarget:o,dragTargetType:0})});c.addEventListener("mousemove",e=>{e.preventDefault();const s=v(e,t);if(x(s,g)?n.canvas.style.cursor="move":n.canvas.style.cursor="",t.dragStatus===r.DRAG_START){T(s,t.lastEventPos)>5&&(console.log("dragging target:",t.dragTarget),t.dragStatus=r.DRAGGING,t.offsetEventPos=s,console.log("start dragging: ",t.dragTarget));return}if(t.dragStatus===r.DRAGGING){const{dragTargetType:l,dragTarget:a}=t;l===0&&(a.x+=s.x-t.offsetEventPos.x,a.y+=s.y-t.offsetEventPos.y,g.forEach(f=>{f.id===a.id&&(f.x=a.x,f.y=a.y)}),y(n,c),d(),t.offsetEventPos=s)}});c.addEventListener("mouseup",e=>{e.preventDefault(),t.dragStatus===r.DRAGGING&&(t={...t,dragStatus:r.IDLE},console.log("dragging end: ",t.dragTarget),n.canvas.style.cursor="")});c.addEventListener("wheel",e=>{e.preventDefault();const s=S(e),o={x:s.x-t.offset.x,y:s.y-t.offset.y},{scale:l,scaleStep:a,maxScale:f,minScale:E}=t,i=o.x/l*a,u=o.y/l*a;e.wheelDelta>0&&t.scale<f?(console.log("up"),t.offset.x-=i,t.offset.y-=u,t.scale+=a):e.wheelDelta<=0&&t.scale>E&&(console.log("down"),t.offset.x+=i,t.offset.y+=u,t.scale-=a),n.setTransform(t.scale,0,0,t.scale,t.offset.x,t.offset.y),y(n,c),d()});