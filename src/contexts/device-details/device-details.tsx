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
import useScrollLock from '../../hooks/use-scoll-lock'
import Device from '../../types/device'
import controls from './controls'
import Indicators from './indicators'
import {
  Backdrop,
  Card,
  ControlsContainer,
  DetailsSeparator,
  FixedChildren,
  Section,
  Subtitle,
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
  const [openedDevice, setOpenedDevice] = useState<Device | null>(
    null /* {
    id: 'alias.0.simon.light',
    type: 'room-light',
    roomName: 'Simon',
  } */
  )
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

  const hasHistory = false

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
              marginTop: '66vh',
            }}
            exit={{
              marginTop: '100vh',
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <Typography variant="h2">
              <span>{openedDevice.name || deviceDefinition.name}</span>
              <Indicators device={openedDevice} />
            </Typography>
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
