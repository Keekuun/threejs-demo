import 'uno.css'
import {
  checkInCircle,
  clearCanvas,
  drawCircle,
  getDistance,
  getMousePosition,
  getRealPosition
} from "@/canvas/util.mjs";
import {Config} from "@/canvas/config.mjs";

console.log('canvas')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let transformInfo = {
  dragStatus: Config.IDLE,
  dragTarget: null,
  // 0-圆 1-rect
  dragTargetType: -1,
  lastEventPos: {x: null, y: null},
  offsetEventPos: {x: null, y: null},

  scale: 1,
  scaleStep: 0.1,
  maxScale: 2,
  minScale: 0.5,
  offset: {x: 0, y: 0},


}

const circles = [
  {id: 1, x: 100, y: 100, r: 50, color: 'blue'},
  {id: 2, x: 200, y: 200, r: 60, color: 'red'},
  {id: 3, x: 400, y: 400, r: 80, color: 'green'},
]

function drawCircles() {
  circles.forEach(c => {
    drawCircle(ctx, c)
  })
}

drawCircles()
canvas.addEventListener('mousedown', (e) => {
  e.preventDefault()
  const realPos = getRealPosition(e, transformInfo)

  const circle = checkInCircle(realPos, circles)
  if (circle) {
    // 作用在圆上面
    console.log('set start drag circle:', circle)
    transformInfo = {
      ...transformInfo,
      dragStatus: Config.DRAG_START,
      lastEventPos: realPos,
      offsetEventPos: realPos,
      dragTarget: circle,
      dragTargetType: 0
    }
  }
})
canvas.addEventListener('mousemove', (e) => {
  e.preventDefault()
  const realPos = getRealPosition(e, transformInfo)

  const circle = checkInCircle(realPos, circles)
  if(circle) {
    ctx.canvas.style.cursor = 'move'
  } else {
    ctx.canvas.style.cursor = ''
  }

  if (transformInfo.dragStatus === Config.DRAG_START) {
    const distance = getDistance(realPos, transformInfo.lastEventPos)
    if (distance > 5) {
      console.log('dragging target:', transformInfo.dragTarget)
      // dragging
      transformInfo.dragStatus = Config.DRAGGING
      transformInfo.offsetEventPos = realPos
      console.log('start dragging: ', transformInfo.dragTarget)
    }
    return
  }

  if (transformInfo.dragStatus === Config.DRAGGING) {
    // reDraw
    const {dragTargetType, dragTarget} = transformInfo
    if (dragTargetType === 0) {
      dragTarget.x += (realPos.x - transformInfo.offsetEventPos.x)
      dragTarget.y += (realPos.y - transformInfo.offsetEventPos.y)

      // update circle pos
      circles.forEach(c => {
        if (c.id === dragTarget.id) {
          c.x = dragTarget.x
          c.y = dragTarget.y
        }
      })

      clearCanvas(ctx, canvas)
      drawCircles()

      transformInfo.offsetEventPos = realPos
    }
  }

})

canvas.addEventListener('mouseup', (e) => {
  e.preventDefault()
  if (transformInfo.dragStatus === Config.DRAGGING) {
    transformInfo = {
      ...transformInfo,
      dragStatus: Config.IDLE,
    }
    console.log('dragging end: ', transformInfo.dragTarget)
    ctx.canvas.style.cursor = ''
  }
})

canvas.addEventListener('wheel', (e) => {
  e.preventDefault()
  const mousePos = getMousePosition(e)
  // 怎么理解 ？
  const realPos = {
    x: mousePos.x - transformInfo.offset.x,
    y: mousePos.y - transformInfo.offset.y
  }

  const {scale, scaleStep, maxScale, minScale} = transformInfo
  const deltaX = realPos.x / scale * scaleStep
  const deltaY = realPos.y / scale * scaleStep

  if(e.wheelDelta > 0 && transformInfo.scale < maxScale) {
    console.log('up')
    transformInfo.offset.x -= deltaX
    transformInfo.offset.y -= deltaY
    transformInfo.scale += scaleStep
  } else if(e.wheelDelta <= 0 &&  transformInfo.scale > minScale) {
    console.log('down')
    transformInfo.offset.x += deltaX
    transformInfo.offset.y += deltaY
    transformInfo.scale -= scaleStep
  }
  /**
   * setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
   * a：水平缩放因子。
   * b：水平倾斜因子。
   * c：垂直倾斜因子。
   * d：垂直缩放因子。
   * e：水平偏移量。
   * f：垂直偏移量。
   * */
  ctx.setTransform(transformInfo.scale, 0, 0, transformInfo.scale, transformInfo.offset.x, transformInfo.offset.y)
  clearCanvas(ctx, canvas)
  drawCircles()
})
