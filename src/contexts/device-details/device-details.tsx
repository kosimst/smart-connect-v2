import { Typography } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import HistoryUi from '../../components/history-ui'
import deviceDefinitions from '../../constants/device-definitions'
import historyConfigs from '../../constants/history-configs'
import useHistories from '../../hooks/use-histories'
import useScrollLock from '../../hooks/use-scoll-lock'
import Device from '../../types/device'
import controls from './controls'
import Indicators from './indicators'
import WindowSensors from './special-sections/window-sensors'
import {
  Backdrop,
  Card,
  ControlsContainer,
  DetailsSeparator,
  FixedChildren,
  Section,
  Subtitle,
  TitleRow,
} from './styles'

type DeviceDetailsProviderProps = {
  children?: ReactNode
}

export const DeviceDetailsContext = createContext<{
  open(device: Device): void
}>({
  open: () => {},
})

export const DeviceDetailsProvider: FC<DeviceDetailsProviderProps> = ({
  children,
}) => {
  const [openedDevice, setOpenedDevice] = useState<Device | null>(null)
  const open = useCallback(
    (device: Device) => {
      setOpenedDevice(device)
    },
    [setOpenedDevice]
  )
  const close = useCallback(() => {
    setOpenedDevice(null)
  }, [setOpenedDevice])

  const deviceDefinition = useMemo(
    () => !!openedDevice && deviceDefinitions[openedDevice.type],
    [openedDevice]
  )

  const Controls = useMemo<FC<{ device: Device }> | null>(
    //  @ts-ignore
    () => (openedDevice ? controls[openedDevice.type] || null : null),
    [openedDevice]
  )

  // @ts-ignore
  const hasHistory = !!openedDevice && !!historyConfigs[openedDevice.type]

  const isWindowSensor = openedDevice?.type === 'window-opened-sensor'

  return (
    <>
      <FixedChildren>
        <AnimatePresence>
          {!!openedDevice && (
            <Backdrop
              onClick={close}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 0.5,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
            />
          )}
        </AnimatePresence>

        <DeviceDetailsContext.Provider value={{ open }}>
          {children}
        </DeviceDetailsContext.Provider>
      </FixedChildren>
      <AnimatePresence>
        {!!openedDevice && !!deviceDefinition && (
          <Card
            initial={{
              marginTop: '100vh',
            }}
            animate={{
              marginTop: '10vh',
            }}
            exit={{
              marginTop: '100vh',
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <TitleRow variant="h2">
              <span>{openedDevice.name || deviceDefinition.name}</span>
              {!isWindowSensor && <Indicators device={openedDevice} />}
            </TitleRow>
            <Typography variant="subtitle1">
              <span>
                {deviceDefinition.fullName}
                <DetailsSeparator>•</DetailsSeparator>
                {openedDevice.roomName || 'unset room'}
              </span>
            </Typography>

            {Controls && (
              <Section>
                <Typography variant="h3">Controls</Typography>

                <ControlsContainer>
                  <Controls device={openedDevice} />
                </ControlsContainer>
              </Section>
            )}

            {hasHistory && (
              <Section>
                <Typography variant="h3">History</Typography>

                <ControlsContainer>
                  <HistoryUi device={openedDevice} />
                </ControlsContainer>
              </Section>
            )}

            {isWindowSensor && (
              <Section>
                <Typography variant="h3">Associated devices</Typography>
                <WindowSensors device={openedDevice} />
              </Section>
            )}
          </Card>
        )}
      </AnimatePresence>
    </>
  )
}

const useDeviceDetails = () => useContext(DeviceDetailsContext)

export default useDeviceDetails
