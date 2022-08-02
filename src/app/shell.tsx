import { ThemeProvider } from '@emotion/react'
import { FC } from 'react'
import baseTheme, { lightTheme } from '../constants/theme'
import { DeviceDetailsProvider } from '../contexts/device-details/device-details'
import { IoBrokerProvider } from '../contexts/iobroker-context'
import { IoBrokerStatesProvider } from '../contexts/iobroker-states-context'
import ErrorBoundary from '../helpers/error-boundary'
import useNoContextMenu from '../hooks/use-no-context-menu'
import usePreventAlert from '../hooks/use-prevent-alert'
import App from './app'

const Shell: FC = () => {
  useNoContextMenu()
  usePreventAlert()

  return (
    <ThemeProvider theme={baseTheme}>
      <ErrorBoundary>
        <IoBrokerProvider>
          <IoBrokerStatesProvider>
            <ThemeProvider theme={lightTheme}>
              <DeviceDetailsProvider>
                <App />
              </DeviceDetailsProvider>
            </ThemeProvider>
          </IoBrokerStatesProvider>
        </IoBrokerProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default Shell
