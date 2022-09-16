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
import deviceDefinitions from '../../constants/device-definitions'
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
  NoControlsHint,
  Section,
  Subtitle,
  TitleRow,
} from './styles'
import historyComponents from './history'

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

  const History = useMemo<FC<{ device: Device }> | null>(
    //  @ts-ignore
    () => (openedDevice ? historyComponents[openedDevice.type] || null : null),
    [openedDevice]
  )

  const hasHistory = !!History

  const isWindowSensor = openedDevice?.type === 'window-opened-sensor'

  const noControlsAvailable = !hasHistory && !Controls && !isWindowSensor

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
              marginTop: '40vh',
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
                  <History device={openedDevice} />
                </ControlsContainer>
              </Section>
            )}

            {isWindowSensor && (
              <Section>
                <Typography variant="h3">Associated devices</Typography>
                <WindowSensors device={openedDevice} />
              </Section>
            )}

            {noControlsAvailable && (
              <NoControlsHint variant="h3">
                This device provides no further controls or informations
              </NoControlsHint>
            )}
          </Card>
        )}
      </AnimatePresence>
    </>
  )
}

const useDeviceDetails = () => useContext(DeviceDetailsContext)

export default useDeviceDetails
