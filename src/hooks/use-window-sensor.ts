import { useLiveQuery } from 'dexie-react-hooks'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'
import { SubscriptionPriority } from '../workers/iobroker-sync'
import useDeviceState from './use-device-state'

const useWindowSensor = (
  { roomName, name, type }: Device,
  sensor: 'opened' | 'tilted',
  priority: SubscriptionPriority = 'medium'
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

  const [opened] = useDeviceState(windowSensor, 'opened', false, priority)
  const [battery, , batteryExists] = useDeviceState(
    windowSensor,
    'battery',
    0,
    priority
  )
  const [available, , availableExists] = useDeviceState(
    windowSensor,
    'available',
    true,
    priority
  )
  const [batteryCritical, , batteryCriticalExists] = useDeviceState(
    windowSensor,
    'battery-critical',
    false,
    priority
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
