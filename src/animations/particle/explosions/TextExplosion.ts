import { Spark } from '../Spark'
import { TextExplosionProps } from '../types'
import { Explosion } from './Explosion'

export class TextExplosion extends Explosion {
  sparks: Array<Spark>

  constructor(props: TextExplosionProps) {
    super(props)

    const { data } = props
    const w = data?.width || 10
    const h = data?.height || 10
    const midX = w / 2
    const midY = h / 1.5
    const points = data?.points ?? []
    const spacing = data?.spacing ?? 20

    for (let i = 0; i < points.length; i++) {
      const p = points[i % points.length]
      const s = spacing ?? 20
      const spark = new Spark({
        ignorePhysics: true,
        x0: this.centerX,
        y0: this.centerY,
        x1: this.centerX + p.x * s - midX * s + (-0.5 * s + Math.random() * s),
        y1: this.centerY + p.y * s - midY * s + (-0.5 * s + Math.random() * s),
        trails: this.trails,
        maxSpeed: Math.random() * 1.5,
      })

      this.sparks.push(spark)
    }
  }
}
