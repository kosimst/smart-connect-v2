import { FC } from 'react'
import useIoBrokerConnection from '../contexts/iobroker-connection'
import useIsOffline from '../hooks/use-is-offline'
import ConnectPage from '../pages/connect'
import DevicesPage from '../pages/devices'
import { Main } from './app-styles'

const App: FC = () => {
  const { valid, connection } = useIoBrokerConnection()
  const isOffline = useIsOffline()

  return (
    <>
      <Main>
        {connection ? (
          <DevicesPage />
        ) : valid ? (
          isOffline ? (
            <span>Offline</span>
          ) : (
            <span>Connecting...</span>
          )
        ) : (
          <ConnectPage />
        )}
      </Main>
    </>
  )
}

export default App
