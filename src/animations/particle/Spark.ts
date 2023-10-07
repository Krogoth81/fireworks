import { Particle } from './Particle'
import { Screen, ColorType } from './Screen'
import { Vector } from './Vector'

export class Spark extends Particle {
  shouldSparkle: boolean
  sparkle: boolean
  goal: Vector
  mass: number
  isDead: boolean
  maxSpeed: number
  col: ColorType
  maxTicks: number
  ignorePhysics: boolean
  trails: boolean
  history: Array<{ x: number; y: number }> = []

  constructor({ x0, y0, ...args }) {
    super(x0, y0)

    this.shouldSparkle = true
    this.goal = new Vector(args.x1, args.y1)
    // this.dots = []
    this.mass = 1
    // this.size = Math.random() < 0.95 ? 1 : 2
    this.isDead = false
    // if (Math.random() < 0.3)
    this.maxSpeed = 2 * Math.random()

    this.col = {
      r: 50 * Math.random() + 205,
      g: 100 * Math.random() + 155,
      b: 100 * Math.random() + 100,
      a: 255,
    }
    // this.col = {
    //   r: 255,
    //   g: 255,
    //   b: 255,
    //   a: 255
    // }
    // this.col = {
    //   r: 255 * Math.random(),
    //   g: 255 * Math.random(),
    //   b: 255 * Math.random(),
    //   a: 255,
    // }
    const dir = Vector.sub(this.goal, this.pos)
    dir.normalize()
    dir.mult(6)
    this.vel = dir

    this.maxTicks = 150 + Math.random() * 25
    Object.keys(args).forEach((o) => {
      this[o] = args[o]
    })
  }
  move = () => {
    if (this.tickCount % 10 === 0) {
      // this.history.push({ x: this.pos.x, y: this.pos.y })
    }
    if (this.shouldSparkle && this.vel.mag() < this.maxSpeed * 2) {
      if (Math.random() < 0.03) {
        this.sparkle = true
      }
    }
    if (this.sparkle) {
      this.col.a = Math.random() < 0.8 ? 255 : 0
    }

    if (this.ignorePhysics) {
      if (this.pos.dist(this.goal) > this.maxSpeed * 2) {
        const dir = Vector.sub(this.goal, this.pos)
        dir.normalize()
        this.applyForce(dir)
        super.move()
      }
    } else {
      super.move()
    }
  }
  render = (screen: Screen) => {
    screen.draw(this)
  }

  tick = () => {
    const friction = this.vel.copy().mult(-1 * 0.05)
    this.applyForce(friction)
    super.tick()
    if (this.tickCount > this.maxTicks) {
      this.isDead = true
    }
  }
}
