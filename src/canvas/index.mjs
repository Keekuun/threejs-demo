import 'uno.css'
import {checkInCircle, clearCanvas, drawCircle, getDistance, getMousePosition} from "@/canvas/util.mjs";
import {DRAG_CONFIG} from "@/canvas/DRAG_CONFIG.mjs";

console.log('canvas')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let dragInfo = {
  dragStatus: DRAG_CONFIG.IDLE,
  dragTarget: null,
  // 0-圆 1-rect
  dragTargetType: -1,
  lastEventPos: {x: null, y: null},
  offsetEventPos: {x: null, y: null}
}

const circles = [
  {id: 1, x: 100, y: 100, r: 50, color: 'blue'},
  {id: 2, x: 200, y: 200, r: 60, color: 'red'},
  {id: 3, x: 400, y: 400, r: 80, color: 'green'},
]

function startDrawCircles() {
  console.log('startDrawCircles', circles)
  circles.forEach(c => {
    drawCircle(ctx, c)
  })
}

startDrawCircles()
canvas.addEventListener('mousedown', (e) => {
  const mousePos = getMousePosition(e)
  const circle = checkInCircle(mousePos, circles)
  if (circle) {
    // 作用在圆上面
    console.log('set start drag circle:', circle)
    dragInfo = {
      ...dragInfo,
      dragStatus: DRAG_CONFIG.DRAG_START,
      lastEventPos: mousePos,
      offsetEventPos: mousePos,
      dragTarget: circle,
      dragTargetType: 0
    }
  }
})
canvas.addEventListener('mousemove', (e) => {
  const mousePos = getMousePosition(e)
  const circle = checkInCircle(mousePos, circles)
  if(circle) {
    ctx.canvas.style.cursor = 'move'
  } else {
    ctx.canvas.style.cursor = ''
  }
  if (dragInfo.dragStatus === DRAG_CONFIG.DRAG_START) {
    const distance = getDistance(mousePos, dragInfo.lastEventPos)
    if (distance > 5) {
      console.log('dragging target:', dragInfo.dragTarget)
      // dragging
      dragInfo.dragStatus = DRAG_CONFIG.DRAGGING
      dragInfo.offsetEventPos = mousePos
      console.log('start dragging: ', dragInfo.dragTarget)
    }
    return
  }

  if (dragInfo.dragStatus === DRAG_CONFIG.DRAGGING) {
    // reDraw
    const {dragTargetType, dragTarget} = dragInfo
    if (dragTargetType === 0) {
      dragTarget.x += (mousePos.x - dragInfo.offsetEventPos.x)
      dragTarget.y += (mousePos.y - dragInfo.offsetEventPos.y)

      circles.forEach(c => {
        if (c.id === dragTarget.id) {
          c.x = dragTarget.x
          c.y = dragTarget.y
        }
      })

      console.log('circles', circles)
      clearCanvas(ctx)
      startDrawCircles()

      dragInfo.offsetEventPos = mousePos
    }
  }

})

canvas.addEventListener('mouseup', (e) => {
  // console.log('mousemove', getMousePosition(e))
  if (dragInfo.dragStatus === DRAG_CONFIG.DRAGGING) {
    dragInfo = {
      ...dragInfo,
      dragStatus: DRAG_CONFIG.IDLE,
      // dragTarget: null,
      // dragType: -1,
      // lastEventPos: {x: null, y: null}
    }
    console.log('dragging end: ', dragInfo.dragTarget)
    ctx.canvas.style.cursor = ''
  }
})
