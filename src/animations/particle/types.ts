import { Scene } from '../Scene'
import { Rocket } from './Rocket'

export interface LetterType {
  points: Array<{
    x: number
    y: number
  }>
  width: number
  height: number
  spacing?: number
}

export interface StringDataType {
  length: number
  letters: Array<LetterType>
}

export type RocketType = 'letter' | 'circle' | 'globe' | 'trailing'

export type RocketProps = {
  type: RocketType
  scene: Scene
  x0: number
  y0: number
  x1: number
  y1: number
} & (
  | { type: 'letter'; data: LetterType }
  | { type: Exclude<RocketType, 'letter'>; data?: never }
)

export interface ExplosionProps {
  rocket: Rocket
  x: number
  y: number
  size: number
  trails?: boolean
  maxSpeed?: number
}

export interface TextExplosionProps extends ExplosionProps {
  data: LetterType
}
