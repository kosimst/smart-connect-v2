import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'

const useOpenedDevices = () => {
  const openedStates = useLiveQuery(
    () =>
      ioBrokerDb.states
        .where('role')
        .equals('opened')
        .and((state) => state.value === true)
        .toArray(),
    [],
    Array<{
      id: string
      value: number
    }>()
  )

  const deviceIds = useMemo(
    () =>
      openedStates.map((state) => ({
        deviceId: state.id.split('.').slice(0, -1).join('.'),
        value: state.value,
      })),
    [openedStates]
  )

  const [infos, setInfos] = useState(
    Array<{
      device: Device
      openedState: 0 | 1 | 2
    }>()
  )

  useEffect(() => {
    const getDevices = async () => {
      const devices = (await ioBrokerDb.devices.bulkGet(
        deviceIds.map((d) => d.deviceId)
      )) as Device[]

      const devicesWithState = devices.map((d) => ({
        device: d,
        openedState: (deviceIds.find((b) => b.deviceId === d.id)?.value ?? 0
          ? 2
          : 0) as 0 | 1 | 2,
      }))

      const withoutWindowTiltedSensors = devicesWithState.filter(
        (d) => d.device.type !== 'window-tilted-sensor'
      )
      const windowTiltedSensors = devicesWithState.filter(
        (d) => d.device.type === 'window-tilted-sensor'
      )

      for (const deviceEntry of withoutWindowTiltedSensors) {
        if (deviceEntry.device.type !== 'window-opened-sensor') {
          continue
        }

        const matchingWindowTiltedSensor = windowTiltedSensors.find(
          (d) =>
            d.device.roomName === deviceEntry.device.roomName &&
            d.device.name === deviceEntry.device.name
        )

        if (!matchingWindowTiltedSensor) {
          continue
        }

        deviceEntry.openedState ||= matchingWindowTiltedSensor.openedState
          ? 1
          : 0
      }

      setInfos(devicesWithState)
    }

    getDevices()
  }, [deviceIds])

  return infos
}

export default useOpenedDevices
