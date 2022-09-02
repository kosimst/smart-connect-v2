import { useLiveQuery } from 'dexie-react-hooks'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'
import useDeviceState from './use-device-state'

const useWindowSensor = (
  { roomName, name, type }: Device,
  sensor: 'opened' | 'tilted'
) => {
  if (!['window-opened-sensor', 'window-tilted-sensor'].includes(type)) {
    throw new Error(`Device ${name} is not a window sensor`)
  }

  const windowSensor = useLiveQuery(
    () =>
      ioBrokerDb.devices
        .where('type')
        .equals(`window-${sensor}-sensor`)
        .and((device) => device.roomName === roomName && device.name === name)
        .first(),
    [roomName, name]
  )

  const [opened] = useDeviceState(windowSensor, 'opened', false)
  const [battery, , batteryExists] = useDeviceState(windowSensor, 'battery', 0)
  const [available, , availableExists] = useDeviceState(
    windowSensor,
    'available',
    true
  )
  const [batteryCritical, , batteryCriticalExists] = useDeviceState(
    windowSensor,
    'battery-critical',
    false
  )

  return {
    exists: !!windowSensor,
    opened,
    battery,
    batteryExists,
    batteryCritical,
    batteryCriticalExists,
    available,
    availableExists,
    device: windowSensor,
  } as const
}

export default useWindowSensor
