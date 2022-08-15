import { useLiveQuery } from 'dexie-react-hooks'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'

const useWindowTilted = ({ roomName, name, type }: Device) => {
  if (type !== 'window-opened-sensor') {
    throw new Error(`Device ${name} is not a window opened sensor`)
  }

  const windowTiltedSensor = useLiveQuery(
    () =>
      ioBrokerDb.devices
        .where('type')
        .equals('window-tilted-sensor')
        .and((device) => device.roomName === roomName && device.name === name)
        .first(),
    [roomName, name]
  )

  const opened =
    useLiveQuery(
      () =>
        windowTiltedSensor &&
        ioBrokerDb.states
          .where('id')
          .startsWith(windowTiltedSensor.id)
          .and(({ role }) => role === 'opened')
          .first(),
      [windowTiltedSensor?.id]
    )?.value ?? false

  return [opened, !!windowTiltedSensor] as const
}

export default useWindowTilted
