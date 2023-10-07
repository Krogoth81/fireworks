import { Spark } from '../Spark'
import { Screen } from '../Screen'
import { ExplosionProps } from '../types'

let ID = 0

export class Explosion {
  tickCount: number
  radius: number
  id: number
  props: ExplosionProps
  trails: boolean
  sparks: Array<Spark>
  maxSpeed: number
  screen: Screen
  x: number
  y: number
  centerX: number
  centerY: number

  constructor(props: ExplosionProps) {
    const { rocket, x, y, size, trails } = props
    this.id = ID++
    this.props = props
    this.x = x
    this.y = y
    this.maxSpeed = props.maxSpeed || 2 + Math.random() * 2
    this.sparks = []
    this.trails = !!trails
    this.radius = 60
    this.tickCount = 0
    const canvas = document.createElement('canvas')
    canvas.width = this.radius * 4 * (props.maxSpeed ?? 1)
    canvas.height = this.radius * 4 * (props.maxSpeed ?? 1)
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    if (!ctx) {
      throw new Error('Could not get context from canvas')
    }
    this.screen = new Screen(ctx)
    this.centerX = this.screen.getWidth() / 2
    this.centerY = this.screen.getHeight() / 2
  }

  render(screen: Screen) {
    this.screen.clear()
    if (!this.trails || this.tickCount < 5) {
    }
    this.sparks.forEach((s) => {
      s.render(this.screen)
    })
    screen.drawScreen(
      this.x - this.screen.getWidth() / 2,
      this.y - this.screen.getHeight() / 2,
      this.screen,
    )
  }

  tick() {
    let left = Infinity
    let top = Infinity
    let right = -Infinity
    let bottom = -Infinity
    this.sparks.forEach((s) => {
      if (s.pos.x - s.mass < left) {
        left = s.pos.x - s.mass
      }
      if (s.pos.x + s.mass > right) {
        right = s.pos.x + s.mass
      }
      if (s.pos.y - s.mass < top) {
        top = s.pos.y - s.mass
      }
      if (s.pos.y + s.mass > bottom) {
        bottom = s.pos.y + s.mass
      }
      s.tick()
    })
    this.sparks = this.sparks.filter((o) => !o.isDead)
    this.tickCount++
  }

  isFinished() {
    return this.sparks.length === 0
  }
}
