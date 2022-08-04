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
import Indicators from './indicators'
import { Backdrop, Card, FixedChildren, Subtitle } from './styles'

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
    () => openedDevice && deviceDefinitions[openedDevice.type],
    [openedDevice]
  )

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
              marginTop: '75vh',
            }}
            exit={{
              marginTop: '100vh',
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <h2>
              <span>{openedDevice.name || deviceDefinition.name}</span>
              <Indicators device={openedDevice} />
            </h2>
            <Subtitle>
              <span>
                {deviceDefinition.name} ({openedDevice.roomName || 'unset room'}
                )
              </span>
            </Subtitle>
          </Card>
        )}
      </AnimatePresence>
    </>
  )
}

const useDeviceDetails = () => useContext(DeviceDetailsContext)

export default useDeviceDetails
