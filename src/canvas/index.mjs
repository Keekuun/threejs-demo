import 'uno.css'
import {
  checkInCircle,
  clearCanvas,
  drawCircle,
  getDistance,
  getMousePosition,
  getRealPosition
} from "@/canvas/util.mjs";
import {CONFIG} from "@/canvas/config.mjs";

console.log('canvas')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let transformInfo = {
  status: CONFIG.IDLE,
  dragTarget: null,
  // 0-圆 1-rect
  dragTargetType: -1,
  lastEventPos: {x: null, y: null},
  offsetEventPos: {x: null, y: null},

  scale: 1,
  scaleStep: 0.1,
  maxScale: 4,
  minScale: 0.5,
  offset: {x: 0, y: 0},

  offsetMoveEventPos: {x: null, y: null},
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

// 禁止鼠标弹出菜单
canvas.oncontextmenu = e => {
  return false
}

canvas.addEventListener('mousedown', (e) => {
  e.preventDefault()
  e.stopPropagation()

  const realPos = getRealPosition(e, transformInfo)
  const circle = checkInCircle(realPos, circles)

  if (e.button === 0) {
    if (circle) {
      // 作用在圆上面
      console.log('set start drag circle:', circle)
      transformInfo.status = CONFIG.DRAG_START
      transformInfo.dragTargetType = 0
      transformInfo.dragTarget = circle
    }
  }

  // 监听鼠标右键事件
  if (e.button === 0) {
    console.log('监听鼠标右键事件')
    if (!circle) {
      transformInfo.status = CONFIG.MOVE_START
      transformInfo.offsetMoveEventPos = getMousePosition(e)
    }
  }

  transformInfo.lastEventPos = realPos
  transformInfo.offsetEventPos = realPos
})
canvas.addEventListener('mousemove', (e) => {
  e.preventDefault()
  const realPos = getRealPosition(e, transformInfo)

  const circle = checkInCircle(realPos, circles)
  if (circle) {
    ctx.canvas.style.cursor = 'grab'
  } else {
    ctx.canvas.style.cursor = ''
  }

  const distance = getDistance(realPos, transformInfo.lastEventPos)
  if (transformInfo.status === CONFIG.DRAG_START) {
    if (distance > 5) {
      console.log('dragging target:', transformInfo.dragTarget)
      // dragging
      transformInfo.status = CONFIG.DRAGGING
      transformInfo.offsetEventPos = realPos
      console.log('start dragging: ', transformInfo.dragTarget)
    }
    return
  }

  if (transformInfo.status === CONFIG.DRAGGING) {
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

    return
  }

  if (transformInfo.status === CONFIG.MOVE_START) {
    if (distance > 5) {
      console.log('move canvas:')
      // moving
      transformInfo.status = CONFIG.MOVING
      transformInfo.offsetEventPos = realPos
      transformInfo.offsetMoveEventPos = getMousePosition(e)
      ctx.canvas.style.cursor = 'move'
      return
    }
  }

  if (transformInfo.status === CONFIG.MOVING) {
    const mousePos = getMousePosition(e)
    ctx.canvas.style.cursor = 'move'
    transformInfo.offset.x += (mousePos.x - transformInfo.offsetMoveEventPos.x)
    transformInfo.offset.y += (mousePos.y - transformInfo.offsetMoveEventPos.y)
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
    transformInfo.offsetMoveEventPos = mousePos
  }
})

canvas.addEventListener('mouseup', (e) => {
  if (transformInfo.status === CONFIG.DRAGGING || transformInfo.status === CONFIG.MOVING) {
    transformInfo.status = CONFIG.IDLE
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

  if (e.wheelDelta > 0 && transformInfo.scale < maxScale) {
    console.log('up')
    transformInfo.offset.x -= deltaX
    transformInfo.offset.y -= deltaY
    transformInfo.scale += scaleStep
  } else if (e.wheelDelta <= 0 && transformInfo.scale > minScale) {
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
