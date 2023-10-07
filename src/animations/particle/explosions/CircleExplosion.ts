import { Spark } from '../Spark'
import { Explosion } from './Explosion'
import { Screen } from '../Screen'
import { ExplosionProps } from '../types'

export class CircleExplosion extends Explosion {
  maxTicks: number
  opacity: number

  constructor(props: ExplosionProps) {
    super(props)

    const { size } = props

    this.maxTicks = 150 + Math.random() * 25
    this.radius = props.size

    this.opacity = 0

    const rand = Math.random()
    const circles = rand < 0.33 ? 4 : rand < 0.66 ? 3 : 2
    for (let ci = 0; ci < circles; ci++) {
      const angleStart = ci * 0.2
      const randomSpeed = Math.random()
      for (let i = 0; i < size / circles; i++) {
        const angle = angleStart + i * ((Math.PI * 2) / (size / circles))
        const x1 = Math.cos(angle) + this.centerX
        const y1 = Math.sin(angle) + this.centerY
        const spark = new Spark({
          x0: this.centerX,
          y0: this.centerY,
          x1: x1,
          y1: y1,
          maxSpeed: this.maxSpeed + randomSpeed * ci,
        })
        this.sparks.push(spark)
      }
    }
  }
  tick = () => {
    super.tick()
  }
  render = (screen: Screen) => {
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
    super.render(screen)
  }
}
