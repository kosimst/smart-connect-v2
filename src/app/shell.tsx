import { ThemeProvider } from '@emotion/react'
import { FC } from 'react'
import { lightTheme } from '../constants/theme'
import { DeviceDetailsProvider } from '../contexts/device-details/device-details'
import { IoBrokerUrlProvider } from '../contexts/iobroker-url'
import { SocketClientProvider } from '../contexts/socket-client'
import ErrorBoundary from '../helpers/error-boundary'
import useNoContextMenu from '../hooks/use-no-context-menu'
import usePreventAlert from '../hooks/use-prevent-alert'
import App from './app'

const Shell: FC = () => {
  useNoContextMenu()
  usePreventAlert()

  return (
    <ErrorBoundary>
      <IoBrokerUrlProvider>
        <SocketClientProvider>
          <ThemeProvider theme={lightTheme}>
            <DeviceDetailsProvider>
              <App />
            </DeviceDetailsProvider>
          </ThemeProvider>
        </SocketClientProvider>
      </IoBrokerUrlProvider>
    </ErrorBoundary>
  )
}

export default Shell
