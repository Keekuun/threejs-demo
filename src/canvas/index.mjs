import 'uno.css'

console.log('canvas')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const drawCircle = (ctx, cx, cy, r, color = 'blue') => {
  ctx.save()
  ctx.beginPath()

  ctx.strokeStyle = color
  // (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean)
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  ctx.closePath()
  ctx.restore()
}

drawCircle(ctx, 100, 100, 50)
drawCircle(ctx, 400, 400, 80, 'green')
