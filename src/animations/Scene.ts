import { Screen } from './particle/Screen'
import { Rocket } from './particle/Rocket'
import { textToPoints } from './particle/util'
import _ from 'lodash'
import { StringDataType } from './particle/types'

const maxTextWidth = 100

const multiplier = 1
export class Scene {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  screen: Screen
  rockets: Array<Rocket>
  tickCount: number
  launchDelay: number
  launchIndex: number
  lastLaunch: number
  textMode: boolean
  centerText = true
  running = false
  pointSize = 10
  goal: StringDataType | undefined
  lastRender = 0
  fps = 0
  lastUpdate = 0
  ups = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      throw Error('No context for canvas found')
    }
    this.ctx = ctx
    this.screen = new Screen(this.ctx)
    this.canvas.height = canvas.height
    this.rockets = []
    this.tickCount = 0
    this.launchDelay = 100

    this.lastLaunch = 0
    this.launchIndex = 0

    this.setPointSize(15)

    this.start()

    this.textMode = true
  }

  toggleCenterText = (toggle: boolean) => {
    this.centerText = toggle
  }

  start = () => {
    this.running = true
    requestAnimationFrame(this.tick)
  }

  stop = () => {
    this.running = false
  }

  setLaunchDelay = (amt: number) => {
    this.launchDelay = amt
  }

  setPointSize = (amt: number) => {
    this.pointSize = amt / 4
  }

  setSize = (w: number, h: number) => {
    this.canvas.width = w / multiplier
    this.canvas.height = h / multiplier
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true })
    if (ctx) {
      this.ctx = ctx
    }
    this.screen = new Screen(this.ctx)
  }

  setText = (text: string) => {
    const goal = textToPoints(text)
    if (!goal) {
      this.goal = { length: 0, letters: [] } as StringDataType
    } else {
      this.goal = goal
    }
  }

  launch = () => {
    const minX = 0.05 * this.canvas.width
    const minY = 0.05 * this.canvas.height

    const rocket = new Rocket({
      scene: this,
      type: Math.random() > 0.5 ? 'circle' : 'galaxy',
      x0: minX + Math.random() * (this.canvas.width - minX * 2),
      y0: this.canvas.height,
      x1: minX + Math.random() * (this.canvas.width - minX * 2),
      y1: minY + Math.random() * (this.canvas.height * 0.5),
    })
    this.rockets.push(rocket)
  }

  launchText = (index: number) => {
    const goal = this.goal
    if (!goal || goal.length === 0) {
      return
    }

    let minX = 0.05 * this.canvas.width
    const minY = 0.05 * this.canvas.height

    const pointSize = this.pointSize
    const spacing = pointSize
    let row = 0
    let xOff = 0
    let yOff = 0
    let rowHeight = 0

    if (this.centerText) {
      let totalWidth = 0
      for (let i = 0; i < goal.length; i++) {
        const letter = goal.letters[i]
        totalWidth += letter.width * pointSize + spacing
      }
      xOff = this.canvas.width / 2 - totalWidth / 2
      minX = 0
    }

    for (let i = 0; i < goal.length; i++) {
      const letter = goal.letters[i]
      if (letter.height > rowHeight) {
        rowHeight = letter.height
      }
      if (xOff + letter.width * pointSize > this.canvas.width - minX * 2) {
        xOff = 0
        row++
        yOff = row * spacing * rowHeight
      }
      if (i === index) {
        const data = {
          ...letter,
          spacing: this.pointSize,
        }
        const rocket = new Rocket({
          scene: this,
          type: 'letter',
          data,
          x0: minX + Math.random() * (this.canvas.width - minX * 2),
          y0: this.canvas.height,
          x1: minX + (letter.width / 2) * this.pointSize + xOff,
          y1: minY + (letter.height / 1.5) * this.pointSize + yOff,
        })
        this.rockets.push(rocket)
      }

      xOff += letter.width * pointSize + spacing
    }
  }

  tick = (timeStamp: number) => {
    if (performance.now() - this.lastUpdate >= 1000 / 60) {
      this.update()
    }
    this.render()
    this.tickCount++
    if (this.running) {
      requestAnimationFrame(this.tick)
    }
  }

  update = () => {
    if (this.lastUpdate) {
      this.ups = 1000 / (performance.now() - this.lastUpdate)
    }
    this.lastUpdate = performance.now()
    this.rockets = this.rockets.filter((r) => !r.isDead)
    if (
      performance.now() - this.lastLaunch > this.launchDelay &&
      this.fps > 60
    ) {
      this.lastLaunch = performance.now()
      if (this.textMode) {
        this.launchText(this.launchIndex)
        this.launchIndex++
        if (this.launchIndex > (this.goal?.length ?? 0)) {
          this.launchIndex = 0
        }
        this.textMode = false
      } else {
        this.launch()
        this.textMode = true
      }
    }

    this.rockets.forEach((r) => {
      r.tick()
    })
  }

  render = () => {
    if (this.lastRender) {
      this.fps = 1000 / (performance.now() - this.lastRender)
    }
    this.lastRender = performance.now()

    this.screen.clear()

    this.rockets.forEach((r) => {
      r.render(this.screen)
    })
    const minX = 0.05 * this.canvas.width
    const minY = 0.05 * this.canvas.height

    // this.screen.drawLine(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height)

    // this.screen.drawLine(minX, minY, this.canvas.width - minX, minY)
    // this.screen.drawLine(minX, minY, minX, this.canvas.height)
    // this.screen.drawLine(this.canvas.width - minX, minY, this.canvas.width - minX, this.canvas.height)
    this.displayStatus()
  }

  displayStatus = () => {
    this.ctx.font = '12px Arial'
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillText(`UPS: ${Math.floor(this.ups)}`, 10, 20)
    this.ctx.fillText(`FPS: ${Math.floor(this.fps)}`, 10, 40)
    this.ctx.fillText(`Rockets: ${this.rockets.length}`, 10, 60)

    const particles = this.rockets.reduce((acc, rocket) => {
      const sparks = rocket.exploded
        ? rocket.explosion?.sparks.reduce(
            (sum, spark) => sum + 1 + spark.history.length,
            0,
          )
        : rocket.tailLength + 1
      return acc + (sparks ?? 0)
    }, 0)

    this.ctx.fillText(`Particles: ${particles}`, 10, 80)
  }
}
