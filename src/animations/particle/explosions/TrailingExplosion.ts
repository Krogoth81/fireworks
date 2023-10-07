import { Spark } from '../Spark'
import { Explosion } from './Explosion'
import { Screen } from '../Screen'
import { ExplosionProps } from '../types'

export class TrailingExplosion extends Explosion {
  maxTicks: number
  opacity: number

  constructor(props: ExplosionProps) {
    super({ ...props })

    const { size } = props

    this.maxTicks = 150 + Math.random() * 25
    this.radius = props.size

    this.opacity = 0

    // const randy = Math.random()
    // // let col = {
    // //   r: Math.random() < 0.5 ? 255 : 0,
    // //   g: Math.random() < 0.5 ? 255 : 0,
    // //   b: Math.random() < 0.5 ? 255 : 0,
    // //   a: 255,
    // // }
    // // while (col.r === col.g && col.g === col.b) {
    // //   col = {
    // //     r: Math.random() < 0.5 ? 255 : 0,
    // //     g: Math.random() < 0.5 ? 255 : 0,
    // //     b: Math.random() < 0.5 ? 255 : 0,
    // //     a: 255,
    // //   }
    // // }
    // let col = { r: 0, g: 0, b: 0, a: 255 }
    // while (col.r === 0 && col.g === 0 && col.b === 0) {
    //   col = {
    //     r: Math.random() < 0.33 ? 255 : 0,
    //     g: Math.random() < 0.33 ? 255 : 0,
    //     b: Math.random() < 0.33 ? 255 : 0,
    //     a: 255,
    //   }
    // }

    // if (randy < 0.25) {
    // const maxSpeed = 2.5 + Math.random()

    for (let i = 0; i < size; i++) {
      const angle = Math.random() * (2 * Math.PI)
      const x1 = Math.cos(angle) + this.centerX
      const y1 = Math.sin(angle) + this.centerY
      const spark = new Spark({
        x0: this.centerX,
        y0: this.centerY,
        x1: x1,
        y1: y1,
        trails: this.trails,
        maxSpeed: Math.random() * 2,
        shouldSparkle: true,
      })
      this.sparks.push(spark)
    }
    // } else if (randy < 0.5) {
    //   for (let i = 0; i < size; i++) {
    //     const angle = Math.random() * (2 * Math.PI)
    //     const x1 = Math.cos(angle) + x
    //     const y1 = Math.sin(angle) + y
    //     const spark = new Spark({
    //       x0: x,
    //       y0: y,
    //       x1: x1,
    //       y1: y1,
    //       trails: this.trails,
    //       maxSpeed: Math.random() * 2,
    //     })
    //     this.sparks.push(spark)
    //   }
    // } else if (randy < 0.75) {

    // --- CIRCLES ---
    // const rand = Math.random()
    // const circles = rand < 0.33 ? 4 : rand < 0.66 ? 3 : 2
    // for (let ci = 0; ci < circles; ci++) {
    //   const angleStart = ci * 0.2
    //   const randomSpeed = Math.random()
    //   for (let i = 0; i < size / circles; i++) {
    //     const angle = angleStart + i * ((Math.PI * 2) / (size / circles))
    //     const x1 = Math.cos(angle) + this.centerX
    //     const y1 = Math.sin(angle) + this.centerY
    //     const spark = new Spark({
    //       x0: this.centerX,
    //       y0: this.centerY,
    //       x1: x1,
    //       y1: y1,
    //       maxSpeed: this.maxSpeed + randomSpeed * ci, //this.maxSpeed,
    //     })
    //     this.sparks.push(spark)
    //   }
    // }

    // } else {
    // for (let i = 0; i < size; i++) {
    //   const angle = Math.random() * (2 * Math.PI)
    //   const x1 = Math.cos(angle) + this.centerX
    //   const y1 = Math.sin(angle) + this.centerY
    //   const spark = new Spark({
    //     x0: this.centerX,
    //     y0: this.centerY,
    //     x1: x1,
    //     y1: y1,
    //     trails: this.trails,
    //     maxSpeed:
    //       Math.random() * Math.random() * Math.random() * this.maxSpeed +
    //       i / size,
    //   })
    //   this.sparks.push(spark)
    // }
    // }

    // --- STANDARD ---
    // for (let i = 0; i < size; i++) {
    //   const angle = 2 * Math.PI * (i / size)
    //   const spark = new Spark({
    //     angle,
    //     x0: 0,
    //     y0: 0,
    //     x1: this.radius * Math.random() * Math.cos(angle),
    //     y1: this.radius * Math.random() * Math.sin(angle),
    //     mass: 1,
    //     shouldSparkle: true,
    //     trails: this.trails,
    //     maxSpeed: this.maxSpeed * 1 * Math.random(),
    //     maxTicks: this.maxTicks,
    //     // col,
    //   })
    //   this.sparks.push(spark)
    // }
  }
  tick = () => {
    super.tick()
  }
  render = (screen: Screen) => {
    // if (!this.trails) {
    //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // }
    // if (this.tickCount < 5) {
    //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // }

    // this.sparks.forEach((s) => {
    //   s.render(screen)
    // this.ctx.fillStyle = `rgba(${s.col.r}, ${s.col.g}, ${s.col.b}, ${s.col.a})`
    // this.ctx.fillRect(
    //   Math.floor(this.canvas.width / 2 + s.pos.x - s.mass / 2),
    //   Math.floor(this.canvas.height / 2 + s.pos.y - s.mass / 2),
    //   Math.floor(s.mass),
    //   Math.floor(s.mass),
    // )
    // })

    const start = this.tickCount <= this.maxTicks * 0.3
    const middle =
      this.tickCount > this.maxTicks * 0.3 &&
      this.tickCount < this.maxTicks * 0.7
    const end = this.tickCount >= this.maxTicks * 0.7

    if (start) {
      this.opacity += 1 / (this.maxTicks * 0.3)
    } else if (middle) {
      this.opacity = 1
    } else if (end) {
      this.opacity -= 1 / (this.maxTicks * 0.3)
    }
    this.opacity = 1
    // this.screen.drawCanvas(
    //   this.canvas,
    //   this.props.x - this.radius * this.maxSpeed,
    //   this.props.y - this.radius * this.maxSpeed,
    //   this.opacity,
    // )

    // const LEFT = 0
    // const TOP = 0
    // const RIGHT = this.screen.ctx.canvas.width
    // const BOTTOM = this.screen.ctx.canvas.width
    // this.screen.drawLine(LEFT, TOP, RIGHT, TOP)
    // this.screen.drawLine(RIGHT, TOP, RIGHT, BOTTOM)
    // this.screen.drawLine(LEFT, TOP, LEFT, BOTTOM)
    // this.screen.drawLine(LEFT, BOTTOM, RIGHT, BOTTOM)
    super.render(screen)
  }
}
