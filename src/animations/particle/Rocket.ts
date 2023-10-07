import { Vector } from './Vector'
import { Particle } from './Particle'
import {
  TextExplosion,
  CircleExplosion,
  GalaxyExplosion,
  TrailingExplosion,
} from './explosions'
import { Scene } from '../Scene'
import { Spark } from './Spark'
import { Explosion } from './explosions/Explosion'
import { Screen } from './Screen'
import { RocketProps, TextExplosionProps } from './types'

export class Rocket extends Particle {
  props: RocketProps
  scene: Scene
  sparks: Array<Spark>
  history: Array<{ x: number; y: number }>
  stage: number
  tailLength: number
  goal: Vector
  sparkAmount: number
  initialThrust: Vector
  thrust: Vector
  explosion: Explosion | undefined
  exploded = false
  fuel = 100
  maxFuel = 100
  isDead = false

  constructor(props: RocketProps) {
    super({ x0: props.x0, y0: props.y0 })
    const { scene, x1, y1 } = props
    this.props = props
    this.scene = scene
    this.maxSpeed = 0.5 + Math.random() * 2
    this.sparks = []
    this.history = []
    this.stage = 0
    this.tailLength = 10
    this.col = {
      r: 255,
      g: 230,
      b: 200,
      a: 255,
    }
    this.goal = new Vector(x1, y1)

    this.sparkAmount = 130
    this.mass = 2

    const desired = Vector.sub(new Vector(x1, y1), this.pos)
    this.maxSpeed += this.goal.dist(this.pos) / 250
    desired.setMag(this.maxSpeed)

    this.initialThrust = desired //new Vector(x1-x0, y1-y0)
    this.thrust = this.initialThrust.copy()
  }

  render = (screen: Screen) => {
    if (!this.explosion) {
      this.col.a = 100 + (this.fuel / this.maxFuel) * 155
      super.render(screen)
      if (this.history.length > 0) {
        this.history.forEach((h, i) => {
          screen.drawArc(h.x, h.y, (this.mass / 2) * (i / this.tailLength), {
            r: 255,
            g: 220,
            b: 150,
            a: 100 + (i / this.tailLength) * 155,
          })
        })
      }
    } else {
      this.explosion.render(screen)
    }
    // --- Shows target dot ---
    // screen.drawArc(this.goal.x, this.goal.y, 1, {
    //   r: 255,
    //   g: 255,
    //   b: 2555,
    //   a: 255,
    // })
  }

  explode = () => {
    this.exploded = true
    const baseProps = {
      rocket: this,
      x: this.pos.x,
      y: this.pos.y,
      size: Math.floor(this.sparkAmount),
    }

    switch (this.props.type) {
      case 'circle': {
        this.explosion = new CircleExplosion({
          ...baseProps,
          trails: false,
        })
        break
      }
      case 'galaxy': {
        this.explosion = new GalaxyExplosion({ ...baseProps, trails: false })
        break
      }
      case 'trailing': {
        this.explosion = new TrailingExplosion({
          ...baseProps,
          trails: true,
          maxSpeed: 15,
        })
        break
      }
      case 'letter': {
        const props: TextExplosionProps = {
          ...baseProps,
          data: this.props.data,
        }
        this.explosion = new TextExplosion(props)
        break
      }
    }
  }

  applyForce = (force: Vector) => {
    super.applyForce(force)
    this.vel.limit(this.maxSpeed)
  }

  tick = () => {
    super.tick()
    if (this.history.length > this.tailLength) {
      this.history.shift()
    }
    this.history.push({ x: this.pos.x, y: this.pos.y })

    if (this.explosion) {
      this.explosion.tick()
      if (this.explosion.isFinished()) {
        this.isDead = true
      }
    } else if (this.goal.dist(this.pos) < 2 * this.maxSpeed) {
      // || this.pos.y < this.scene.h * 0.1

      if (!this.explosion) {
        this.pos = this.goal
        this.acc.mult(0)
        this.vel.mult(0)
        this.explode()
      }
    } else {
      const f = this.thrust.copy().mult(1)
      this.applyForce(f)
    }

    if (this.tickCount > 5000) {
      this.isDead = true
    }
  }
}
