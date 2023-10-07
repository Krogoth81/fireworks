import * as React from 'react'
import { Box } from '@chakra-ui/react'
import { Outlet, Route, Routes } from 'react-router'
import { Fireworks } from './animations'

export const Root = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            width='100vw'
            maxWidth='100%'
            height='100vh'
          >
            <Outlet />
          </Box>
        }
      >
        <Route path='/' Component={Fireworks} />
      </Route>
    </Routes>
  )
}
