import { AnimatePresence } from 'framer-motion'
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
        <AnimatePresence>
          {isOffline && <OfflineOverlay />}
          {!connection && valid && <ConnectingOverlay />}
        </AnimatePresence>

        {valid ? <DevicesPage /> : <ConnectPage />}
      </Main>
    </>
  )
}

export default App
