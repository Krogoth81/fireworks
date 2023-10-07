import { Particle } from './Particle'

export interface ColorType {
  r: number
  g: number
  b: number
  a?: number
}

const generateColorString = (col?: ColorType) => {
  const { r = 255, g = 255, b = 255, a = 255 } = col || {}
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export class Screen {
  ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  getWidth = () => {
    return this.ctx.canvas.width
  }
  getHeight = () => {
    return this.ctx.canvas.height
  }

  clear = () => {
    this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight())
  }

  drawArc = (x: number, y: number, r: number, col: ColorType) => {
    this.ctx.save()
    this.ctx.fillStyle = generateColorString(col)

    this.ctx.fillRect(Math.floor(x) - r, Math.floor(y) - r, r * 2, r * 2)
    this.ctx.restore()
  }

  drawCanvas = (
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    opacity = 1,
  ) => {
    if (opacity < 0) {
      return
    }
    this.ctx.save()
    this.ctx.globalAlpha = opacity
    this.ctx.drawImage(canvas, x, y)
    this.ctx.restore()
  }

  drawScreen = (x: number, y: number, screen: Screen) => {
    this.drawCanvas(screen.ctx.canvas, x, y)
  }

  draw = (element: Particle) => {
    const x = element.pos.x
    const y = element.pos.y
    const w = element.mass
    const col = element.col
    this.drawArc(x, y, w / 2, col)
  }

  drawLine = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    col?: ColorType,
  ) => {
    this.ctx.save()
    this.ctx.strokeStyle = generateColorString(col)
    this.ctx.beginPath()
    this.ctx.moveTo(Math.floor(x0), Math.floor(y0))
    this.ctx.lineTo(Math.floor(x1), Math.floor(y1))
    this.ctx.stroke()
    this.ctx.restore()
  }

  setPixel = (x0: number, y0: number, col: ColorType) => {
    this.ctx.save()
    this.ctx.fillStyle = generateColorString(col)
    this.ctx.fillRect(Math.floor(x0), Math.floor(y0), 1, 1)
    this.ctx.restore()
  }
}
