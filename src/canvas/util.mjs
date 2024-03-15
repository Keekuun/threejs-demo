export const clearCanvas = (ctx) => {
  console.log('ctx', ctx)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}
export const drawCircle = (ctx, {x, y, r, color = 'blue'}) => {
  console.log('drawCircle ctx', ctx)
  ctx.save()
  ctx.beginPath()

  ctx.strokeStyle = color
  // (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean)
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.stroke()

  ctx.closePath()
  ctx.restore()
}

export const getMousePosition = e => ({
  x: e.offsetX,
  y: e.offsetY
})

// 判断是否在圆中
export const checkInCircle = (pos, circles) => {
  for (let circle of circles) {
    if (getDistance(circle, pos) < circle.r) {
      return circle
    }
  }

  return null
}

export const getDistance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
