import { LetterType, StringDataType } from './types'

export const textToPoints = (text: string, fontSize = 20) => {
  if (!text) {
    return
  }
  const length = text.length

  // Create result object
  const result: StringDataType = {
    length,
    letters: [],
  }

  // Create the buffer canvas to be drawn to
  const canvas = document.createElement('canvas')
  const w = fontSize
  const h = fontSize * 2
  canvas.width = w
  canvas.height = h

  // Fetch the canvas 2d context
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return result
  }

  // Set font type (Default: Weight: 300, Size: 16px, Family: Arial)
  ctx.font = `300 ${fontSize}px Arial`

  // Set the color to pure red to compare with later
  ctx.fillStyle = '#f00'

  // Loop through each letter in the text and draw the current one
  for (let i = 0; i < length; i++) {
    // Create the letter object
    const letter: LetterType = {
      points: [],
      width: 4,
      height: 0,
    }

    // Clear the canvas for each letter
    ctx.clearRect(0, 0, w, h)

    // Draw the letter
    ctx.fillText(text.charAt(i), 0, fontSize)

    // Fetch the data array
    const data32 = new Uint32Array(ctx.getImageData(0, 0, w, h).data.buffer)

    // Loop through the points of the letter
    for (let j = 0; j < data32.length; j++) {
      // Only target the 'visible' ones
      if (data32[j] & 0xff000000) {
        const x = j % w
        const y = Math.floor(j / w)

        // Add points to the letter
        letter.points.push({ x, y })
        if (x > letter.width) {
          letter.width = x
        }
        if (y > letter.height) {
          letter.height = y
        }
      }
    }

    // Add letter to array
    result.letters.push(letter)
  }

  // Return the complete string
  return result
}
