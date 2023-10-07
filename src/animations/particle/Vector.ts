export class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  copy = () => {
    return new Vector(this.x, this.y)
  }
  add = (v: Vector) => {
    this.x += v.x
    this.y += v.y
    return this
  }
  sub = (v: Vector) => {
    this.x -= v.x
    this.y -= v.y
    return this
  }
  mult = (amt: number) => {
    this.x *= amt
    this.y *= amt
    return this
  }
  div = (amt: number) => {
    this.x /= amt
    this.y /= amt
    return this
  }
  dist = (v: Vector) => {
    return v.copy().sub(this).mag()
  }
  mag = () => {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  magSq = () => {
    return this.x * this.x + this.y * this.y
  }
  normalize = () => {
    const m = this.mag()
    if (m > 0) {
      this.div(m)
    }
    return this
  }
  limit = (amt: number) => {
    const mSq = this.magSq()
    if (mSq > amt * amt) {
      this.div(Math.sqrt(mSq)).mult(amt)
    }
    return this
  }

  setMag = (amt: number) => {
    return this.normalize().mult(amt)
  }

  static div(v: Vector, amt: number) {
    return new Vector(v.x / amt, v.y / amt)
  }

  static sub(v1: Vector, v2: Vector) {
    const v3 = new Vector(v1.x - v2.x, v1.y - v2.y)
    return v3
  }
}
