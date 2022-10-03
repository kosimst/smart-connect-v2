import { FC } from 'react'
import useIoBrokerConnection from '../contexts/iobroker-connection'
import useIsOffline from '../hooks/use-is-offline'
import ConnectPage from '../pages/connect'
import DevicesPage from '../pages/devices'
import {
  ConnectingOverlay,
  OfflineOverlay,
} from './parts/no-connection-overlays'
import { Main } from './styles'

const App: FC = () => {
  const { valid, connection } = useIoBrokerConnection()
  const isOffline = useIsOffline()

  return (
    <>
      <Main>
        {connection && !isOffline ? (
          <DevicesPage />
        ) : isOffline ? (
          <OfflineOverlay />
        ) : valid ? (
          <ConnectingOverlay />
        ) : (
          <ConnectPage />
        )}
      </Main>
    </>
  )
}

export default App
