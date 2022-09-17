import { FC } from 'react'
import DevicesPage from '../pages/devices'
import { Main } from './app-styles'

const App: FC = () => {
  return (
    <>
      <Main>
        <DevicesPage />
      </Main>
    </>
  )
}

export default App
