import { Screen } from './Screen'
import { Vector } from './Vector'
import { ParticleProps } from './types'

let ID = 0

interface ParticleColorType {
  r: number
  g: number
  b: number
  a?: number
}

export class Particle {
  maxSpeed: number
  id: number
  pos: Vector
  acc: Vector
  vel: Vector
  col: ParticleColorType
  mass: number
  tickCount: number
  gravity: Vector

  constructor({ x0, y0 }: ParticleProps) {
    this.maxSpeed = Infinity
    this.id = ID++
    this.pos = new Vector(x0, y0)
    this.acc = new Vector(0, 0)
    this.vel = new Vector(0, 0)
    this.col = {
      r: 255,
      g: 255,
      b: 255,
      a: 255,
    }
    this.mass = 2
    this.tickCount = 0
    this.gravity = new Vector(0, 0.002)
    // this.gravity = new Vector(0, 0)
  }

  render(screen: Screen) {
    screen.draw(this)
    // let size = Math.floor(this.mass)
    // let r = Math.floor(size/2)
    // for (let y = 0; y < size; y++) {
    //   for (let x = 0; x < size; x++) {
    //     if (Math.abs(x-r) + Math.abs(y-r) > r) continue
    //     let x0 = this.pos.x - r + x
    //     let y0 = this.pos.y - r + y
    //     screen.setPixel(x0, y0, this.col)
    //   }
    // }
  }

  move() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
  }

  applyForce(force: Vector) {
    if (!force) {
      return
    }
    const f = Vector.div(force, this.mass)
    this.acc.add(f)
  }

  tick() {
    this.tickCount++
    this.applyForce(this.gravity)
    this.vel.limit(this.maxSpeed)
    this.move()
    this.acc.mult(0)
  }
}
