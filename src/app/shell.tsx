import { ThemeProvider } from '@emotion/react'
import { useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { lightTheme, darkTheme } from '../constants/theme'
import { DeviceDetailsProvider } from '../contexts/device-details/device-details'
import { IoBrokerProvider } from '../contexts/iobroker-context'
import { IoBrokerStatesProvider } from '../contexts/iobroker-states-context'
import { SettingsProvider } from '../contexts/settings'
import ShareTarget from '../contexts/share-target'
import ErrorBoundary from '../helpers/error-boundary'
import useNoContextMenu from '../hooks/use-no-context-menu'
import usePreventAlert from '../hooks/use-prevent-alert'
import App from './app'

const Shell: FC = () => {
  useNoContextMenu()
  usePreventAlert()

  const isDarkMode = /*useMediaQuery('(prefers-color-scheme: dark)')*/ false

  const usedTheme = isDarkMode ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={usedTheme}>
      <ErrorBoundary>
        <IoBrokerProvider>
          <IoBrokerStatesProvider>
            <SettingsProvider>
              <DeviceDetailsProvider>
                <ShareTarget>
                  <App />
                </ShareTarget>
              </DeviceDetailsProvider>
            </SettingsProvider>
          </IoBrokerStatesProvider>
        </IoBrokerProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default Shell
