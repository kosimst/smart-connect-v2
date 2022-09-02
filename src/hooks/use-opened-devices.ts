import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useMemo, useState } from 'react'
import { useIoBrokerStates } from '../contexts/iobroker-states-context'
import ioBrokerDb from '../db/iobroker-db'
import Device from '../types/device'
import useDevices from './use-devices'

const useOpenedDevices = () => {
  const openedStates = useLiveQuery(
    () =>
      ioBrokerDb.states
        .where('role')
        .equals('opened')
        .and((state) => state.value === true || state.value === 1)
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

      const newInfos = devicesWithState.filter(
        (d) =>
          d.device.type !== 'window-tilted-sensor' &&
          d.device.type !== 'door-sensor'
      )
      const windowTiltedSensors = devicesWithState.filter(
        (d) => d.device.type === 'window-tilted-sensor'
      )

      for (const { device: windowTiltedSensor } of windowTiltedSensors) {
        const matchingWindowOpenedSensor = newInfos.find(
          (d) =>
            d.device.roomName === windowTiltedSensor.roomName &&
            d.device.name === windowTiltedSensor.name
        )

        if (matchingWindowOpenedSensor) {
          continue
        }

        newInfos.push({
          device: windowTiltedSensor,
          openedState: 1,
        })
      }

      setInfos(newInfos)
    }

    getDevices()
  }, [deviceIds])

  return infos
}

export default useOpenedDevices
