import { ThemeProvider } from '@emotion/react'
import { FC } from 'react'
import baseTheme from '../constants/theme'
import { DeviceDetailsProvider } from '../contexts/device-details/device-details'
import { IoBrokerProvider } from '../contexts/iobroker-context'
import { IoBrokerStatesProvider } from '../contexts/iobroker-states-context'
import { SettingsProvider } from '../contexts/settings'
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
            <SettingsProvider>
              <DeviceDetailsProvider>
                <App />
              </DeviceDetailsProvider>
            </SettingsProvider>
          </IoBrokerStatesProvider>
        </IoBrokerProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default Shell
