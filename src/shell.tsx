import { ThemeProvider } from '@emotion/react'
import { useMediaQuery } from '@mui/material'
import { FC } from 'react'
import App from './app'
import { darkTheme, lightTheme } from './constants/theme'
import { DeviceDetailsProvider } from './contexts/device-details/device-details'
import { IoBrokerConnectionProvider } from './contexts/iobroker-connection'
import { IoBrokerDevicesProvider } from './contexts/iobroker-devices'
import { IoBrokerStatesProvider } from './contexts/iobroker-states/iobroker-states'
import { SettingsProvider } from './contexts/settings'
import ShareTarget from './contexts/share-target'
import ErrorBoundary from './helpers/error-boundary'
import useNoContextMenu from './hooks/use-no-context-menu'
import usePreventAlert from './hooks/use-prevent-alert'

const Shell: FC = () => {
  useNoContextMenu()
  usePreventAlert()

  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const usedTheme = isDarkMode ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={usedTheme}>
      <ErrorBoundary>
        <IoBrokerConnectionProvider>
          <IoBrokerDevicesProvider>
            <IoBrokerStatesProvider>
              <SettingsProvider>
                <DeviceDetailsProvider>
                  <ShareTarget>
                    <App />
                  </ShareTarget>
                </DeviceDetailsProvider>
              </SettingsProvider>
            </IoBrokerStatesProvider>
          </IoBrokerDevicesProvider>
        </IoBrokerConnectionProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default Shell
