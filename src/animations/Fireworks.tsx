import * as React from 'react'
import { Scene } from './Scene'
import {
  Box,
  Button,
  Checkbox,
  Input,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react'

export const Fireworks = () => {
  const [pointSize, setPointSize] = React.useState(20)
  const [launchDelay, setLaunchDelay] = React.useState(500)
  const [centerText, setCenterText] = React.useState(true)
  const [paused, setPaused] = React.useState(false)
  const [text, setText] = React.useState('Fireworks')
  const cpeRef = React.useRef<HTMLDivElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  const sceneRef = React.useRef<Scene>()

  React.useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setText(text)
    }
  }, [text])

  React.useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setPointSize(pointSize)
    }
  }, [pointSize])

  React.useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setLaunchDelay(launchDelay)
    }
  }, [launchDelay])

  React.useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.toggleCenterText(centerText)
    }
  }, [centerText])

  React.useEffect(() => {
    if (sceneRef.current) {
      if (paused) {
        sceneRef.current.stop()
      } else {
        sceneRef.current.start()
      }
    }
  }, [paused])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    console.log('Clicked!')
  }

  const updateDimensions = () => {
    if (sceneRef.current && canvasRef.current && cpeRef.current) {
      const w = cpeRef.current.getBoundingClientRect().width
      const h = cpeRef.current.getBoundingClientRect().height
      canvasRef.current.width = w
      canvasRef.current.height = h
      sceneRef.current.setSize(w, h)
    }
  }

  React.useLayoutEffect(() => {
    if (cpeRef.current && canvasRef.current) {
      window.addEventListener('resize', updateDimensions)
      sceneRef.current = new Scene(canvasRef.current)
      sceneRef.current.setText(text)
      sceneRef.current.toggleCenterText(centerText)
      sceneRef.current.setLaunchDelay(launchDelay)
      updateDimensions()

      return () => {
        window.removeEventListener('resize', updateDimensions)
        if (sceneRef.current) {
          sceneRef.current.stop()
        }
      }
    }
  }, [])

  return (
    <Box
      ref={cpeRef}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        background: 'black',
      }}
    >
      <Box
        border='2px solid black'
        borderRadius={5}
        position='absolute'
        bottom={10}
        left={10}
        width={250}
        zIndex={999}
        display='flex'
        flexFlow='column'
        gap={15}
        background='#AA777755'
        padding={25}
      >
        <Button
          variant='solid'
          colorScheme='blue'
          onClick={() => setPaused(!paused)}
        >
          {paused ? 'Resume' : 'Stop'}
        </Button>

        <Checkbox
          color='white'
          isChecked={centerText}
          onChange={(e) => setCenterText(e.target.checked)}
        >
          <b>Center text</b>
        </Checkbox>
        <Box>
          <Text color='white' variant='caption'>
            <b>Launch delay:</b>&nbsp;{launchDelay}ms
          </Text>
          <Slider
            defaultValue={launchDelay}
            step={50}
            min={50}
            max={1000}
            onChange={(value) => setLaunchDelay(value)}
            color='white'
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Box>
          <Text color='white' variant='caption'>
            <b>Font size:</b>&nbsp;{pointSize}
          </Text>
          <Slider
            defaultValue={pointSize}
            step={1}
            min={10}
            max={30}
            onChange={(value) => setPointSize(value)}
            color='white'
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Input
          type='text'
          size='md'
          background='white'
          variant='outline'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>

      <canvas
        onClick={handleClick}
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  )
}
