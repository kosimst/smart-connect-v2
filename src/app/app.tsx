import { FC } from 'react'
import Toast from '../components/toast'
import DevicesPage from '../pages/devices'
import { Main } from './app-styles'

const App: FC = () => {
  return (
    <>
      <Main>
        <DevicesPage />
      </Main>
      {/* <Toast type="error" visible>
        Not connected to ioBroker
      </Toast> */}
    </>
  )
}

export default App
