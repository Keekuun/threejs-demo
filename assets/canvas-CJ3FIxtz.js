import"./__uno-DXsg3nlr.js";const y=(t,s)=>{t.clearRect(0,0,s.width,s.height)},G=(t,{x:s,y:o,r:c,color:a="blue"})=>{console.log("drawCircle ctx",t),t.save(),t.beginPath(),t.strokeStyle=a,t.arc(s,o,c,0,Math.PI*2),t.stroke(),t.closePath(),t.restore()},u=t=>({x:t.offsetX,y:t.offsetY}),x=(t,s)=>({x:(t.offsetX-s.offset.x)/s.scale,y:(t.offsetY-s.offset.y)/s.scale}),P=(t,s)=>{for(let o of s)if(T(o,t)<o.r)return o;return null},T=(t,s)=>Math.sqrt((t.x-s.x)**2+(t.y-s.y)**2),n={IDLE:0,DRAG_START:1,DRAGGING:2,MOVE_START:3,MOVING:4};console.log("canvas");const r=document.getElementById("canvas"),l=r.getContext("2d");let e={status:n.IDLE,dragTarget:null,dragTargetType:-1,lastEventPos:{x:null,y:null},offsetEventPos:{x:null,y:null},scale:1,scaleStep:.1,maxScale:4,minScale:.5,offset:{x:0,y:0},offsetMoveEventPos:{x:null,y:null}};const g=[{id:1,x:100,y:100,r:50,color:"blue"},{id:2,x:200,y:200,r:60,color:"red"},{id:3,x:400,y:400,r:80,color:"green"}];function v(){g.forEach(t=>{G(l,t)})}v();r.oncontextmenu=t=>!1;r.addEventListener("mousedown",t=>{t.preventDefault(),t.stopPropagation();const s=x(t,e),o=P(s,g);t.button===0&&o&&(console.log("set start drag circle:",o),e.status=n.DRAG_START,e.dragTargetType=0,e.dragTarget=o),t.button===0&&(console.log("监听鼠标右键事件"),o||(e.status=n.MOVE_START,e.offsetMoveEventPos=u(t))),e.lastEventPos=s,e.offsetEventPos=s});r.addEventListener("mousemove",t=>{t.preventDefault();const s=x(t,e);P(s,g)?l.canvas.style.cursor="grab":l.canvas.style.cursor="";const c=T(s,e.lastEventPos);if(e.status===n.DRAG_START){c>5&&(console.log("dragging target:",e.dragTarget),e.status=n.DRAGGING,e.offsetEventPos=s,console.log("start dragging: ",e.dragTarget));return}if(e.status===n.DRAGGING){const{dragTargetType:a,dragTarget:f}=e;a===0&&(f.x+=s.x-e.offsetEventPos.x,f.y+=s.y-e.offsetEventPos.y,g.forEach(i=>{i.id===f.id&&(i.x=f.x,i.y=f.y)}),y(l,r),v(),e.offsetEventPos=s);return}if(e.status===n.MOVE_START&&c>5){console.log("move canvas:"),e.status=n.MOVING,e.offsetEventPos=s,e.offsetMoveEventPos=u(t),l.canvas.style.cursor="move";return}if(e.status===n.MOVING){const a=u(t);l.canvas.style.cursor="move",e.offset.x+=a.x-e.offsetMoveEventPos.x,e.offset.y+=a.y-e.offsetMoveEventPos.y,l.setTransform(e.scale,0,0,e.scale,e.offset.x,e.offset.y),y(l,r),v(),e.offsetMoveEventPos=a}});r.addEventListener("mouseup",t=>{(e.status===n.DRAGGING||e.status===n.MOVING)&&(e.status=n.IDLE,l.canvas.style.cursor="")});r.addEventListener("wheel",t=>{t.preventDefault();const s=u(t),o={x:s.x-e.offset.x,y:s.y-e.offset.y},{scale:c,scaleStep:a,maxScale:f,minScale:i}=e,d=o.x/c*a,E=o.y/c*a;t.wheelDelta>0&&e.scale<f?(console.log("up"),e.offset.x-=d,e.offset.y-=E,e.scale+=a):t.wheelDelta<=0&&e.scale>i&&(console.log("down"),e.offset.x+=d,e.offset.y+=E,e.scale-=a),l.setTransform(e.scale,0,0,e.scale,e.offset.x,e.offset.y),y(l,r),v()});
