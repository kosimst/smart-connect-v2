import { ThemeProvider } from '@emotion/react'
import { useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { lightTheme, darkTheme } from '../constants/theme'
import { DeviceDetailsProvider } from '../contexts/device-details/device-details'
import {
  IoBrokerConnectionContext,
  IoBrokerConnectionProvider,
} from '../contexts/iobroker-connection'
import { IoBrokerStatesProvider } from '../contexts/iobroker-states/iobroker-states'
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
        <IoBrokerConnectionProvider>
          <IoBrokerStatesProvider>
            <SettingsProvider>
              <DeviceDetailsProvider>
                <ShareTarget>
                  <App />
                </ShareTarget>
              </DeviceDetailsProvider>
            </SettingsProvider>
          </IoBrokerStatesProvider>
        </IoBrokerConnectionProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default Shell
