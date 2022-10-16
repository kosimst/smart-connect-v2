import { FC } from 'react'
import App from './app'
import { DeviceDetailsProvider } from './contexts/device-details/device-details'
import { IoBrokerConnectionProvider } from './contexts/iobroker-connection'
import { IoBrokerDevicesProvider } from './contexts/iobroker-devices'
import { IoBrokerStatesProvider } from './contexts/iobroker-states/iobroker-states'
import { SettingsProvider } from './contexts/settings'
import ShareTarget from './contexts/share-target'
import { ThemeSwitcherProvider } from './contexts/theme-switcher/theme-switcher'
import ErrorBoundary from './helpers/error-boundary'
import useNoContextMenu from './hooks/use-no-context-menu'
import usePreventAlert from './hooks/use-prevent-alert'

const Shell: FC = () => {
  useNoContextMenu()
  usePreventAlert()

  return (
    <ThemeSwitcherProvider>
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
    </ThemeSwitcherProvider>
  )
}

export default Shell
